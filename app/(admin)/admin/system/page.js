'use client';

import { useCallback, useEffect, useState } from 'react';

export default function AdminSystem() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/system')
      .then((r) => r.json())
      .then(setHealth)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>System health</h1>
        <button className="btn btn-ghost" onClick={refresh} disabled={loading}>
          {loading ? 'Checking…' : 'Refresh'}
        </button>
      </div>

      {health && (
        <div style={{ maxWidth: 480 }}>
          <div className="admin-card">
            {Object.entries(health).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid #2a2d3a',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 14 }}>
                    {key}
                  </span>
                  {val !== 'ok' && val !== 'degraded' && (
                    <div style={{ fontSize: 11, color: '#f87171', marginTop: 4, fontFamily: 'monospace' }}>
                      {val}
                    </div>
                  )}
                </div>
                <span className={`badge ${
                  val === 'ok' ? 'badge-green'
                  : val === 'degraded' ? 'badge-yellow'
                  : 'badge-red'
                }`}>
                  {val === 'ok' ? 'OK' : val === 'degraded' ? 'Degraded' : 'Error'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
