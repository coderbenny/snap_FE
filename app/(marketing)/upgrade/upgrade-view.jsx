'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const TIER_LABELS = {
  pro: 'Pro',
  pro_ai: 'Pro + AI',
  team: 'Team',
};

export default function UpgradeView() {
  const params = useSearchParams();
  const token = params.get('token');
  const tier = params.get('tier') || 'pro';
  const success = params.get('success');

  const [status, setStatus] = useState('loading'); // loading | redirecting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (success) {
      setStatus('success');
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMsg('This upgrade link is missing a token. Please try again from the app.');
      return;
    }

    const run = async () => {
      try {
        const callbackUrl = `${window.location.origin}/upgrade?success=1`;
        const res = await fetch('/api/billing/init-upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, tier, callback_url: callbackUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to initialise payment');
        setStatus('redirecting');
        window.location.href = data.authorization_url;
      } catch (e) {
        setStatus('error');
        setErrorMsg(e.message);
      }
    };

    run();
  }, [token, tier, success]);

  const tierLabel = TIER_LABELS[tier] ?? tier;

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {(status === 'loading' || status === 'redirecting') && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              {status === 'loading'
                ? `Preparing your upgrade to ${tierLabel}…`
                : 'Redirecting to payment…'}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-7 w-7 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-foreground">Payment received</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your {tierLabel} plan is now active. You can close this tab and return to the Snapit
              app — it will refresh automatically.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg
                className="h-7 w-7 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Close this tab and click <span className="font-medium">Upgrade</span> again in the
              Snapit app to get a fresh link.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
