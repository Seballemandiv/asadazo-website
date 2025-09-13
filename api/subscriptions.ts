import { NextRequest, NextResponse } from 'next/server';
import { kv } from './_kv.js';
import jwt from 'jsonwebtoken';
import type { Subscription, SubscriptionProduct } from '../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Helper function to get user from session
async function getUserFromSession(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await kv.get(`user:${decoded.email}`);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Helper function to generate subscription ID
function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET /api/subscriptions - Get user's subscriptions
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, selectedProducts, frequency, deliveryAddress, pickupOption, notes } = body;

    // Validate required fields
    if (!type || !selectedProducts || !frequency || !deliveryAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total weight
    const totalWeight = selectedProducts.reduce((sum: number, product: SubscriptionProduct) => 
      sum + product.weight, 0
    );

    // Validate weight based on type
    if (type === 'weekly' && totalWeight !== 4) {
      return NextResponse.json({ error: 'Weekly subscription must be exactly 4kg' }, { status: 400 });
    }
    if (type === 'monthly' && totalWeight !== 12) {
      return NextResponse.json({ error: 'Monthly subscription must be exactly 12kg' }, { status: 400 });
    }

    // Create subscription
    const subscription: Subscription = {
      id: generateSubscriptionId(),
      userId: user.id,
      type,
      totalWeight,
      selectedProducts,
      frequency,
      status: 'active',
      nextDelivery: new Date(Date.now() + (frequency === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      lastModified: new Date(),
      notes,
      deliveryAddress,
      pickupOption
    };

    // Save subscription
    const existingSubscriptions = await kv.get(`subscriptions:${user.id}`) || [];
    const updatedSubscriptions = [...existingSubscriptions, subscription];
    await kv.set(`subscriptions:${user.id}`, JSON.stringify(updatedSubscriptions));

    return NextResponse.json({ 
      success: true, 
      subscription,
      message: 'Subscription created successfully' 
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/subscriptions - Update subscription
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId, updates } = body;

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
    const subscriptionIndex = subscriptions.findIndex((sub: Subscription) => sub.id === subscriptionId);

    if (subscriptionIndex === -1) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Update subscription
    subscriptions[subscriptionIndex] = {
      ...subscriptions[subscriptionIndex],
      ...updates,
      lastModified: new Date()
    };

    await kv.set(`subscriptions:${user.id}`, JSON.stringify(subscriptions));

    return NextResponse.json({ 
      success: true, 
      subscription: subscriptions[subscriptionIndex],
      message: 'Subscription updated successfully' 
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/subscriptions - Cancel subscription
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 });
    }

    const subscriptions = await kv.get(`subscriptions:${user.id}`) || [];
    const subscriptionIndex = subscriptions.findIndex((sub: Subscription) => sub.id === subscriptionId);

    if (subscriptionIndex === -1) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // Cancel subscription (soft delete)
    subscriptions[subscriptionIndex].status = 'cancelled';
    subscriptions[subscriptionIndex].lastModified = new Date();

    await kv.set(`subscriptions:${user.id}`, JSON.stringify(subscriptions));

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
