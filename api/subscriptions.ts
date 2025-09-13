import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from './_kv.js';
import jwt from 'jsonwebtoken';
import type { Subscription, SubscriptionProduct, Address } from '../src/types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Helper function to get user from session
async function getUserFromSession(req: VercelRequest) {
  const token = req.cookies?.session;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await kv.get(`user:${decoded.email}`);
    return user ? JSON.parse(user as string) : null;
  } catch {
    return null;
  }
}

// Helper function to generate subscription ID
function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Main handler for subscriptions API
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
      return res.status(200).json({ subscriptions: subscriptions as Subscription[] });
    }

    if (req.method === 'POST') {
      const { type, selectedProducts, frequency, deliveryAddress, pickupOption, notes } = req.body;

      // Validate required fields
      if (!type || !selectedProducts || !frequency || !deliveryAddress) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate total weight
      const totalWeight = selectedProducts.reduce((sum: number, product: SubscriptionProduct) => 
        sum + product.weight, 0
      );

      // Calculate next delivery date based on frequency
      let daysToAdd = 30; // default monthly
      switch (frequency) {
        case 'weekly':
          daysToAdd = 7;
          break;
        case 'biweekly':
          daysToAdd = 14;
          break;
        case 'triweekly':
          daysToAdd = 21;
          break;
        case 'monthly':
          daysToAdd = 30;
          break;
      }

      // Create subscription
      const subscription: Subscription = {
        id: generateSubscriptionId(),
        userId: user.id,
        type,
        totalWeight,
        selectedProducts,
        frequency,
        status: 'pending review',
        nextDelivery: new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        lastModified: new Date(),
        notes,
        deliveryAddress,
        pickupOption
      };

      // Save subscription
      const existingSubscriptions = await kv.get(`subscriptions:${user.id}`) || [];
      const updatedSubscriptions = [...(existingSubscriptions as Subscription[]), subscription];
      await kv.set(`subscriptions:${user.id}`, JSON.stringify(updatedSubscriptions));

      return res.status(200).json({ 
        success: true, 
        subscription,
        message: 'Subscription created successfully' 
      });
    }

    if (req.method === 'PUT') {
      const { subscriptionId, updates } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'Subscription ID required' });
      }

      const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
      const subscriptionIndex = (subscriptions as Subscription[]).findIndex((sub: Subscription) => sub.id === subscriptionId);

      if (subscriptionIndex === -1) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Update subscription
      const updatedSubscriptions = [...(subscriptions as Subscription[])];
      updatedSubscriptions[subscriptionIndex] = {
        ...updatedSubscriptions[subscriptionIndex],
        ...updates,
        lastModified: new Date()
      };

      await kv.set(`subscriptions:${user.id}`, JSON.stringify(updatedSubscriptions));

      return res.status(200).json({ 
        success: true, 
        subscription: updatedSubscriptions[subscriptionIndex],
        message: 'Subscription updated successfully' 
      });
    }

    if (req.method === 'DELETE') {
      const subscriptionId = req.query.id as string;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'Subscription ID required' });
      }

      const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
      const subscriptionIndex = (subscriptions as Subscription[]).findIndex((sub: Subscription) => sub.id === subscriptionId);

      if (subscriptionIndex === -1) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Cancel subscription (soft delete)
      const updatedSubscriptions = [...(subscriptions as Subscription[])];
      updatedSubscriptions[subscriptionIndex].status = 'cancelled';
      updatedSubscriptions[subscriptionIndex].lastModified = new Date();

      await kv.set(`subscriptions:${user.id}`, JSON.stringify(updatedSubscriptions));

      return res.status(200).json({ 
        success: true, 
        message: 'Subscription cancelled successfully' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}