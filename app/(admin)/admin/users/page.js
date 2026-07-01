'use client';

import { useCallback, useEffect, useState } from 'react';

export default function AdminUsers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState({});

  const load = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ page, per_page: 25 });
    if (search) qs.set('search', search);
    if (planFilter) qs.set('plan', planFilter);
    fetch(`/api/admin/users?${qs}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [page, search, planFilter]);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(user) {
    setBusy((b) => ({ ...b, [user.id]: true }));
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !user.is_active }),
    });
    setBusy((b) => ({ ...b, [user.id]: false }));
    load();
  }

  async function toggleAdmin(user) {
    if (!confirm(`${user.is_admin ? 'Remove' : 'Grant'} admin for ${user.email}?`)) return;
    setBusy((b) => ({ ...b, [user.id]: true }));
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_admin: !user.is_admin }),
    });
    setBusy((b) => ({ ...b, [user.id]: false }));
    load();
  }

  async function deleteUser(user) {
    if (!confirm(`Delete ${user.email} and all their data? This cannot be undone.`)) return;
    setBusy((b) => ({ ...b, [user.id]: true }));
    await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 700 }}>Users</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: 280 }}
        />
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          style={{ maxWidth: 140 }}
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="pro_ai">Pro + AI</option>
          <option value="team">Team</option>
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
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span style={{ fontWeight: 500 }}>{u.email}</span>
                    {u.is_admin && (
                      <span className="badge badge-yellow" style={{ marginLeft: 6 }}>admin</span>
                    )}
                  </td>
                  <td><PlanBadge tier={u.plan_tier} /></td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                      {u.is_active ? 'active' : 'disabled'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.verified ? 'badge-green' : 'badge-gray'}`}>
                      {u.verified ? 'yes' : 'no'}
                    </span>
                  </td>
                  <td style={{ color: '#6b7280' }}>{fmtDate(u.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn ${u.is_active ? 'btn-ghost' : 'btn-primary'}`}
                        disabled={busy[u.id]}
                        onClick={() => toggleActive(u)}
                      >
                        {u.is_active ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        className="btn btn-ghost"
                        disabled={busy[u.id]}
                        onClick={() => toggleAdmin(u)}
                      >
                        {u.is_admin ? '–Admin' : '+Admin'}
                      </button>
                      <button
                        className="btn btn-danger"
                        disabled={busy[u.id]}
                        onClick={() => deleteUser(u)}
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

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Prev
          </button>
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            Page {page} of {data.pages} ({data.total} users)
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
