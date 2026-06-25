import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import TeamDashboard from '@/components/dashboard/team-dashboard';

export const metadata = { title: 'Team' };

export default async function TeamPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage members and your shared encrypted snippet library.
        </p>
      </div>
      <TeamDashboard userId={session.userId} />
    </div>
  );
}
