const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapit.ink';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
