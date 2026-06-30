import { Suspense } from 'react';

import UpgradeView from './upgrade-view';

export const metadata = { title: 'Upgrade' };

export default function UpgradePage() {
  return (
    <Suspense>
      <UpgradeView />
    </Suspense>
  );
}
