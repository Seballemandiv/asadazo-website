// @ts-nocheck
import { createClient } from '@vercel/kv';

export const kv = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const kvUsersKey = (email) => `user:${email.toLowerCase()}`;
export const kvUserOrdersKey = (userId) => `orders:${userId}`;


