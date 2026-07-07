import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';
import Sidebar from '@/components/dashboard/sidebar';
import TransferDropZone from '@/components/dashboard/transfer-drop-zone';

export default async function DashboardLayout({ children }) {
  const session = await getIronSession(cookies(), sessionOptions);
  const user = { email: session.userEmail || '' };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} />
      {/* pt-14 on mobile offsets the fixed top bar; removed at lg breakpoint */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto pt-14 lg:pt-0">
        <TransferDropZone>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </TransferDropZone>
      </div>
      {/* IncomingTransferBanner intentionally removed: the web dashboard is
          send-only. File reception happens on the native desktop/mobile app,
          which is the registered target device. The browser has no device ID
          so it cannot be addressed as a transfer target. */}
    </div>
  );
}
