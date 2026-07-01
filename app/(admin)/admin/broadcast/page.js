'use client';

import { useState } from 'react';

export default function AdminBroadcast() {
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function send() {
    if (!subject.trim() || !bodyHtml.trim()) {
      setError('Subject and body are required');
      return;
    }
    if (!confirm(`Send to all matching users? This cannot be undone.`)) return;

    setSending(true);
    setError('');
    setResult(null);

    const res = await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject,
        body_html: bodyHtml,
        plan_filter: planFilter || null,
        verified_only: verifiedOnly,
      }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) {
      setError(data.error || 'Broadcast failed');
    } else {
      setResult(data);
    }
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 700 }}>Broadcast email</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        Send a custom email to a segment of your users. Emails are queued via Celery — check worker logs for delivery status.
      </p>

      {error && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: '#450a0a', borderRadius: 8, color: '#f87171', fontSize: 13 }}>
          {error}
        </div>
      )}
      {result && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: '#14532d', borderRadius: 8, color: '#4ade80', fontSize: 13 }}>
          Queued {result.queued} email(s) with subject &quot;{result.subject}&quot;
        </div>
      )}

      <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 680 }}>
        <div>
          <label>Subject *</label>
          <input
            type="text"
            placeholder="Important update from Snapit"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label>Body (HTML) *</label>
          <textarea
            rows={10}
            placeholder="<p>Hi, just wanted to let you know…</p>"
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
          <p style={{ margin: '6px 0 0', fontSize: 11, color: '#4b5563' }}>
            Tip: Use basic HTML — &lt;p&gt;, &lt;strong&gt;, &lt;a&gt;, &lt;ul&gt; etc. The email is sent raw, not wrapped in a template.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label>Segment by plan</label>
            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="">All plans</option>
              <option value="free">Free only</option>
              <option value="pro">Pro only</option>
              <option value="pro_ai">Pro + AI only</option>
              <option value="team">Team only</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                style={{ width: 'auto' }}
              />
              Verified users only
            </label>
          </div>
        </div>

        <div style={{ paddingTop: 4 }}>
          <button className="btn btn-primary" disabled={sending} onClick={send}
            style={{ padding: '10px 24px' }}>
            {sending ? 'Queueing…' : 'Send broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
}
