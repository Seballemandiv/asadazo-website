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
import { kv, kvUsersKey } from './_kv.js';
import jwt from 'jsonwebtoken';
import type { Subscription, SubscriptionProduct, Address } from '../src/types/index.js';

// Resend email setup
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL;

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Helper function to send email notifications
async function sendSubscriptionNotification(
  type: 'created' | 'updated' | 'paused' | 'cancelled' | 'activated',
  subscription: Subscription,
  user: any,
  changes?: any
) {
  if (!RESEND_API_KEY || !TO_EMAIL) {
    console.log('Email notification skipped - missing RESEND_API_KEY or TO_EMAIL');
    return;
  }

  try {
    const subject = `Subscription ${type.charAt(0).toUpperCase() + type.slice(1)} - ${user.name || user.email}`;
    
    let emailBody = `
      <h2>Subscription ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <p><strong>Customer:</strong> ${user.name || 'N/A'} (${user.email})</p>
      <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
      
      <h3>Subscription Details:</h3>
      <ul>
        <li><strong>Type:</strong> ${subscription.type}</li>
        <li><strong>Frequency:</strong> ${subscription.frequency}</li>
        <li><strong>Total Weight:</strong> ${subscription.totalWeight}kg</li>
        <li><strong>Status:</strong> ${subscription.status}</li>
        <li><strong>Next Delivery:</strong> ${new Date(subscription.nextDelivery).toLocaleDateString()}</li>
        <li><strong>Delivery Method:</strong> ${subscription.pickupOption ? 'Pickup' : 'Delivery'}</li>
      </ul>
    `;

    if (!subscription.pickupOption && subscription.deliveryAddress) {
      emailBody += `
        <h3>Delivery Address:</h3>
        <p>
          ${subscription.deliveryAddress.street} ${subscription.deliveryAddress.number || ''}<br>
          ${subscription.deliveryAddress.city}, ${subscription.deliveryAddress.postalCode}<br>
          ${subscription.deliveryAddress.country}
        </p>
      `;
    }

    emailBody += `
      <h3>Selected Products:</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>Product</th>
          <th>Weight (kg)</th>
          <th>Price/kg</th>
          <th>Subtotal</th>
        </tr>
    `;

    subscription.selectedProducts.forEach(product => {
      emailBody += `
        <tr>
          <td>${product.productName}</td>
          <td>${product.weight}</td>
          <td>€${product.price.toFixed(2)}</td>
          <td>€${(product.price * product.weight).toFixed(2)}</td>
        </tr>
      `;
    });

    const totalPrice = subscription.selectedProducts.reduce((sum, product) => sum + (product.price * product.weight), 0);
    emailBody += `
        <tr style="font-weight: bold;">
          <td colspan="3">Total</td>
          <td>€${totalPrice.toFixed(2)}</td>
        </tr>
      </table>
    `;

    if (subscription.notes) {
      emailBody += `<p><strong>Notes:</strong> ${subscription.notes}</p>`;
    }

    if (changes) {
      emailBody += `
        <h3>Changes Made:</h3>
        <ul>
          ${Object.entries(changes).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
        </ul>
      `;
    }

    emailBody += `
      <p><strong>Action Required:</strong> ${type === 'created' ? 'Review and confirm this subscription' : 
        type === 'updated' ? 'Review the changes made to this subscription' :
        type === 'paused' ? 'Customer has paused their subscription' :
        type === 'cancelled' ? 'Customer has cancelled their subscription' :
        'Subscription has been activated'}</p>
      
      <p>Best regards,<br>Asadazo System</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Asadazo <noreply@asadazo.nl>',
        to: [TO_EMAIL],
        subject: subject,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to send email notification:', error);
    } else {
      console.log(`Email notification sent for subscription ${type}:`, subscription.id);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

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
    const user = await kv.get(kvUsersKey(decoded.email));
    if (!user) return null;
    // KV may return a plain object or a JSON string depending on how it was stored
    if (typeof user === 'string') {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return user as any;
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

      // Admin can fetch site-wide subscriptions if ?all=true
      const isAdmin = user.role === 'admin';
      const allFlag = req.query?.all === 'true' || req.query?.all === '1';
      if (isAdmin && allFlag) {
        const rawIndex = (await kv.get('subscriptions_index')) || [];
        let indexArr: Array<{ id: string; userId: string }> = [];
        if (Array.isArray(rawIndex)) indexArr = rawIndex as any;
        else if (typeof rawIndex === 'string') indexArr = JSON.parse(rawIndex);

        // Collect subscriptions by user buckets
        const result: Subscription[] = [];
        const grouped: Record<string, string[]> = {};
        for (const entry of indexArr) {
          if (!grouped[entry.userId]) grouped[entry.userId] = [];
          grouped[entry.userId].push(entry.id);
        }
        for (const [uid, ids] of Object.entries(grouped)) {
          const bucket = (await kv.get(`subscriptions:${uid}`)) || [];
          const arr = Array.isArray(bucket) ? (bucket as Subscription[]) : JSON.parse(bucket as any);
          for (const sub of arr) if (ids.includes(sub.id)) result.push({ ...sub, userId: uid });
        }
        return res.status(200).json({ subscriptions: result });
      }

      // Default: return own subscriptions
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

      // Minimal global index for admin listing
      try {
        const rawIndex = (await kv.get('subscriptions_index')) || [];
        let indexArr: Array<{ id: string; userId: string }> = [];
        if (Array.isArray(rawIndex)) indexArr = rawIndex as any;
        else if (typeof rawIndex === 'string') indexArr = JSON.parse(rawIndex);
        if (!indexArr.some(e => e.id === subscription.id)) {
          indexArr.push({ id: subscription.id, userId: user.id });
          await kv.set('subscriptions_index', JSON.stringify(indexArr));
        }
      } catch (e) {
        console.error('Failed updating subscriptions_index', e);
      }

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
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { subscriptionId, updates, adminOverride } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ error: 'Subscription ID required' });
      }

      // Admin can update any user's subscription by passing adminOverride=true and targetUserId
      const targetUserId = adminOverride && user.role === 'admin' && req.body.targetUserId ? req.body.targetUserId : user.id;
      const subscriptions = await kv.get(`subscriptions:${targetUserId}`) || [];
      const subscriptionIndex = (subscriptions as Subscription[]).findIndex((sub: Subscription) => sub.id === subscriptionId);

      if (subscriptionIndex === -1) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Update subscription
      const originalSubscription = (subscriptions as Subscription[])[subscriptionIndex];
      const updatedSubscriptions = [...(subscriptions as Subscription[])];
      updatedSubscriptions[subscriptionIndex] = {
        ...updatedSubscriptions[subscriptionIndex],
        ...updates,
        lastModified: new Date()
      };

      await kv.set(`subscriptions:${targetUserId}`, JSON.stringify(updatedSubscriptions));

      // Send email notification for status changes
      const updatedSubscription = updatedSubscriptions[subscriptionIndex];
      if (updates.status && updates.status !== originalSubscription.status) {
        const notificationType = updates.status === 'paused' ? 'paused' :
                                updates.status === 'cancelled' ? 'cancelled' :
                                updates.status === 'active' ? 'activated' : 'updated';
        
        // Get user info for email
        const userForEmail = targetUserId === user.id ? user : await kv.get(kvUsersKey(targetUserId));
        const userObj = typeof userForEmail === 'string' ? JSON.parse(userForEmail) : userForEmail;
        
        await sendSubscriptionNotification(
          notificationType,
          updatedSubscription,
          userObj,
          { status: `${originalSubscription.status} → ${updates.status}` }
        );
      }

      return res.status(200).json({ 
        success: true, 
        subscription: updatedSubscription,
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