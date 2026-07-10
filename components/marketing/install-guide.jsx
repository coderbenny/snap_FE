'use client';

import { Apple, Monitor, Smartphone, Github, ExternalLink } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Copyable from '@/components/marketing/copyable';
import { DESKTOP_RELEASES, MOBILE_RELEASES, REPOS } from '@/lib/downloads';

function Step({ n, children }) {
  return (
    <li className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {n}
      </span>
      <div className="flex-1 space-y-2 pt-0.5 text-sm text-muted-foreground">{children}</div>
    </li>
  );
}

function RepoLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <Github className="size-4" />
      {label}
      <ExternalLink className="size-3" />
    </a>
  );
}

const TAB_META = [
  { id: 'macos', label: 'macOS', icon: Apple },
  { id: 'windows', label: 'Windows', icon: Monitor },
  { id: 'android', label: 'Android', icon: Smartphone },
];

export default function InstallGuide() {
  return (
    <section id="install" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="macos">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
            {TAB_META.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id} className="gap-1.5">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* macOS */}
          <TabsContent value="macos" className="mt-8">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-semibold text-foreground">Recommended — Homebrew</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The fastest way to install and stay updated. Snapit lands in your Applications folder.
              </p>
              <div className="mt-4 space-y-2">
                <Copyable command="brew tap coderbenny/tap" />
                <Copyable command="brew install --cask snapit" />
                <Copyable command="brew trust --cask coderbenny/tap/snapit" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                The <code className="font-mono">brew trust</code> step clears the macOS quarantine
                flag so the app opens without a security warning — expected for apps distributed
                outside the Mac App Store.
              </p>

              <div className="my-6 h-px bg-border" />

              <h3 className="font-semibold text-foreground">Or download the DMG</h3>
              <ol className="mt-4 space-y-4">
                <Step n={1}>
                  Download the latest <code className="font-mono">.dmg</code> from the releases page.
                </Step>
                <Step n={2}>Open it and drag Snapit into your Applications folder.</Step>
                <Step n={3}>
                  Remove the quarantine flag so it opens cleanly:
                  <Copyable command="xattr -dr com.apple.quarantine /Applications/Snapit.app" />
                </Step>
                <Step n={4}>Launch Snapit — it appears in your menu bar.</Step>
              </ol>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild>
                  <a href={DESKTOP_RELEASES} target="_blank" rel="noopener noreferrer">
                    Get the macOS release
                  </a>
                </Button>
                <RepoLink href={REPOS.desktop} label="View desktop source" />
              </div>
            </div>
          </TabsContent>

          {/* Windows */}
          <TabsContent value="windows" className="mt-8">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-semibold text-foreground">Install from the ZIP</h3>
              <ol className="mt-4 space-y-4">
                <Step n={1}>
                  Download <code className="font-mono">Snapit-Windows-&lt;version&gt;.zip</code> from
                  the releases page.
                </Step>
                <Step n={2}>
                  Extract <strong className="text-foreground">all files</strong> into a folder (for
                  example <code className="font-mono">C:\Program Files\Snapit</code>). Keep{' '}
                  <code className="font-mono">snapit.exe</code> next to the{' '}
                  <code className="font-mono">.dll</code> files and the{' '}
                  <code className="font-mono">data</code> folder — the app needs them to run.
                </Step>
                <Step n={3}>
                  Run <code className="font-mono">snapit.exe</code>. If Windows SmartScreen appears,
                  click <strong className="text-foreground">More info → Run anyway</strong>.
                </Step>
                <Step n={4}>
                  Snapit lives in the notification area (system tray). Right-click the icon for
                  options. To launch on login, drop a shortcut into{' '}
                  <code className="font-mono">shell:startup</code>.
                </Step>
              </ol>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild>
                  <a href={DESKTOP_RELEASES} target="_blank" rel="noopener noreferrer">
                    Get the Windows release
                  </a>
                </Button>
                <RepoLink href={REPOS.desktop} label="View desktop source" />
              </div>
            </div>
          </TabsContent>

          {/* Android */}
          <TabsContent value="android" className="mt-8">
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <h3 className="font-semibold text-foreground">Install the APK</h3>
              <ol className="mt-4 space-y-4">
                <Step n={1}>
                  Download the <code className="font-mono">.apk</code> from the releases page onto
                  your Android device.
                </Step>
                <Step n={2}>
                  Open the downloaded file. If prompted, allow installs from your browser or file
                  manager (<strong className="text-foreground">Install unknown apps</strong>).
                </Step>
                <Step n={3}>Tap Install, then open Snapit and sign in to start syncing.</Step>
              </ol>
              <p className="mt-4 text-xs text-muted-foreground">
                The Android app is in beta. Sideloading is expected while it&apos;s pending Play
                Store review.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild>
                  <a href={MOBILE_RELEASES} target="_blank" rel="noopener noreferrer">
                    Get the Android release
                  </a>
                </Button>
                <RepoLink href={REPOS.mobile} label="View Android source" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
