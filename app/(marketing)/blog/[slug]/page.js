import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPost, getAllPosts } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default function BlogPostPage({ params }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const { frontmatter, source } = post;

  return (
    <main className="py-20 sm:py-28">
      <article className="mx-auto max-w-2xl px-4 sm:px-6">
        <header className="mb-10">
          <p className="text-sm text-muted-foreground">
            {frontmatter.date && format(new Date(frontmatter.date), 'MMMM d, yyyy')}
            {frontmatter.author && ` · ${frontmatter.author}`}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="mt-3 text-lg text-muted-foreground">{frontmatter.description}</p>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={source} />
        </div>
      </article>
    </main>
  );
}
