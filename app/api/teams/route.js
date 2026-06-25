import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function GET() {
  const result = await authedBackend((client) => client.get('/teams'));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}

export async function POST(req) {
  const body = await req.json();
  const result = await authedBackend((client) => client.post('/teams', body));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: result.status });
}
