import { NextResponse } from 'next/server';

import api from '@/lib/api';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await api.post('/auth/register', { email, password });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Registration failed';
    return NextResponse.json({ error: message }, { status });
  }

  // Registration succeeded — email verification required before login is possible.
  return NextResponse.json({ ok: true });
}
