import PricingTable from '@/components/marketing/pricing-table';

export const metadata = {
  title: 'Pricing',
  description:
    'SNAP is free on a single device. Upgrade to Pro for cross-device sync, or Team for a shared snippet library.',
};

export default function PricingPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, honest pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free — no account required. Upgrade when you need sync or AI. Cancel any time.
          </p>
        </div>

        <div className="mt-16">
          <PricingTable />
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground">Frequently asked questions</h2>
          <dl className="mt-8 space-y-6">
            {[
              {
                q: 'What counts as a "device"?',
                a: 'Any desktop or mobile installation of the SNAP app. Your web account at snap.zuri.health is not counted as a device.',
              },
              {
                q: 'Is my clipboard data really private?',
                a: 'Yes. Your clipboard is encrypted on-device using AES-256-GCM before it leaves your machine. The encryption key is derived from your password — we never have access to it.',
              },
              {
                q: 'What happens if I cancel Pro?',
                a: 'Your history stays on your devices. Sync pauses, but nothing is deleted. You can re-subscribe at any time to resume syncing.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes — within 14 days of a charge, no questions asked. Email support@snap.zuri.health.',
              },
              {
                q: 'How does Team billing work?',
                a: 'Team is billed per seat per month. You pay for the number of members in your team. Add or remove members at any time; billing adjusts on your next invoice.',
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-foreground">{q}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
