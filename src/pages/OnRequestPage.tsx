"use client"

import type React from "react"
import { useState } from "react"

export default function OnRequestPage() {
  const [values, setValues] = useState({ cut: "", name: "", phone: "", email: "", notes: "" })
  const [sent, setSent] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      setSent(true)
    } catch {
      alert("Something went wrong submitting your request. Please try again.")
    }
  }

  if (sent) {
    return (
      <div className="page container">
        <div className="card">
          <h2 className="title">Request received</h2>
          <p>We will source it and update you within 24–48 hours. Thank you.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <h1 className="title">On request</h1>
      <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.9 }}>
        If the cut you are looking for is not currently available, please submit your request. We will source it and
        provide you with an update within 24–48 hours.
      </p>
      <form className="card" onSubmit={onSubmit}>
        <input
          name="cut"
          placeholder="Cut name"
          value={values.cut}
          onChange={onChange}
          required
          style={{
            padding: "0.75rem",
            borderRadius: 8,
            border: "1px solid rgba(233,205,155,.35)",
            background: "rgba(122,51,38,.12)",
            color: "inherit",
            width: "100%",
          }}
        />
        <div style={{ height: 8 }} />
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
          <input
            name="name"
            placeholder="Full name"
            value={values.name}
            onChange={onChange}
            required
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              border: "1px solid rgba(233,205,155,.35)",
              background: "rgba(122,51,38,.12)",
              color: "inherit",
            }}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={values.phone}
            onChange={onChange}
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              border: "1px solid rgba(233,205,155,.35)",
              background: "rgba(122,51,38,.12)",
              color: "inherit",
            }}
          />
        </div>
        <div style={{ height: 8 }} />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={onChange}
          required
          style={{
            padding: "0.75rem",
            borderRadius: 8,
            border: "1px solid rgba(233,205,155,.35)",
            background: "rgba(122,51,38,.12)",
            color: "inherit",
            width: "100%",
          }}
        />
        <div style={{ height: 8 }} />
        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={values.notes}
          onChange={onChange}
          rows={5}
          style={{
            padding: "0.75rem",
            borderRadius: 8,
            border: "1px solid rgba(233,205,155,.35)",
            background: "rgba(122,51,38,.12)",
            color: "inherit",
            width: "100%",
            resize: "vertical",
          }}
        />
        <div style={{ height: 12 }} />
        <button
          type="submit"
          style={{
            padding: "0.9rem 1.25rem",
            borderRadius: 10,
            border: "1px solid var(--golden-beige)",
            background: "var(--malbec)",
            color: "var(--golden-beige)",
            cursor: "pointer",
          }}
        >
          Submit request
        </button>
      </form>
    </div>
  )
}
