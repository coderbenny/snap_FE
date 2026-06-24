import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    description: 'For personal use on one device.',
    features: ['Unlimited local history', 'Single device', '30-day retention', 'Desktop app'],
    cta: 'Download free',
    href: '/download',
    variant: 'outline',
  },
  {
    name: 'Pro',
    price: '$5',
    period: '/mo',
    description: 'Sync across all your devices.',
    badge: 'Most popular',
    features: [
      'Everything in Free',
      'Cross-device sync',
      'Unlimited history',
      'Up to 5 devices',
      'Priority support',
    ],
    cta: 'Get Pro',
    href: '/pricing',
    variant: 'default',
  },
  {
    name: 'Team',
    price: '$15',
    period: '/seat/mo',
    description: 'Shared snippets for your whole team.',
    features: [
      'Everything in Pro+AI',
      'Team snippet library',
      'Admin controls',
      'Audit log',
      'SSO (coming soon)',
    ],
    cta: 'Start team trial',
    href: '/pricing',
    variant: 'outline',
  },
];

export default function PricingPreview() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you need sync. Cancel any time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-xl border p-8 ${
                tier.badge
                  ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                  : 'border-border bg-card'
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground shadow">
                  {tier.badge}
                </Badge>
              )}

              <div className="mb-6">
                <h3 className={`font-semibold ${tier.badge ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {tier.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${tier.badge ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm ${tier.badge ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className={`mt-2 text-sm ${tier.badge ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`mt-0.5 size-4 shrink-0 ${tier.badge ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className={tier.badge ? 'text-primary-foreground/90' : 'text-foreground'}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.badge ? 'secondary' : tier.variant}
                className="w-full"
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Compare all features <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
