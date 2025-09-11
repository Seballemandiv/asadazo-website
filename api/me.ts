// @ts-nocheck
import jwt from 'jsonwebtoken';
import { kv } from './_kv';

export const config = { runtime: 'nodejs' };

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/session=([^;]+)/);
    if (!match) return res.status(200).json({ user: null });
    const token = match[1];
    const payload = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ user: { id: payload.sub, email: payload.email, role: payload.role } });
  } catch (e) {
    return res.status(200).json({ user: null, message: e?.message || null });
  }
}


