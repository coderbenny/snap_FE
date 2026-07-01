import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { sessionOptions } from '@/lib/session';

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);

  if (!session.userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({
    userId: session.userId,
    email: session.userEmail,
    isAdmin: session.isAdmin === true,
  });
}
