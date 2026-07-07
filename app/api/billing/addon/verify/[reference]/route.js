import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function GET(req, { params }) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { reference } = await params;

  try {
    const res = await authedApi(session.accessToken).get(
      `/billing/addon/verify/${reference}`,
    );
    return NextResponse.json(res.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Verification failed';
    return NextResponse.json({ error: message }, { status });
  }
}
