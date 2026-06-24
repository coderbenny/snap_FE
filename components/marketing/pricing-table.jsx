'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ANNUAL_DISCOUNT = 0.2; // 20% off

const TIERS = [
  {
    name: 'Free',
    monthlyPrice: 0,
    description: 'Personal use on a single device.',
    cta: 'Download free',
    href: '/download',
    highlight: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 5,
    description: 'Sync across all your devices.',
    badge: 'Most popular',
    cta: 'Get Pro',
    href: '#paystack-pro',
    highlight: true,
  },
  {
    name: 'Pro+AI',
    monthlyPrice: 9,
    description: 'Pro with OCR and AI actions.',
    cta: 'Get Pro+AI',
    href: '#paystack-pro-ai',
    highlight: false,
  },
  {
    name: 'Team',
    monthlyPrice: 15,
    priceSuffix: '/seat',
    description: 'Shared snippet library for teams.',
    cta: 'Start team trial',
    href: '#paystack-team',
    highlight: false,
  },
];

const FEATURES = [
  { label: 'Local clipboard history', free: true, pro: true, proAi: true, team: true },
  { label: 'History retention', free: '30 days', pro: 'Unlimited', proAi: 'Unlimited', team: 'Unlimited' },
  { label: 'Devices', free: '1', pro: '5', proAi: '5', team: 'Unlimited' },
  { label: 'Cross-device sync', free: false, pro: true, proAi: true, team: true },
  { label: 'End-to-end encryption', free: true, pro: true, proAi: true, team: true },
  { label: 'Instant search', free: true, pro: true, proAi: true, team: true },
  { label: 'Smart tagging', free: false, pro: true, proAi: true, team: true },
  { label: 'OCR (image → text)', free: false, pro: false, proAi: true, team: true },
  { label: 'AI actions', free: false, pro: false, proAi: true, team: true },
  { label: 'Team snippet library', free: false, pro: false, proAi: false, team: true },
  { label: 'Member management', free: false, pro: false, proAi: false, team: true },
  { label: 'Audit log', free: false, pro: false, proAi: false, team: true },
  { label: 'Priority support', free: false, pro: true, proAi: true, team: true },
];

function Cell({ value }) {
  if (value === true) return <Check className="mx-auto size-4 text-primary" />;
  if (value === false) return <Minus className="mx-auto size-4 text-border" />;
  return <span className="text-sm text-foreground">{value}</span>;
}

export default function PricingTable() {
  const [annual, setAnnual] = useState(false);

  function displayPrice(tier) {
    if (tier.monthlyPrice === 0) return '$0';
    const price = annual
      ? (tier.monthlyPrice * (1 - ANNUAL_DISCOUNT)).toFixed(0)
      : tier.monthlyPrice;
    return `$${price}`;
  }

  return (
    <div>
      {/* Billing toggle */}
      <div className="mb-12 flex items-center justify-center gap-4">
        <button
          onClick={() => setAnnual(false)}
          className={`text-sm font-medium transition-colors ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Monthly
        </button>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual(!annual)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors ${
            annual ? 'bg-primary' : 'bg-input'
          }`}
        >
          <span
            className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
              annual ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${annual ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Annual
          <Badge variant="secondary" className="text-xs">
            Save 20%
          </Badge>
        </button>
      </div>

      {/* Tier cards */}
      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-xl border p-6 ${
              tier.highlight ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'border-border bg-card'
            }`}
          >
            {tier.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-foreground shadow">
                {tier.badge}
              </Badge>
            )}
            <h3 className={`font-semibold ${tier.highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
              {tier.name}
            </h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${tier.highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
                {displayPrice(tier)}
              </span>
              {tier.monthlyPrice > 0 && (
                <span className={`text-xs ${tier.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {tier.priceSuffix ?? ''}/mo{annual ? ' billed annually' : ''}
                </span>
              )}
            </div>
            <p className={`mt-2 text-sm ${tier.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {tier.description}
            </p>
            <Button
              className="mt-6 w-full"
              variant={tier.highlight ? 'secondary' : 'default'}
              asChild
            >
              <Link href={tier.href}>{tier.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-3 pl-6 pr-4 text-left font-medium text-foreground">Feature</th>
              {TIERS.map((t) => (
                <th key={t.name} className="px-4 py-3 text-center font-medium text-foreground">
                  {t.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, i) => (
              <tr key={f.label} className={i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <td className="py-3 pl-6 pr-4 text-muted-foreground">{f.label}</td>
                <td className="px-4 py-3 text-center"><Cell value={f.free} /></td>
                <td className="px-4 py-3 text-center"><Cell value={f.pro} /></td>
                <td className="px-4 py-3 text-center"><Cell value={f.proAi} /></td>
                <td className="px-4 py-3 text-center"><Cell value={f.team} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
