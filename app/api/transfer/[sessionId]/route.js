import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

export async function DELETE(req, { params }) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await params;

  try {
    await authedApi(session.accessToken).delete(`/transfer/${sessionId}`);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Failed to cancel transfer';
    return NextResponse.json({ error: message }, { status });
  }
}
