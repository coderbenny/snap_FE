import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Clipboard' };

export default function ClipboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Clipboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your full encrypted clipboard history across all devices.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">Clipboard viewer coming soon</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Full search, filter, and copy functionality is being built. Check back soon.
        </p>
        <Link
          href="/download"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Download the desktop app
        </Link>
      </div>
    </div>
  );
}
