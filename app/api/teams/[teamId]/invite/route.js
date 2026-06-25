import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function POST(req, { params }) {
  const body = await req.json();
  const result = await authedBackend((client) =>
    client.post(`/teams/${params.teamId}/invite`, body),
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}
