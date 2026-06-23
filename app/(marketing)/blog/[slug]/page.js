export default function BlogPostPage({ params }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">{params.slug}</h1>
    </main>
  );
}
