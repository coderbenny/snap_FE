import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import api, { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';

/**
 * Makes an authenticated call to the Flask backend.
 * Automatically refreshes the access token once on 401.
 *
 * Usage:
 *   const result = await authedBackend((client) => client.get('/teams'));
 *   if (result.error) return NextResponse.json({ error: result.error }, { status: result.status });
 *   return NextResponse.json(result.data, { status: result.status });
 */
export async function authedBackend(fn) {
  const session = await getIronSession(cookies(), sessionOptions);
  if (!session.accessToken) return { error: 'Unauthorized', status: 401 };

  async function attempt(token) {
    const res = await fn(authedApi(token));
    return { data: res.data, status: res.status };
  }

  try {
    return await attempt(session.accessToken);
  } catch (err) {
    if (err.response?.status !== 401) {
      return {
        error: err.response?.data?.error?.message || 'Request failed',
        status: err.response?.status || 500,
      };
    }
    // Refresh and retry once
    try {
      const refreshRes = await api.post('/auth/refresh', { refresh_token: session.refreshToken });
      session.accessToken = refreshRes.data.access_token;
      await session.save();
      return await attempt(session.accessToken);
    } catch {
      return { error: 'Session expired', status: 401 };
    }
  }
}
