/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Surface env vars that need to be available server-side (no NEXT_PUBLIC_ prefix)
  // Add secrets here only — they are NOT exposed to the browser.
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
  },
};

export default nextConfig;
