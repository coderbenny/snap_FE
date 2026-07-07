import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { sessionOptions } from '@/lib/session';

const FLASK_BASE = (process.env.API_URL || 'http://localhost:5559/snap').replace(/\/$/, '');

// Proxy the Flask SSE stream to the browser.
// The browser connects here with its session cookie; we add the JWT upstream.
export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const upstream = await fetch(`${FLASK_BASE}/events`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
    // Node 18 fetch: disable body compression so chunks stream through immediately.
    // @ts-ignore — custom Node/Vercel fetch option
    duplex: 'half',
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('SSE upstream unavailable', { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable nginx buffering when behind a proxy
    },
  });
}
