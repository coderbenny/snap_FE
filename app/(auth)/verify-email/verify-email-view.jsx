'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyEmailView() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
          setMessage(data.error || 'This verification link is invalid or has expired.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="w-full max-w-sm text-center">
        <Loader2 className="mx-auto mb-4 size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Verifying your email…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <CheckCircle2 className="size-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Email verified</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your email address has been confirmed. Welcome to Snapit!
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mb-6 flex justify-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
          <XCircle className="size-6 text-destructive" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Verification failed</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}
