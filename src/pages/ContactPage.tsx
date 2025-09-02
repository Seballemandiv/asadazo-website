import React, { useState } from 'react';

export default function ContactPage() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSent(true);
  } catch {
    alert('Something went wrong sending your message. Please try again.');
  }
};

  return (
    <div className="page container">
      <h1 className="title">Contact us</h1>
      <form className="card" onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <input name="name" placeholder="Full name" value={values.name} onChange={onChange} required
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid rgba(233,205,155,.35)', background: 'rgba(122,51,38,.12)', color: 'inherit' }} />
          <input name="email" type="email" placeholder="Email" value={values.email} onChange={onChange} required
            style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid rgba(233,205,155,.35)', background: 'rgba(122,51,38,.12)', color: 'inherit' }} />
        </div>
        <div style={{ height: 8 }} />
        <input name="subject" placeholder="Subject" value={values.subject} onChange={onChange} required
          style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid rgba(233,205,155,.35)', background: 'rgba(122,51,38,.12)', color: 'inherit', width: '100%' }} />
        <div style={{ height: 8 }} />
        <textarea name="message" placeholder="Message" value={values.message} onChange={onChange} required rows={6}
          style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid rgba(233,205,155,.35)', background: 'rgba(122,51,38,.12)', color: 'inherit', width: '100%', resize: 'vertical' }} />
        <div style={{ height: 12 }} />
        <button type="submit" style={{ padding: '0.9rem 1.25rem', borderRadius: 10, border: '1px solid var(--golden-beige)', background: 'var(--malbec)', color: 'var(--golden-beige)', cursor: 'pointer' }}>
          Send message
        </button>
      </form>
    </div>
  );
}
