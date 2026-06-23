import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import api from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST() {
  const session = await getIronSession(cookies(), sessionOptions);

  // Tell the backend to revoke the refresh token (best-effort — don't block logout on failure).
  if (session.refreshToken) {
    try {
      await api.post('/auth/logout', { refresh_token: session.refreshToken });
    } catch {
      // ignore
    }
  }

  session.destroy();
  return NextResponse.json({ ok: true });
}
