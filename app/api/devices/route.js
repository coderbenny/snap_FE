import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function GET() {
  const result = await authedBackend((client) => client.get('/devices'));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* empty body */ }
  const result = await authedBackend((client) => client.post('/devices/register', body));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data, { status: 201 });
}
