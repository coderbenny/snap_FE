'use client';

import { useState, useEffect } from 'react';
import { Check, CreditCard, ExternalLink, Loader2, Sparkles } from 'lucide-react';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

const TIER_ORDER = ['free', 'pro', 'pro_ai', 'team'];

function isUpgrade(current, target) {
  return TIER_ORDER.indexOf(target) > TIER_ORDER.indexOf(current);
}

function planHighlight(tier) {
  return tier === 'pro';
}

export default function PaystackCheckout({ currentPlan, plans, userEmail }) {
  const [paystackReady, setPaystackReady] = useState(false);
  const [loading, setLoading] = useState(null);   // tier string while in flight
  const [portalLoading, setPortalLoading] = useState(false);
  const [newPlan, setNewPlan] = useState(null);   // optimistic tier after payment
  const [error, setError] = useState(null);

  const activePlan = newPlan ?? currentPlan;

  // Load Paystack InlineJS v2 once on mount.
  // v2 exposes PaystackPop as a class — PaystackPop.newTransaction() is the
  // correct API for access_code-based pre-initialized transactions.
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.PaystackPop === 'function') {
      setPaystackReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () => console.warn('Paystack InlineJS failed to load');
    document.head.appendChild(script);
  }, []);

  async function handleUpgrade(tier) {
    setLoading(tier);
    setError(null);

    let authorizationUrl = null;

    try {
      // Step 1 — initialize transaction on our backend.
      const initRes = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!initRes.ok) {
        const body = await initRes.json().catch(() => ({}));
        throw new Error(body.error || 'Could not initialize payment. Please try again.');
      }

      // Backend returns { authorization_url, access_code, reference }
      const { authorization_url, access_code } = await initRes.json();
      authorizationUrl = authorization_url;

      // Step 2 — open the Paystack inline popup.
      // accessCode (camelCase) is the v2 API key; it carries all pre-configured
      // transaction details (plan, amount, email) from the server-side initialize call.
      if (paystackReady && typeof window.PaystackPop === 'function') {
        const popup = new window.PaystackPop();
        popup.newTransaction({
          key: PAYSTACK_PUBLIC_KEY,
          accessCode: access_code,

          // Step 3 — verify server-side once Paystack reports success.
          onSuccess: async (transaction) => {
            try {
              const verifyRes = await fetch(
                `/api/billing/verify/${transaction.reference}`
              );
              if (verifyRes.ok) {
                const { tier: confirmedTier } = await verifyRes.json();
                setNewPlan(confirmedTier ?? tier);
              } else {
                // Webhook may have already updated the plan — optimistically set it.
                setNewPlan(tier);
              }
            } catch {
              setNewPlan(tier);
            } finally {
              setLoading(null);
            }
          },

          onCancel: () => setLoading(null),
        });
      } else {
        // Script blocked or not loaded — redirect to hosted Paystack checkout.
        window.location.href = authorization_url;
      }
    } catch (err) {
      // If we already have the authorization_url, prefer redirect over error banner
      // so the user can still complete payment even if the popup fails.
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
        setLoading(null);
      }
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      if (!res.ok) throw new Error('Could not open billing portal. Please try again.');
      const { portal_url } = await res.json();
      window.open(portal_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err.message);
    } finally {
      setPortalLoading(false);
    }
  }

  const isPaid = activePlan && activePlan !== 'free';

  return (
    <div className="space-y-8">

      {/* Success banner */}
      {newPlan && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
          <Check className="size-5 shrink-0" />
          <p className="text-sm font-medium">
            You&apos;re now on the{' '}
            <span className="capitalize">{newPlan.replace('_', ' ')}</span> plan. Welcome aboard!
          </p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Current plan card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <CreditCard className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground capitalize">
                Current plan:{' '}
                <span className="text-primary">
                  {activePlan?.replace('_', ' ') || 'Free'}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {isPaid
                  ? 'Renews automatically — managed by Paystack'
                  : 'Local history only · no sync'}
              </p>
            </div>
          </div>
          {isPaid && (
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
            >
              {portalLoading
                ? <Loader2 className="size-3.5 animate-spin" />
                : <ExternalLink className="size-3.5" />}
              Manage billing
            </button>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">Plans</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = activePlan === plan.tier;
            const canUpgrade = isUpgrade(activePlan, plan.tier);
            const isLoading = loading === plan.tier;
            const highlight = planHighlight(plan.tier);

            return (
              <div
                key={plan.tier}
                className={`rounded-xl border p-5 transition ${
                  isCurrent
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                    : highlight
                    ? 'border-border bg-card ring-1 ring-border/60'
                    : 'border-border bg-card'
                }`}
              >
                {highlight && !isCurrent && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Sparkles className="size-3" /> Most popular
                  </span>
                )}
                {isCurrent && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Check className="size-3" /> Current plan
                  </span>
                )}

                <p className="text-base font-semibold text-foreground">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  ${(plan.price_usd_cents / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {isCurrent ? (
                    <span className="block rounded-lg border border-border px-4 py-2 text-center text-sm text-muted-foreground">
                      Active
                    </span>
                  ) : canUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plan.tier)}
                      disabled={!!loading || !paystackReady}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Opening payment…
                        </>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  ) : (
                    <span className="block rounded-lg border border-border px-4 py-2 text-center text-sm text-muted-foreground">
                      Not available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Payments processed securely by Paystack. Cancel anytime from &quot;Manage billing&quot; above.
        </p>
      </div>
    </div>
  );
}
