import { Github, ExternalLink } from 'lucide-react';
import InstallGuide from '@/components/marketing/install-guide';
import { REPOS } from '@/lib/downloads';

export const metadata = {
  title: 'Download Snapit — macOS, Windows & Android',
  description:
    'Install Snapit on macOS, Windows, or Android. Free forever on a single device — no account required. Open source, published on GitHub.',
  alternates: { canonical: '/download' },
};

export default function DownloadPage() {
  return (
    <main className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Install Snapit
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Free forever on a single device — no account required. Pick your platform below. On
            macOS we recommend Homebrew so you skip the Gatekeeper warning.
          </p>
        </div>

        {/* Install guide (tabs per platform) */}
        <div className="mt-14">
          <InstallGuide />
        </div>

        {/* Open-source note */}
        <div className="mt-16 rounded-xl border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Snapit is open source. Every release is published on GitHub — inspect the code, verify
            the build, or contribute.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href={REPOS.desktop}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> Desktop (macOS &amp; Windows)
              <ExternalLink className="size-3" />
            </a>
            <a
              href={REPOS.mobile}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> Android
              <ExternalLink className="size-3" />
            </a>
            <a
              href={REPOS.backend}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> Backend
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
