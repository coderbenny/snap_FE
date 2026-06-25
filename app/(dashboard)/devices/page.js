import { Monitor } from 'lucide-react';

export const metadata = { title: 'Devices' };

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Devices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the devices connected to your SNAP account.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Monitor className="size-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No devices connected</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Install SNAP on a device and sign in with this account to see it here.
        </p>
      </div>
    </div>
  );
}
