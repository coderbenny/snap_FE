import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import Sidebar from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }) {
  const session = await getIronSession(cookies(), sessionOptions);
  const user = { email: session.userEmail || '' };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      {/* pt-14 on mobile offsets the fixed top bar; removed at lg breakpoint */}
      <div className="flex min-w-0 flex-1 flex-col pt-14 lg:pt-0">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
