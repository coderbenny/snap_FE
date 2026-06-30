/**
 * Server-side API client — used in Server Components and Route Handlers.
 * Never import this in client components ('use client').
 *
 * Uses native fetch (Node 18+ / Vercel runtime). undici powers it with
 * connection pooling and keep-alive out of the box — no manual agent needed.
 */

const BASE_URL = (process.env.API_URL || 'http://localhost:5559/snap').replace(/\/$/, '');

class ApiError extends Error {
  constructor(status, data) {
    const message = data?.error?.message || data?.error || data?.message || `HTTP ${status}`;
    super(message);
    this.status = status;
    this.data = data;
    this.response = { status, data };
  }
}

async function _request(path, { method = 'GET', body, headers = {}, params } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params && Object.keys(params).length) {
    url += '?' + new URLSearchParams(params).toString();
  }

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) throw new ApiError(res.status, data);
  return { data, status: res.status };
}

const api = {
  get:    (path, opts)       => _request(path, { method: 'GET',    ...opts }),
  post:   (path, body, opts) => _request(path, { method: 'POST',   body, ...opts }),
  put:    (path, body, opts) => _request(path, { method: 'PUT',    body, ...opts }),
  patch:  (path, body, opts) => _request(path, { method: 'PATCH',  body, ...opts }),
  delete: (path, opts)       => _request(path, { method: 'DELETE', ...opts }),
};

/**
 * Returns an api-shaped object with the Authorization header pre-set.
 * @param {string} accessToken
 */
export function authedApi(accessToken) {
  const authHeaders = { Authorization: `Bearer ${accessToken}` };
  return {
    get:    (path, opts)       => _request(path, { method: 'GET',    headers: authHeaders, ...opts }),
    post:   (path, body, opts) => _request(path, { method: 'POST',   body, headers: authHeaders, ...opts }),
    put:    (path, body, opts) => _request(path, { method: 'PUT',    body, headers: authHeaders, ...opts }),
    patch:  (path, body, opts) => _request(path, { method: 'PATCH',  body, headers: authHeaders, ...opts }),
    delete: (path, opts)       => _request(path, { method: 'DELETE', headers: authHeaders, ...opts }),
  };
}

/**
 * Authenticated GET with automatic 401 → token-refresh retry.
 * `session` must be the iron-session instance (accessToken, refreshToken, save).
 */
export async function serverFetch(session, path, params = {}) {
  const doGet = (token) =>
    authedApi(token).get(path, Object.keys(params).length ? { params } : undefined);

  try {
    const res = await doGet(session.accessToken);
    return res.data;
  } catch (err) {
    if (err.status !== 401) throw err;

    const refreshRes = await api.post('/auth/refresh', { refresh_token: session.refreshToken });
    session.accessToken = refreshRes.data.access_token;
    await session.save();

    const res = await doGet(session.accessToken);
    return res.data;
  }
}

export default api;
