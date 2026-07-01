'use client';

import { useCallback, useEffect, useState } from 'react';

const EMPTY_FORM = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: '',
  max_uses: '',
  tier_restriction: '',
  valid_until: '',
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((r) => r.json())
      .then((d) => setCoupons(d.coupons || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    setSaving(true);
    setError('');
    const body = {
      code: form.code,
      description: form.description || undefined,
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      tier_restriction: form.tier_restriction || null,
      valid_until: form.valid_until || null,
    };
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || 'Failed to create coupon');
      return;
    }
    setShowCreate(false);
    setForm(EMPTY_FORM);
    load();
  }

  async function toggleActive(c) {
    setBusy((b) => ({ ...b, [c.id]: true }));
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    setBusy((b) => ({ ...b, [c.id]: false }));
    load();
  }

  async function deleteCoupon(c) {
    if (!confirm(`Delete coupon ${c.code}? Cannot delete if it has been used.`)) return;
    setBusy((b) => ({ ...b, [c.id]: true }));
    const res = await fetch(`/api/admin/coupons/${c.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || 'Cannot delete this coupon');
    }
    setBusy((b) => ({ ...b, [c.id]: false }));
    load();
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Coupons</h1>
        <button className="btn btn-primary" onClick={() => { setShowCreate(true); setError(''); }}>
          + New coupon
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 20, color: '#6b7280' }}>Loading…</p>
        ) : coupons.length === 0 ? (
          <p style={{ padding: 20, color: '#6b7280' }}>No coupons yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Uses</th>
                <th>Tier</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#a5b4fc' }}>
                      {c.code}
                    </span>
                    {c.description && (
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{c.description}</div>
                    )}
                  </td>
                  <td>
                    {c.discount_type === 'percentage'
                      ? `${c.discount_value}%`
                      : `$${(c.discount_value / 100).toFixed(2)}`}
                  </td>
                  <td style={{ color: '#9ca3af' }}>
                    {c.current_uses}{c.max_uses ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td>
                    {c.tier_restriction
                      ? <PlanBadge tier={c.tier_restriction} />
                      : <span style={{ color: '#4b5563', fontSize: 12 }}>any</span>}
                  </td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>
                    {c.valid_until ? fmtDate(c.valid_until) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${c.is_active ? 'badge-green' : 'badge-red'}`}>
                      {c.is_active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost"
                        disabled={busy[c.id]}
                        onClick={() => toggleActive(c)}
                      >
                        {c.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-danger"
                        disabled={busy[c.id]}
                        onClick={() => deleteCoupon(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div className="admin-card" style={{ width: 440 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16 }}>Create coupon</h3>
            {error && (
              <div style={{ marginBottom: 14, padding: '8px 12px', background: '#450a0a', borderRadius: 6, color: '#f87171', fontSize: 13 }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Code *</label>
                <input
                  type="text"
                  placeholder="SUMMER25"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Summer promotion"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Discount type *</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_usd_cents">Fixed ($)</option>
                  </select>
                </div>
                <div>
                  <label>
                    {form.discount_type === 'percentage' ? 'Value (1–100)' : 'Value in cents'} *
                  </label>
                  <input
                    type="number"
                    placeholder={form.discount_type === 'percentage' ? '20' : '500'}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label>Max uses (blank = unlimited)</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={form.max_uses}
                    onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                  />
                </div>
                <div>
                  <label>Tier restriction</label>
                  <select
                    value={form.tier_restriction}
                    onChange={(e) => setForm({ ...form, tier_restriction: e.target.value })}
                  >
                    <option value="">Any tier</option>
                    <option value="pro">Pro</option>
                    <option value="pro_ai">Pro + AI</option>
                    <option value="team">Team</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Valid until (blank = no expiry)</label>
                <input
                  type="datetime-local"
                  value={form.valid_until}
                  onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => { setShowCreate(false); setError(''); }}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={saving} onClick={create}>
                {saving ? 'Creating…' : 'Create coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanBadge({ tier }) {
  const map = { free: 'badge-gray', pro: 'badge-blue', pro_ai: 'badge-blue', team: 'badge-green' };
  return <span className={`badge ${map[tier] ?? 'badge-gray'}`}>{tier}</span>;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
