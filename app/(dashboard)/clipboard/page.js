import ClipboardViewer from '@/components/dashboard/clipboard-viewer';

export const metadata = { title: 'Clipboard' };

export default function ClipboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Clipboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your encrypted clipboard history across all synced devices.
        </p>
      </div>

      <ClipboardViewer />
    </div>
  );
}
