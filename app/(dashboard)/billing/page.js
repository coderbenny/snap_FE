import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { authedApi } from '@/lib/api';
import { sessionOptions } from '@/lib/session';
import PaystackCheckout from './PaystackCheckout';

export const metadata = { title: 'Billing — Snapit' };

async function getData(accessToken) {
  const api = authedApi(accessToken);
  const [meRes, plansRes] = await Promise.all([
    api.get('/auth/me').catch(() => null),
    api.get('/billing/plans').catch(() => null),
  ]);

  return {
    currentPlan: meRes?.data?.plan ?? 'free',
    userEmail: meRes?.data?.email ?? '',
    plans: plansRes?.data?.plans ?? [],
  };
}

export default async function BillingPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const { currentPlan, userEmail, plans } = await getData(session.accessToken);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your plan and payment details.
        </p>
      </div>

      <PaystackCheckout
        currentPlan={currentPlan}
        plans={plans}
        userEmail={userEmail}
      />
    </div>
  );
}
