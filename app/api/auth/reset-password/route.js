import { NextResponse } from 'next/server';

import api from '@/lib/api';

export async function POST(req) {
  const { token, password } = await req.json();

  try {
    await api.post('/auth/reset-password', { token, password });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      'This reset link is invalid or has expired. Please request a new one.';
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ ok: true });
}
