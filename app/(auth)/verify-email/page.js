import { Suspense } from 'react';
import VerifyEmailView from './verify-email-view';

export const metadata = { title: 'Verify email' };

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailView />
    </Suspense>
  );
}
