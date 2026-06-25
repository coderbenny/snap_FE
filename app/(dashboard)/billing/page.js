import { CreditCard, Check } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Billing' };

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    current: true,
    features: ['1 device', 'Unlimited local history', 'No account required'],
  },
  {
    name: 'Pro',
    price: '$5/mo',
    current: false,
    highlight: true,
    features: ['Up to 5 devices', 'Cross-device sync', 'Unlimited history', 'Priority support'],
  },
  {
    name: 'Pro+AI',
    price: '$9/mo',
    current: false,
    features: ['Everything in Pro', 'OCR on images', 'AI actions', 'Smart tagging'],
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan and payment details.
        </p>
      </div>

      {/* Current plan banner */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <CreditCard className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Current plan: Free</p>
            <p className="text-xs text-muted-foreground">1 device · local history only</p>
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">Available plans</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map(({ name, price, current, highlight, features }) => (
            <div
              key={name}
              className={`rounded-xl border p-5 ${
                highlight
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                  : 'border-border bg-card'
              }`}
            >
              {highlight && (
                <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Most popular
                </span>
              )}
              <p className="text-base font-semibold text-foreground">{name}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{price}</p>
              <ul className="mt-4 space-y-2">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                {current ? (
                  <span className="block rounded-lg border border-border px-4 py-2 text-center text-sm text-muted-foreground">
                    Current plan
                  </span>
                ) : (
                  <span className="block cursor-not-allowed rounded-lg bg-primary/60 px-4 py-2 text-center text-sm font-medium text-primary-foreground">
                    Upgrade (coming soon)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          See full feature comparison on the{' '}
          <Link href="/pricing" className="underline-offset-4 hover:underline">
            pricing page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
