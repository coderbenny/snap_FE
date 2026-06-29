'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/download', label: 'Download' },
  { href: '/blog', label: 'Blog' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Clipboard className="size-5 text-primary" />
          Snapit
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/download">Download free</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/download" onClick={() => setOpen(false)}>Download free</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
