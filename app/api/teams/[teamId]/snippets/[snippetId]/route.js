import { NextResponse } from 'next/server';
import { authedBackend } from '@/lib/authed-backend';

export async function DELETE(req, { params }) {
  const result = await authedBackend((client) =>
    client.delete(`/teams/${params.teamId}/snippets/${params.snippetId}`),
  );
  if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
  return new NextResponse(null, { status: 204 });
}
