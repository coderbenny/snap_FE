'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState('idle'); // idle | joining | success | error
  const [error, setError] = useState('');
  const [teamId, setTeamId] = useState(null);

  // Auto-submit if token is present in the URL
  useEffect(() => {
    if (token) handleJoin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleJoin() {
    if (!token) { setError('No invite token found in the URL.'); return; }
    setState('joining');
    setError('');
    try {
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState('error');
        setError(data.error || 'This invite is invalid or has expired.');
        return;
      }
      setTeamId(data.team_id);
      setState('success');
    } catch {
      setState('error');
      setError('Something went wrong. Please try again.');
    }
  }

  if (state === 'joining') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Accepting invitation…</p>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="size-7 text-green-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">You&apos;re in!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;ve successfully joined the team.
          </p>
        </div>
        <Button asChild>
          <Link href="/team">Go to Team</Link>
        </Button>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <Users className="size-7 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Invite failed</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // idle — token missing
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
        <Users className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">No invite token</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This link doesn&apos;t contain a valid invite token. Check that you copied the full link.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
