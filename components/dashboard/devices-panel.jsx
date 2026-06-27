'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Laptop,
  LaptopIcon,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Loader2,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function platformIcon(platform) {
  switch (platform) {
    case 'macos':    return <Monitor className="size-5 text-muted-foreground" />;
    case 'windows':  return <LaptopIcon className="size-5 text-muted-foreground" />;
    case 'ios':      return <Smartphone className="size-5 text-muted-foreground" />;
    case 'android':  return <Tablet className="size-5 text-muted-foreground" />;
    default:         return <Globe className="size-5 text-muted-foreground" />;
  }
}

function platformLabel(platform) {
  const labels = { macos: 'macOS', windows: 'Windows', ios: 'iOS', android: 'Android', web: 'Web' };
  return labels[platform] ?? platform;
}

function timeAgo(iso) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 2)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  === 1) return 'Yesterday';
  return new Date(iso).toLocaleDateString();
}

function DeviceRow({ device, onRevoke, revoking }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {platformIcon(device.platform)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{device.name}</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            {platformLabel(device.platform)}
          </span>
          {device.app_version && (
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              v{device.app_version}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Last seen {timeAgo(device.last_seen_at)}
          {device.created_at && (
            <> · Added {new Date(device.created_at).toLocaleDateString()}</>
          )}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        disabled={revoking}
        onClick={() => onRevoke(device.id, device.name)}
        title="Revoke device"
      >
        {revoking ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </Button>
    </div>
  );
}

export default function DevicesPanel() {
  const [devices, setDevices]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [revoking, setRevoking]     = useState(null);
  const [confirming, setConfirming] = useState(null); // { id, name }

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/devices');
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to load devices'); return; }
      setDevices(data.devices ?? []);
    } catch {
      setError('Could not reach the server. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleRevoke(deviceId) {
    setRevoking(deviceId);
    setConfirming(null);
    try {
      const res = await fetch(`/api/devices/${deviceId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to revoke device');
        return;
      }
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setRevoking(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">
        {error}
        <button onClick={load} className="ml-3 underline underline-offset-2">
          Retry
        </button>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Monitor className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No devices connected</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Install SNAP on a device and sign in with this account to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Confirm revoke dialog */}
      {confirming && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Revoke &ldquo;{confirming.name}&rdquo;?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                This device will be signed out immediately. Its local clips remain intact.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRevoke(confirming.id)}
            >
              Revoke
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {devices.map((device) => (
        <DeviceRow
          key={device.id}
          device={device}
          revoking={revoking === device.id}
          onRevoke={(id, name) => setConfirming({ id, name })}
        />
      ))}

      <p className="pt-1 text-xs text-muted-foreground">
        {devices.length} device{devices.length !== 1 ? 's' : ''} connected ·{' '}
        Revoking a device signs it out immediately.
      </p>
    </div>
  );
}
