/**
 * Server-side API client — used in Server Components and Route Handlers.
 * Never import this in client components ('use client').
 */
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Returns an axios instance with the Authorization header pre-set.
 * @param {string} accessToken
 */
export function authedApi(accessToken) {
  return axios.create({
    baseURL: process.env.API_URL || 'http://localhost:5000',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

/**
 * Authenticated GET against the Flask backend with automatic 401 → token-refresh retry.
 * `session` must be the iron-session instance (accessToken, refreshToken, save).
 * On refresh the new token is written back to the session cookie.
 */
export async function serverFetch(session, path, params = {}) {
  const doGet = (token) =>
    authedApi(token).get(path, Object.keys(params).length ? { params } : undefined);

  try {
    const res = await doGet(session.accessToken);
    return res.data;
  } catch (err) {
    if (err.response?.status !== 401) throw err;

    // Access token expired — refresh once and retry.
    const refreshRes = await api.post('/auth/refresh', {
      refresh_token: session.refreshToken,
    });
    session.accessToken = refreshRes.data.access_token;
    await session.save();

    const res = await doGet(session.accessToken);
    return res.data;
  }
}

export default api;
