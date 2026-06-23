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

export default api;
