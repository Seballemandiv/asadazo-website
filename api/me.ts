// @ts-nocheck
import jwt from 'jsonwebtoken';
import { kv } from './_kv';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  try {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/session=([^;]+)/);
    if (!match) return res.status(200).json({ user: null });
    const token = match[1];
    const payload = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ user: { id: payload.sub, email: payload.email, role: payload.role } });
  } catch {
    return res.status(200).json({ user: null });
  }
}


