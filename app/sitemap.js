import { getAllPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapit.ink';

export default function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/download`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const blogRoutes = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
