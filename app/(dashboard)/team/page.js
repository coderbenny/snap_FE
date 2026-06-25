import { Users } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Team' };

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shared snippet library and team member management.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Users className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">Team plan required</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Upgrade to the Team plan to invite members and share an encrypted snippet library.
        </p>
        <Link
          href="/billing"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}
