// @ts-nocheck
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const TO_EMAIL = process.env.TO_EMAIL!;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const {
      items = [],
      totals = {},
      deliveryZone,
      customer = {},
    } = body;

    const subject = `New order (pending) - ${customer?.name || 'Anonymous'}`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <h2>New order (pending)</h2>
        <h3>Items</h3>
        <ul>
          ${items.map((it:any) => `<li>${it.name} — ${it.quantity}kg — €${(it.lineTotal || 0).toFixed?.(2) ?? it.lineTotal}</li>`).join('')}
        </ul>
        <p><b>Subtotal:</b> €${Number(totals.subtotal || 0).toFixed(2)}</p>
        <p><b>Delivery fee:</b> €${Number(totals.delivery || 0).toFixed(2)}</p>
        <p><b>Total:</b> €${Number(totals.total || 0).toFixed(2)}</p>
        <p><b>Delivery:</b> ${deliveryZone}</p>
        <h3>Customer</h3>
        ${Object.entries(customer).map(([k,v])=>`<p><b>${k}:</b> ${String(v||'')}</p>`).join('')}
      </div>
    `;

    const result = await resend.emails.send({
      from: 'Expandam <Allemandi.Sebastian@expandam.nl>',
      to: [TO_EMAIL],
      subject,
      html,
    });

    if ((result as any)?.error) {
      return res.status(500).json({ error: (result as any).error?.message || 'Resend error' });
    }
    return res.status(200).json({ ok: true });
  } catch (err:any) {
    return res.status(500).json({ error: err?.message || 'Failed to create order' });
  }
}


