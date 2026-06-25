import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ClipboardList, Monitor, CreditCard, Download, Zap } from 'lucide-react';
import { sessionOptions } from '@/lib/session';

export const metadata = { title: 'Dashboard' };

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const email = session.userEmail || 'there';
  const firstName = email.split('@')[0];

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
        <StatCard icon={ClipboardList} label="Total Clips" value="—" sub="Sync from the desktop app" />
        <StatCard icon={Monitor} label="Devices" value="—" sub="No devices connected yet" />
        <StatCard icon={CreditCard} label="Plan" value="Free" sub="1 device · local only" />
        <StatCard icon={Zap} label="Sync" value="—" sub="Install the app to start" />
      </div>

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

        {/* Empty state */}
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
