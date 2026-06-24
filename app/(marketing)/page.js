import Hero from '@/components/marketing/hero';
import Features from '@/components/marketing/features';
import PricingPreview from '@/components/marketing/pricing-preview';

export const metadata = {
  title: 'SNAP — Universal Clipboard Vault',
  description:
    'SNAP saves every copy you make and syncs it across all your devices, encrypted end-to-end. Never retype what you already copied.',
};

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <PricingPreview />
    </main>
  );
}
