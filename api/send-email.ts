import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const TO_EMAIL = process.env.TO_EMAIL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body || {};
    const subject = data.subject || data.cut || 'Website message';

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.5">
        <h2>New website message</h2>
        ${Object.entries(data).map(([k, v]) => `<p><b>${k}:</b> ${String(v ?? '')}</p>`).join('')}
      </div>
    `;

    const result = await resend.emails.send({
      // For quick start without domain verification, use onboarding@resend.dev
      from: 'Asadazo <onboarding@resend.dev>',
      to: [TO_EMAIL],
      subject,
      html
    });

    if ((result as any)?.error) return res.status(500).json({ error: String((result as any).error) });
    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Email send failed' });
  }
}
