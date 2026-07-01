import { NextResponse } from 'next/server';

import { authedBackend } from '@/lib/authed-backend';

export async function PATCH(req, { params }) {
  const body = await req.json();
  const result = await authedBackend((c) => c.patch(`/admin/coupons/${params.couponId}`, body));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}

export async function DELETE(_req, { params }) {
  const result = await authedBackend((c) => c.delete(`/admin/coupons/${params.couponId}`));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return new NextResponse(null, { status: 204 });
}
