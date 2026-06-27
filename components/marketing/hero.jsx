import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Subtle background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.9_0.02_264/0.3),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.3_0.05_264/0.4),transparent)]"
      />

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          Free forever on a single device &mdash; no account required
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Your clipboard, <span className="text-primary">synced everywhere.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          SNAP remembers everything you copy and keeps it in sync across every device - encrypted
          end-to-end. Find anything in seconds. Never retype what you already copied.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2" asChild>
            <Link href="/download">
              <Download className="size-4" />
              Download free
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/pricing">
              See pricing
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          macOS · Windows · Android &nbsp;·&nbsp; No credit card required
        </p>

        {/* App mockup */}
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            {/* Window chrome */}
            <div className="flex h-9 items-center gap-2 border-b border-border bg-muted px-4">
              <span className="size-3 rounded-full bg-destructive/60" />
              <span className="size-3 rounded-full bg-yellow-400/60" />
              <span className="size-3 rounded-full bg-green-500/60" />
              <span className="ml-4 h-4 w-32 rounded-sm bg-border" />
            </div>
            {/* Mock clipboard list */}
            <div className="space-y-px p-2">
              {[
                { type: 'text', preview: 'npm install snap-client --save', time: 'just now' },
                { type: 'url', preview: 'https://github.com/snap/snap-server', time: '2m ago' },
                {
                  type: 'text',
                  preview: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...',
                  time: '5m ago',
                },
                {
                  type: 'text',
                  preview: 'SELECT * FROM clipboard_items WHERE user_id = ?',
                  time: '12m ago',
                },
                { type: 'url', preview: 'https://tabmemory.smartminds.life', time: '1h ago' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                >
                  <span className="shrink-0 text-lg">{item.type === 'url' ? '🔗' : '📋'}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                    {item.preview}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
