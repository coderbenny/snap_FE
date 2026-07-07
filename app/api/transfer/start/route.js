import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST(req) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body = {};
  try { body = await req.json(); } catch { /* empty body */ }

  try {
    const res = await authedApi(session.accessToken).post('/transfer/start', body);
    return NextResponse.json(res.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Failed to start transfer';
    return NextResponse.json({ error: message }, { status });
  }
}
