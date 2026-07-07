import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { sessionOptions } from '@/lib/session';

// Returns the raw access token for client-side WebSocket connections.
// Safe because callers must already hold the HTTP-only session cookie.
export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ token: session.accessToken });
}
