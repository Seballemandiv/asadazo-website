// @ts-nocheck
import { kv } from '@vercel/kv';

export const kvUsersKey = (email) => `user:${email.toLowerCase()}`;
export const kvUserOrdersKey = (userId) => `orders:${userId}`;

export { kv };


