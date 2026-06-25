import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function POST(req) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 });
  }

  try {
    await authedApi(session.accessToken).post('/sync/delete', { ids });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Delete failed';
    return NextResponse.json({ error: message }, { status });
  }
}
