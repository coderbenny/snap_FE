import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function GET(req, { params }) {
  const result = await authedBackend((client) =>
    client.get(`/teams/${params.teamId}/members`),
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}
