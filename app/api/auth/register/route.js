import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import api from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await api.post('/auth/register', { email, password });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Registration failed';
    return NextResponse.json({ error: message }, { status });
  }

  // Auto-login so the user lands in the dashboard immediately
  let loginRes;
  try {
    loginRes = await api.post('/auth/login', { email, password });
  } catch {
    // Registration succeeded — user can sign in manually
    return NextResponse.json({ ok: true, userId: null });
  }

  const { access_token, refresh_token } = loginRes.data;
  const payload = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64url').toString());

  const session = await getIronSession(cookies(), sessionOptions);
  session.accessToken = access_token;
  session.refreshToken = refresh_token;
  session.userId = payload.sub;
  session.userEmail = email.toLowerCase();
  await session.save();

  return NextResponse.json({ ok: true, userId: payload.sub });
}
