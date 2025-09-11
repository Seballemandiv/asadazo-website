// @ts-nocheck
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Check environment variables first
    const hasUrl = !!process.env.UPSTASH_REDIS_REST_URL;
    const hasToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;
    const hasJwt = !!process.env.JWT_SECRET;
    
    if (!hasUrl || !hasToken) {
      return res.status(500).json({ 
        ok: false, 
        message: 'Missing environment variables',
        env: { hasUrl, hasToken, hasJwt }
      });
    }
    // Dynamically import KV client to avoid top-level crashes
    const { kv } = await import('@vercel/kv');
    const key = 'healthcheck:' + new Date().toISOString().slice(0, 19);
    await kv.set(key, 'ok', { ex: 30 });
    const val = await kv.get(key);
    return res.status(200).json({ ok: true, value: val ?? null });
  } catch (e) {
    // Ensure we always return JSON with the error message
    return res.status(500).json({ ok: false, message: e?.message || 'Unknown KV error', stack: e?.stack || null });
  }
}


