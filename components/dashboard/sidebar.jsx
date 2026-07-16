'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Clipboard,
  ClipboardList,
  LayoutDashboard,
  Monitor,
  Users,
  CreditCard,
  LogOut,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { clearKey } from '@/lib/crypto';
import ThemeToggle from '@/components/ui/theme-toggle';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/clipboard', label: 'Clipboard', icon: ClipboardList },
  { href: '/devices', label: 'Devices', icon: Monitor },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

function NavLink({ href, label, icon: Icon, active, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

function AdminNavLink({ onClick }) {
  return (
    <Link
      href="/admin"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/40 dark:hover:text-amber-300"
    >
      <ShieldCheck className="size-4 shrink-0" />
      Admin Panel
    </Link>
  );
}

function SidebarBody({ user, onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    clearKey();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 font-bold text-foreground"
        >
          <Clipboard className="size-5 text-primary" />
          Snapit
        </Link>
      </div>

      {/* Nav links — overflow-y-auto so long nav scrolls and never pushes footer */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 p-3">
        {NAV_ITEMS.map(({ href, label, icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              active={active}
              onClick={onNavigate}
            />
          );
        })}
      </nav>

      {/* Footer — always visible regardless of nav overflow */}
      <div className="shrink-0 border-t border-border p-3 space-y-0.5">
        {user.isAdmin && (
          <AdminNavLink onClick={onNavigate} />
        )}
        <div className="truncate px-3 py-1 text-xs text-muted-foreground">{user.email}</div>
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop — always visible */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <SidebarBody user={user} onNavigate={undefined} />
      </aside>

      {/* Mobile — fixed top bar + Sheet drawer */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="-ml-1 inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-56 p-0">
            <SidebarBody user={user} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
          <Clipboard className="size-5 text-primary" />
          Snapit
        </Link>
      </header>
    </>
  );
}
