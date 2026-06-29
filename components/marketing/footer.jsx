import Link from 'next/link';
import { Clipboard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const LINKS = {
  Product: [
    { href: '/download', label: 'Download' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ],
  Account: [
    { href: '/login', label: 'Sign in' },
    { href: '/register', label: 'Create account' },
    { href: '/dashboard', label: 'Dashboard' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy policy' },
    { href: '/terms', label: 'Terms of service' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
              <Clipboard className="size-4" />
              Snapit
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Universal clipboard vault. Copy once, paste anywhere.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">{section}</h3>
              <ul className="space-y-2">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Snapit. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with end-to-end encryption. Your clipboard is yours.
          </p>
        </div>
      </div>
    </footer>
  );
}
