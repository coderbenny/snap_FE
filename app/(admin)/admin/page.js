'use client';

import { useEffect, useState } from 'react';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/admin/system').then((r) => r.json()),
    ])
      .then(([s, sys]) => {
        setStats(s);
        setSystem(sys);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#6b7280' }}>Loading…</p>;

  const mrr = stats?.subscriptions?.mrr_usd_cents
    ? `$${(stats.subscriptions.mrr_usd_cents / 100).toFixed(0)}`
    : '$0';

  return (
    <div>
      <h1 style={{ margin: '0 0 24px', fontSize: 22, fontWeight: 700 }}>Overview</h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Users" value={stats?.users?.total ?? '—'} />
        <StatCard label="Active Users" value={stats?.users?.active ?? '—'} />
        <StatCard label="Verified Users" value={stats?.users?.verified ?? '—'} />
        <StatCard label="Active Subs" value={stats?.subscriptions?.active ?? '—'} accent="#4ade80" />
        <StatCard label="Past-Due Subs" value={stats?.subscriptions?.past_due ?? '—'} accent="#f87171" />
        <StatCard label="Est. MRR" value={mrr} accent="#60a5fa" />
        <StatCard label="Total Devices" value={stats?.devices?.total ?? '—'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Users by plan */}
        <div className="admin-card">
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Users by plan</h2>
          <table className="admin-table">
            <tbody>
              {['free', 'pro', 'pro_ai', 'team'].map((tier) => (
                <tr key={tier}>
                  <td>
                    <PlanBadge tier={tier} />
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {stats?.users?.by_plan?.[tier] ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System health */}
        <div className="admin-card">
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>System health</h2>
          {system && Object.entries(system).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2a2d3a', fontSize: 13 }}>
              <span style={{ color: '#9ca3af', textTransform: 'capitalize' }}>{key}</span>
              <span className={`badge ${val === 'ok' ? 'badge-green' : val === 'degraded' ? 'badge-yellow' : 'badge-red'}`}>
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent = '#e0e4f0' }) {
  return (
    <div className="admin-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
    </div>
  );
}

function PlanBadge({ tier }) {
  const map = {
    free: 'badge-gray',
    pro: 'badge-blue',
    pro_ai: 'badge-blue',
    team: 'badge-green',
  };
  return <span className={`badge ${map[tier] ?? 'badge-gray'}`}>{tier}</span>;
}
