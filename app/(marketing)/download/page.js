import { Apple, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Download SNAP',
  description: 'Download SNAP for macOS, Windows, or Android. Free forever on a single device.',
};

const PLATFORMS = [
  {
    name: 'macOS',
    icon: Apple,
    description: 'macOS 13 Ventura or later. Apple Silicon + Intel.',
    badge: 'Universal',
    file: 'snap-macos-universal.dmg',
    size: '~24 MB',
    checksum: 'sha256: a3f8c1d2e4b5... (full checksum in release notes)',
    href: 'https://github.com/snap-app/releases/latest/download/snap-macos-universal.dmg',
  },
  {
    name: 'Windows',
    icon: Monitor,
    description: 'Windows 10 (64-bit) or later.',
    badge: 'x64',
    file: 'snap-windows-setup.exe',
    size: '~31 MB',
    checksum: 'sha256: b7e2a9f3c6d1... (full checksum in release notes)',
    href: 'https://github.com/snap-app/releases/latest/download/snap-windows-setup.exe',
  },
  {
    name: 'Android',
    icon: Smartphone,
    description: 'Android 10 or later. ARMv8 + x86-64.',
    badge: 'Beta',
    file: 'snap-android.apk',
    size: '~18 MB',
    checksum: 'sha256: c9d4b8e7a2f5... (full checksum in release notes)',
    href: 'https://github.com/snap-app/releases/latest/download/snap-android.apk',
  },
];

export default function DownloadPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Download SNAP
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Free forever on a single device. No account required to get started.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLATFORMS.map(({ name, icon: Icon, description, badge, file, size, checksum, href }) => (
            <div key={name} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-foreground" />
                </div>
                <Badge variant="secondary">{badge}</Badge>
              </div>

              <h2 className="font-semibold text-foreground">{name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>

              <Button className="mt-6 w-full" asChild>
                <a href={href} download>
                  Download for {name}
                </a>
              </Button>

              <div className="mt-4 space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">File:</span> {file}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Size:</span> {size}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className="font-medium">Checksum:</span>{' '}
                  <code className="font-mono">{checksum}</code>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
          <p>
            All releases are signed and published on{' '}
            <a
              href="https://github.com/snap-app/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              GitHub Releases
            </a>
            . Verify checksums before installing.
          </p>
        </div>
      </div>
    </main>
  );
}
