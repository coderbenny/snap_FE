import Link from 'next/link';
import { Apple, Monitor, Smartphone, ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLATFORMS } from '@/lib/downloads';

const ICONS = { macos: Apple, windows: Monitor, android: Smartphone };

export default function CrossPlatform() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Subtle background gradient, mirroring the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,oklch(0.9_0.02_264/0.3),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,oklch(0.3_0.05_264/0.4),transparent)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <RefreshCw className="size-3" />
            Cross-platform
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One clipboard, every device you own
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Copy on your Mac, paste on your PC or phone. Snapit runs natively on macOS, Windows and
            Android — your history stays in sync across all of them.
          </p>
        </div>

        {/* Platform cards */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {PLATFORMS.map(({ id, name, requirement }) => {
            const Icon = ICONS[id];
            return (
              <Link
                key={id}
                href="/download"
                className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-105">
                  <Icon className="size-7 text-primary" />
                </div>
                <h3 className="mt-5 font-semibold text-foreground">{name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{requirement}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Install
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Sync guarantee bar */}
        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-center gap-3 rounded-xl border border-border bg-muted/50 px-6 py-4 text-center sm:flex-row sm:text-left">
          <Lock className="size-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Every device syncs over{' '}
            <span className="font-medium text-foreground">end-to-end encrypted</span> channels — your
            clipboard is encrypted on-device before it ever leaves.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/download">
              Download for your device
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
