'use client';

import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { deriveKey, storeKey } from '@/lib/crypto';

export default function UnlockForm({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) throw new Error('auth');
      const { userId } = await meRes.json();

      const key = await deriveKey(password, userId);
      await storeKey(key);
      onUnlock(key);
    } catch {
      setError('Incorrect password or session expired. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Lock className="size-6 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">Your clips are encrypted</h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Enter your password to decrypt your clipboard history. Your key never leaves this device.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xs space-y-3">
        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <div className="space-y-1.5 text-left">
          <Label htmlFor="unlock-password">Password</Label>
          <Input
            id="unlock-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {loading ? 'Unlocking…' : 'Unlock'}
        </Button>
      </form>
    </div>
  );
}
