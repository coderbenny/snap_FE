import Link from 'next/link';
import { format } from 'date-fns';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog',
  description: 'News, updates, and thoughts from the Snapit team.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="mt-3 text-muted-foreground">News, updates, and thoughts from the Snapit team.</p>

        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group">
                <p className="text-sm text-muted-foreground">
                  {post.date && format(new Date(post.date), 'MMMM d, yyyy')}
                  {post.author && ` · ${post.author}`}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:underline">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 text-muted-foreground">{post.description}</p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
