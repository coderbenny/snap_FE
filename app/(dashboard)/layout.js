export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder — built in Phase 2 */}
      <aside className="w-56 border-r bg-sidebar" />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
