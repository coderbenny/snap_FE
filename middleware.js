import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';

import { sessionOptions } from '@/lib/session';

const PROTECTED_PREFIXES = ['/dashboard', '/clipboard', '/devices', '/billing', '/team'];
const ADMIN_PREFIX = '/admin';
const AUTH_PAGES = ['/login', '/register'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdmin = pathname.startsWith(ADMIN_PREFIX);
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAdmin && !isAuthPage) return NextResponse.next();

  const session = await getIronSession(req.cookies, sessionOptions);
  const isLoggedIn = Boolean(session.userId);

  if ((isProtected || isAdmin) && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && isLoggedIn && !session.isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clipboard/:path*',
    '/devices/:path*',
    '/billing/:path*',
    '/team/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
