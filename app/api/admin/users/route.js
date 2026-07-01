import { NextResponse } from 'next/server';

import { authedBackend } from '@/lib/authed-backend';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();
  const result = await authedBackend((c) => c.get(`/admin/users${qs ? `?${qs}` : ''}`));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}
