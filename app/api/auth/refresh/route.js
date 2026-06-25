import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import api from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST() {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const res = await api.post('/auth/refresh', { refresh_token: session.refreshToken });
    session.accessToken = res.data.access_token;
    await session.save();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }
}
