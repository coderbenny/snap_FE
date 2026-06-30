import { NextResponse } from 'next/server';

import api from '@/lib/api';

export async function POST(req) {
  const { token } = await req.json();

  try {
    await api.post('/auth/verify-email', { token });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      'This verification link is invalid or has expired.';
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true });
}
