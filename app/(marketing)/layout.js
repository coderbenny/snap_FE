import Nav from '@/components/marketing/nav';
import Footer from '@/components/marketing/footer';

export default function MarketingLayout({ children }) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
