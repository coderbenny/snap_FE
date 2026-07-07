'use client';

import { useCallback, useEffect, useState } from 'react';

export default function AdminSubscriptions() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page, per_page: 25 });
    if (statusFilter) qs.set('status', statusFilter);
    fetch(`/api/admin/subscriptions?${qs}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function openEdit(sub) {
    setEditing(sub);
    setForm({
      status: sub.status,
      expires_at: sub.expires_at?.slice(0, 16),
      tier: sub.tier,
      file_transfer_addon: sub.file_transfer_addon ?? false,
    });
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/subscriptions/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(null);
    load();
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 700 }}>Subscriptions</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ maxWidth: 160 }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past due</option>
          <option value="cancelled">Cancelled</option>
          <option value="trialing">Trialing</option>
        </select>
        <button className="btn btn-ghost" onClick={load}>Refresh</button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 20, color: '#6b7280' }}>Loading…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Tier</th>
                <th>Status</th>
                <th>File Xfer</th>
                <th>Expires</th>
                <th>Paystack sub</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.subscriptions?.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: '#9ca3af' }}>{s.user_email || s.user_id}</td>
                  <td><PlanBadge tier={s.tier} /></td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {s.file_transfer_addon
                      ? <span className="badge badge-green">on</span>
                      : <span className="badge badge-gray">off</span>}
                  </td>
                  <td style={{ color: '#6b7280', fontSize: 12 }}>{fmtDate(s.expires_at)}</td>
                  <td style={{ color: '#4b5563', fontSize: 11 }}>{s.paystack_sub_code || '—'}</td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => openEdit(s)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Prev
          </button>
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            Page {page} of {data.pages} ({data.total} subscriptions)
          </span>
          <button
            className="btn btn-ghost"
            disabled={page >= data.pages}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
        }}>
          <div className="admin-card" style={{ width: 400 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16 }}>
              Edit subscription — {editing.user_email}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">active</option>
                  <option value="past_due">past_due</option>
                  <option value="cancelled">cancelled</option>
                  <option value="trialing">trialing</option>
                </select>
              </div>
              <div>
                <label>Tier</label>
                <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  <option value="pro">pro</option>
                  <option value="pro_ai">pro_ai</option>
                  <option value="team">team</option>
                </select>
              </div>
              <div>
                <label>Expires at</label>
                <input
                  type="datetime-local"
                  value={form.expires_at || ''}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ margin: 0 }}>File Transfer Addon</label>
                <input
                  type="checkbox"
                  checked={form.file_transfer_addon ?? false}
                  onChange={(e) => setForm({ ...form, file_transfer_addon: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving} onClick={save}>
                {saving ? 'Saving…' : 'Save'}
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

function StatusBadge({ status }) {
  const map = {
    active: 'badge-green',
    past_due: 'badge-yellow',
    cancelled: 'badge-red',
    trialing: 'badge-blue',
  };
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
