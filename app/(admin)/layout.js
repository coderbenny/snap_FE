import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { sessionOptions } from '@/lib/session';

export const metadata = { title: 'Snapit Admin' };

export default async function AdminLayout({ children }) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.userId || !session.isAdmin) redirect('/login');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1117' }}>
      <nav style={{
        width: 220,
        background: '#1a1d27',
        borderRight: '1px solid #2a2d3a',
        padding: '24px 0',
        flexShrink: 0,
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #2a2d3a' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.5px' }}>
            Snapit Admin
          </span>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid #2a2d3a',
              color: '#a0a8c0',
              fontSize: 12,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#22253a'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a0a8c0'; }}
          >
            ← Back to dashboard
          </Link>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: '12px 0' }}>
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/users', label: 'Users' },
            { href: '/admin/subscriptions', label: 'Subscriptions' },
            { href: '/admin/coupons', label: 'Coupons' },
            { href: '/admin/broadcast', label: 'Broadcast' },
            { href: '/admin/system', label: 'System' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                style={{
                  display: 'block',
                  padding: '8px 20px',
                  color: '#a0a8c0',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', color: '#e0e4f0' }}>
        {children}
      </main>

      <style>{`
        nav a:hover { color: #fff !important; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .admin-card {
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 20px 24px;
        }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .admin-table th {
          text-align: left; padding: 10px 12px;
          color: #6b7280; font-weight: 600; font-size: 11px;
          text-transform: uppercase; letter-spacing: 0.5px;
          border-bottom: 1px solid #2a2d3a;
        }
        .admin-table td { padding: 10px 12px; border-bottom: 1px solid #1e2130; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: #1e2235; }
        .badge {
          display: inline-block; padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
        }
        .badge-green { background: #14532d; color: #4ade80; }
        .badge-red { background: #450a0a; color: #f87171; }
        .badge-yellow { background: #451a03; color: #fbbf24; }
        .badge-gray { background: #1f2937; color: #9ca3af; }
        .badge-blue { background: #1e3a5f; color: #60a5fa; }
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500;
          cursor: pointer; border: none; text-decoration: none;
        }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-danger { background: #7f1d1d; color: #fca5a5; }
        .btn-danger:hover { background: #991b1b; }
        .btn-ghost { background: transparent; color: #9ca3af; border: 1px solid #374151; }
        .btn-ghost:hover { background: #1f2937; color: #fff; }
        input[type="text"], input[type="email"], input[type="number"],
        select, textarea {
          background: #0f1117; border: 1px solid #374151; color: #e0e4f0;
          border-radius: 6px; padding: 8px 12px; font-size: 13px;
          outline: none; width: 100%;
        }
        input:focus, select:focus, textarea:focus { border-color: #4b5563; }
        label { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 6px; }
      `}</style>
    </div>
  );
}
