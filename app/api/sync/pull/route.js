import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import api, { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

async function doFetch(accessToken, searchParams) {
  const params = {};
  if (searchParams.get('since')) params.since = searchParams.get('since');
  if (searchParams.get('limit')) params.limit = searchParams.get('limit');
  return authedApi(accessToken).get('/sync', { params });
}

export async function GET(req) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);

  try {
    const res = await doFetch(session.accessToken, searchParams);
    return NextResponse.json(res.data);
  } catch (err) {
    if (err.response?.status !== 401) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error?.message || 'Failed to fetch clips';
      return NextResponse.json({ error: message }, { status });
    }

    // Access token expired — try refresh
    try {
      const refreshRes = await api.post('/auth/refresh', { refresh_token: session.refreshToken });
      session.accessToken = refreshRes.data.access_token;
      await session.save();

      const retry = await doFetch(session.accessToken, searchParams);
      return NextResponse.json(retry.data);
    } catch {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
  }
}
