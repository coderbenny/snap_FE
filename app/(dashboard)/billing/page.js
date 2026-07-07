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

  const rawAddons = plansRes?.data?.addons ?? [];
  const ftAddon = rawAddons.find((a) => a.id === 'file_transfer') ?? null;

  return {
    currentPlan: meRes?.data?.plan ?? 'free',
    userEmail: meRes?.data?.email ?? '',
    fileTransferAddon: meRes?.data?.file_transfer_addon ?? false,
    plans: plansRes?.data?.plans ?? [],
    fileTransferAddonInfo: ftAddon,   // { id, name, description, type, price_usd_cents }
  };
}

export default async function BillingPage() {
  const session = await getIronSession(cookies(), sessionOptions);
  const { currentPlan, userEmail, fileTransferAddon, plans, fileTransferAddonInfo } =
    await getData(session.accessToken);

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
        fileTransferAddon={fileTransferAddon}
        fileTransferAddonInfo={fileTransferAddonInfo}
      />
    </div>
  );
}
