// VercelRequest and VercelResponse types
interface VercelRequest {
  method?: string;
  body?: any;
  query?: { [key: string]: string | string[] | undefined };
  cookies?: { [key: string]: string };
  headers?: { [key: string]: string | undefined };
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}
import { kv } from './_kv.js';
import jwt from 'jsonwebtoken';
import type { Subscription, SubscriptionProduct, Address } from '../src/types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Helper function to get user from session
async function getUserFromSession(req: VercelRequest) {
  // Try cookie object first (local dev), then raw header (production)
  let token = req.cookies?.session;
  if (!token) {
    const raw = req.headers?.cookie || '';
    const match = raw.match(/session=([^;]+)/);
    token = match ? match[1] : undefined;
  }
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

  if (req.method === 'GET') {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const existing = (await kv.get(`subscriptions:${user.id}`)) || [];
      return res.status(200).json({ subscriptions: existing as Subscription[] });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Require login for creating subscriptions
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in to create a subscription.' });
      }

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

      // Create subscription under the logged-in user
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

      // Save subscription directly to the user's list
      const current = (await kv.get(`subscriptions:${user.id}`)) || [];
      const updatedUserSubscriptions = [...(Array.isArray(current) ? (current as Subscription[]) : []), subscription];
      await kv.set(`subscriptions:${user.id}`, JSON.stringify(updatedUserSubscriptions));

      // Send email notification
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const totalPrice = selectedProducts.reduce((sum: number, product: SubscriptionProduct) => sum + (product.weight * product.price), 0);
        
        await resend.emails.send({
          from: 'Asadazo <noreply@asadazo.nl>',
          to: [process.env.TO_EMAIL || 'info@asadazo.nl'],
          subject: `New Subscription Request - ${subscription.id}`,
          html: `
            <h2>New Subscription Request</h2>
            <p><strong>Subscription ID:</strong> ${subscription.id}</p>
            <p><strong>Type:</strong> ${subscription.type}</p>
            <p><strong>Frequency:</strong> ${subscription.frequency}</p>
            <p><strong>Total Weight:</strong> ${subscription.totalWeight}kg</p>
            <p><strong>Total Price:</strong> €${totalPrice.toFixed(2)}</p>
            <p><strong>Delivery Method:</strong> ${subscription.pickupOption ? 'Pickup' : 'Delivery'}</p>
            <p><strong>Customer Email:</strong> ${user.email || 'Not provided'}</p>
            
            <h3>Selected Products:</h3>
            <ul>
              ${selectedProducts.map((product: SubscriptionProduct) => 
                `<li>${product.productName} - ${product.weight}kg × €${product.price} = €${(product.weight * product.price).toFixed(2)}</li>`
              ).join('')}
            </ul>
            
            <h3>Delivery Address:</h3>
            <p>${deliveryAddress.street} ${deliveryAddress.number}<br>
            ${deliveryAddress.city} ${deliveryAddress.postalCode}<br>
            ${deliveryAddress.country}</p>
            
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          `
        });
      } catch (emailError) {
        console.error('Error sending subscription email:', emailError);
      }

      return res.status(200).json({ 
        success: true, 
        subscription,
        message: 'Subscription created successfully and sent for review' 
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

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
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await getUserFromSession(req);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const subscriptionId = req.query?.id as string;

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
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}