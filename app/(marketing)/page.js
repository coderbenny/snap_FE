import Hero from '@/components/marketing/hero';
import Features from '@/components/marketing/features';
import CrossPlatform from '@/components/marketing/cross-platform';
import PricingPreview from '@/components/marketing/pricing-preview';
import { GITHUB_URL } from '@/lib/downloads';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://snapit.ink';

export const metadata = {
  title: 'Snapit — Universal Clipboard Vault',
  description:
    'Snapit saves every copy you make and syncs it across all your devices, encrypted end-to-end. Never retype what you already copied.',
  alternates: { canonical: '/' },
};

// JSON-LD helps search engines show rich results (app name, platforms, price).
// Prices mirror the Free / Pro / Team tiers; no ratings are declared because we
// don't have real review data to back them.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Snapit',
      url: BASE_URL,
      logo: `${BASE_URL}/opengraph-image`,
      sameAs: [GITHUB_URL],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'Snapit',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'macOS, Windows, Android',
      description:
        'Universal clipboard vault. Snapit captures everything you copy and syncs it across all your devices, encrypted end-to-end.',
      url: BASE_URL,
      downloadUrl: `${BASE_URL}/download`,
      publisher: { '@id': `${BASE_URL}/#organization` },
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro', price: '5', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Team', price: '15', priceCurrency: 'USD' },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <CrossPlatform />
      <PricingPreview />
    </main>
  );
}
