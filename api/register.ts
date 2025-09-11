// @ts-nocheck
import { kv, kvUsersKey } from './_kv';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, password, phone } = body || {};
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = await kv.get(kvUsersKey(email));
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash: hashed,
      createdAt: new Date().toISOString(),
      role: 'customer',
      verified: false
    };

    await kv.set(kvUsersKey(email), user);
    return res.status(200).json({ ok: true, user: { ...user, passwordHash: undefined } });
  } catch (e) {
    console.error('register error', e);
    return res.status(500).json({ error: 'Registration failed' });
  }
}


