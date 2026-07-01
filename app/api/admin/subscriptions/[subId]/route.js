import { NextResponse } from 'next/server';

import { authedBackend } from '@/lib/authed-backend';

export async function PATCH(req, { params }) {
  const body = await req.json();
  const result = await authedBackend((c) => c.patch(`/admin/subscriptions/${params.subId}`, body));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}
