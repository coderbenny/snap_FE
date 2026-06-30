import { NextResponse } from 'next/server';

import api from '@/lib/api';

export async function POST(req) {
  const { email } = await req.json();

  try {
    await api.post('/auth/resend-verification', { email });
  } catch (err) {
    const status = err.response?.status || 500;
    if (status >= 500) {
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
