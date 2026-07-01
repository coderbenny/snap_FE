import { NextResponse } from 'next/server';

import { authedBackend } from '@/lib/authed-backend';

export async function DELETE(_req, { params }) {
  const result = await authedBackend((c) => c.delete(`/admin/devices/${params.deviceId}`));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return new NextResponse(null, { status: 204 });
}
