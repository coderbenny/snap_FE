import DevicesPanel from '@/components/dashboard/devices-panel';

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
      <DevicesPanel />
    </div>
  );
}
