import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const query = {};
  if (searchParams.get('since')) query.since = searchParams.get('since');
  if (searchParams.get('limit')) query.limit = searchParams.get('limit');

  const result = await authedBackend((client) =>
    client.get(`/teams/${params.teamId}/snippets`, { params: query }),
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}

export async function POST(req, { params }) {
  const body = await req.json();
  const result = await authedBackend((client) =>
    client.post(`/teams/${params.teamId}/snippets`, body),
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}
