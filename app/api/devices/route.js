import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function GET() {
  const result = await authedBackend((client) => client.get('/devices'));
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.data);
}
