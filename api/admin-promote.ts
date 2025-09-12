// @ts-nocheck
import { kv, kvUsersKey } from './_kv.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email } = body || {};
    if (!email) return res.status(400).json({ error: 'Email required' });
    const key = kvUsersKey(email);
    const user = await kv.get(key);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = 'admin';
    await kv.set(key, user);
    return res.status(200).json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to promote', message: e?.message });
  }
}


