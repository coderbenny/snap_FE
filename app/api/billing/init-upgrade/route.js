import { NextResponse } from 'next/server';

import api from '@/lib/api';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const res = await api.post('/billing/init-upgrade', body);
    return NextResponse.json(res.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message ||
      err.response?.data?.error ||
      'Failed to initialise payment';
    return NextResponse.json({ error: message }, { status });
  }
}
