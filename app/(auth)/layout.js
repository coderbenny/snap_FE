import Nav from '@/components/marketing/nav';

export default function AuthLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        {children}
      </main>
    </>
  );
}
