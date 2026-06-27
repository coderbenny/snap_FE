import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ClipboardList, Monitor, CreditCard, Download, Zap } from 'lucide-react';
import { sessionOptions } from '@/lib/session';
import { authedApi } from '@/lib/api';

export const metadata = { title: 'Dashboard' };

function StatCard({ icon: Icon, label, value, sub, href }) {
  const inner = (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function planLabel(plan) {
  return { free: 'Free', pro: 'Pro', pro_ai: 'Pro + AI', team: 'Team' }[plan] ?? 'Free';
}

export default async function DashboardPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const email = session.userEmail || 'there';
  const firstName = email.split('@')[0];

  // Fetch profile + device count in parallel — fail gracefully
  let plan = 'free';
  let deviceCount = 0;

  try {
    const client = authedApi(session.accessToken);
    const [profileRes, devicesRes] = await Promise.allSettled([
      client.get('/auth/me'),
      client.get('/devices'),
    ]);
    if (profileRes.status === 'fulfilled') plan = profileRes.value.data.plan ?? 'free';
    if (devicesRes.status === 'fulfilled') deviceCount = devicesRes.value.data.devices?.length ?? 0;
  } catch {
    // Non-critical — display statics work fine without these
  }

  const isPro = plan !== 'free';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your clipboard vault.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Total Clips"
          value="—"
          sub="Sync from the desktop app"
          href="/clipboard"
        />
        <StatCard
          icon={Monitor}
          label="Devices"
          value={deviceCount || '—'}
          sub={deviceCount ? `${deviceCount} device${deviceCount !== 1 ? 's' : ''} connected` : 'No devices yet'}
          href="/devices"
        />
        <StatCard
          icon={CreditCard}
          label="Plan"
          value={planLabel(plan)}
          sub={isPro ? 'Cross-device sync active' : 'Upgrade for sync'}
          href="/billing"
        />
        <StatCard
          icon={Zap}
          label="Sync"
          value={isPro ? 'Active' : '—'}
          sub={isPro ? 'Clips sync across devices' : 'Install the app to start'}
        />
      </div>

      {/* Upgrade nudge for free users */}
      {!isPro && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Unlock cross-device sync</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Upgrade to Pro for unlimited clip history and sync across up to 5 devices.
              </p>
            </div>
            <Link
              href="/billing"
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Upgrade — $5/mo
            </Link>
          </div>
        </div>
      )}

      {/* Recent clips */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Recent Clipboard Items</h2>
          <Link
            href="/clipboard"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <ClipboardList className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No clips yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Copy anything on a device with SNAP installed and it will appear here automatically.
          </p>
          <Link
            href="/download"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="size-4" />
            Download SNAP
          </Link>
        </div>
      </div>
    </div>
  );
}
