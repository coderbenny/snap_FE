import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import api from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST(req) {
  const { email, password } = await req.json();

  let backendRes;
  try {
    backendRes = await api.post('/auth/login', { email, password });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Login failed';
    return NextResponse.json({ error: message }, { status });
  }

  const { access_token, refresh_token } = backendRes.data;

  // Decode JWT payload (we trust the backend — no signature verification needed here).
  const payload = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64url').toString());

  const session = await getIronSession(cookies(), sessionOptions);
  session.accessToken = access_token;
  session.refreshToken = refresh_token;
  session.userId = payload.sub;
  session.userEmail = email.toLowerCase();
  await session.save();

  return NextResponse.json({ ok: true, userId: payload.sub });
}
