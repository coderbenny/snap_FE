import { Apple, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Download Snapit',
  description: 'Download Snapit for macOS, Windows, or Android. Free forever on a single device.',
};

// Set NEXT_PUBLIC_CDN_URL in Vercel to your Cloudflare R2 public bucket URL,
// e.g. https://cdn.snapit.ink  (no trailing slash).
const CDN = process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.snapit.ink';

const PLATFORMS = [
  {
    name: 'macOS',
    icon: Apple,
    description: 'macOS 13 Ventura or later. Apple Silicon + Intel.',
    badge: 'Universal',
    file: 'snapit-macos-universal.dmg',
    size: '~24 MB',
    href: `${CDN}/Snapit-1.0.0.dmg`,
  },
  {
    name: 'Windows',
    icon: Monitor,
    description: 'Windows 10 (64-bit) or later.',
    badge: 'x64',
    file: 'snapit-windows-setup.exe',
    size: '~31 MB',
    href: `${CDN}/Snapit-1.0.0.exe`,
  },
  {
    name: 'Android',
    icon: Smartphone,
    description: 'Android 10 or later. ARMv8 + x86-64.',
    badge: 'Beta',
    file: 'snapit-android.apk',
    size: '~18 MB',
    href: `${CDN}/snapit-android.apk`,
  },
];

export default function DownloadPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Download Snapit
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Free forever on a single device. No account required to get started.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLATFORMS.map(({ name, icon: Icon, description, badge, file, size, href }) => (
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
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
          <p>
            All releases are distributed via Cloudflare&apos;s global CDN for fast, reliable
            downloads from anywhere in the world.
          </p>
        </div>
      </div>
    </main>
  );
}
