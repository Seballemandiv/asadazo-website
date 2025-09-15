// @ts-nocheck
import jwt from 'jsonwebtoken';
import { kv, kvUserOrdersKey } from './_kv.js';

export const config = { runtime: 'nodejs' };

const JWT_SECRET = process.env.JWT_SECRET;

function getUserFromReq(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  try {
    return jwt.verify(match[1], JWT_SECRET);
  } catch { return null; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  if (req.method === 'GET') {
    const list = (await kv.get(kvUserOrdersKey(user.sub))) || [];
    return res.status(200).json({ orders: list });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const existing = (await kv.get(kvUserOrdersKey(user.sub))) || [];
      const order = { ...body, id: body.id || Date.now().toString(), userId: user.sub, createdAt: new Date().toISOString() };
      const updated = [order, ...existing];
      await kv.set(kvUserOrdersKey(user.sub), updated);
      return res.status(200).json({ ok: true, order });
    } catch (e) {
      console.error('orders post error', e);
      return res.status(500).json({ error: 'Failed to save order' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { orderId, updates, adminOverride, targetUserId } = body || {};
      if (!orderId) return res.status(400).json({ error: 'Order ID required' });

      const isAdmin = user?.role === 'admin';
      const ownerId = adminOverride && isAdmin && targetUserId ? targetUserId : user.sub;

      const list = (await kv.get(kvUserOrdersKey(ownerId))) || [];
      const idx = list.findIndex((o) => o.id === orderId);
      if (idx === -1) return res.status(404).json({ error: 'Order not found' });

      list[idx] = { ...list[idx], ...updates, lastModified: new Date().toISOString() };
      await kv.set(kvUserOrdersKey(ownerId), list);
      return res.status(200).json({ ok: true, order: list[idx] });
    } catch (e) {
      console.error('orders put error', e);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}


