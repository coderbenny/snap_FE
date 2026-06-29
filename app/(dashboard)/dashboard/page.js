import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import Link from 'next/link';
import {
  ClipboardList,
  Monitor,
  CreditCard,
  Download,
  Zap,
  Lock,
  Link2,
  FileText,
  Image,
  File,
} from 'lucide-react';
import { sessionOptions } from '@/lib/session';
import { serverFetch } from '@/lib/api';

export const metadata = { title: 'Dashboard' };

// ── Helpers ──────────────────────────────────────────────────────────────────

function planLabel(plan) {
  return { free: 'Free', pro: 'Pro', pro_ai: 'Pro + AI', team: 'Team' }[plan] ?? 'Free';
}

function typeIcon(contentType) {
  return { url: Link2, image: Image, file: File }[contentType] ?? FileText;
}

function typeLabel(contentType) {
  return { url: 'URL', image: 'Image', file: 'File' }[contentType] ?? 'Text';
}

function relativeTime(ms) {
  if (!ms) return '';
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'yesterday';
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function RecentClipRow({ clip }) {
  const Icon = typeIcon(clip.content_type);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{typeLabel(clip.content_type)}</p>
        <p className="text-xs text-muted-foreground">
          Encrypted · {relativeTime(clip.client_created_at)}
          {clip.device_id && ' · synced'}
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const email = session.userEmail || '';
  const firstName = email ? email.split('@')[0] : 'there';

  let plan = 'free';
  let deviceCount = 0;
  let clipCount = null;   // null = not yet fetched / not accessible
  let recentClips = [];

  // Always fetch profile + devices (handles token refresh transparently).
  const [profileRes, devicesRes] = await Promise.allSettled([
    serverFetch(session, '/auth/me'),
    serverFetch(session, '/devices'),
  ]);

  if (profileRes.status === 'fulfilled') plan = profileRes.value.plan ?? 'free';
  if (devicesRes.status === 'fulfilled') deviceCount = devicesRes.value.devices?.length ?? 0;

  const isPro = plan !== 'free';

  // Pro-only data — fetch in parallel; 403 on free plan falls through gracefully.
  if (isPro) {
    const [statsRes, recentRes] = await Promise.allSettled([
      serverFetch(session, '/sync/stats'),
      serverFetch(session, '/sync', { limit: 5 }),
    ]);
    if (statsRes.status === 'fulfilled') clipCount = statsRes.value.clip_count ?? null;
    if (recentRes.status === 'fulfilled') {
      recentClips = (recentRes.value.items ?? []).filter((c) => !c.deleted_at);
    }
  }

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
          value={isPro ? (clipCount ?? '—') : '—'}
          sub={
            isPro
              ? clipCount != null
                ? `${clipCount} clip${clipCount !== 1 ? 's' : ''} synced`
                : 'Sync from the desktop app'
              : 'Pro plan required'
          }
          href={isPro ? '/clipboard' : '/billing'}
        />
        <StatCard
          icon={Monitor}
          label="Devices"
          value={deviceCount || '—'}
          sub={
            deviceCount
              ? `${deviceCount} device${deviceCount !== 1 ? 's' : ''} connected`
              : 'No devices yet'
          }
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

      {/* Upgrade nudge — free users only */}
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
          {isPro && recentClips.length > 0 && (
            <Link
              href="/clipboard"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              View all
            </Link>
          )}
        </div>

        {!isPro ? (
          /* Free plan — prompt upgrade */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <Lock className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              Cross-device sync is a Pro feature
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Upgrade to see your clipboard history synced across all your devices.
            </p>
            <Link
              href="/billing"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Zap className="size-4" />
              Upgrade to Pro
            </Link>
          </div>
        ) : recentClips.length === 0 ? (
          /* Pro user — no clips yet */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
              <ClipboardList className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No clips yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Copy anything on a device with Snapit installed and it will appear here automatically.
            </p>
            <Link
              href="/download"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-4" />
              Download Snapit
            </Link>
          </div>
        ) : (
          /* Pro user — recent clip metadata (content is encrypted; open Clipboard tab to decrypt) */
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {recentClips.map((clip) => (
              <RecentClipRow key={clip.id} clip={clip} />
            ))}
            <div className="px-4 py-3">
              <Link
                href="/clipboard"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                Open Clipboard to decrypt and view content →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
