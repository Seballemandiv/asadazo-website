// @ts-nocheck
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const TO_EMAIL = process.env.TO_EMAIL!;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
    if (!TO_EMAIL) return res.status(500).json({ error: 'Missing TO_EMAIL' });

    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const subject = data.subject || data.cut || 'Website message';

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.5">
        <h2>New website message</h2>
        ${Object.entries(data).map(([k, v]) => `<p><b>${k}:</b> ${String(v ?? '')}</p>`).join('')}
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Expandam <Allemandi.Sebastian@expandam.nl>',
      to: [TO_EMAIL],
      subject,
      html
    });

    if ((result as any)?.error) {
      return res.status(500).json({ error: (result as any).error?.message || 'Resend error' });
    }
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Email send failed' });
  }
}