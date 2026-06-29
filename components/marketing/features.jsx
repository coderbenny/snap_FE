import { ClipboardList, RefreshCw, Shield, Search, Tag, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: ClipboardList,
    title: 'Unlimited history',
    description:
      'Every copy you make is saved automatically - text, URLs, code and more. Go back as far as you need.',
  },
  {
    icon: RefreshCw,
    title: 'Cross-device sync',
    description:
      'Copy on your Mac, paste on your PC or phone. Snapit syncs in real time across all your devices.',
  },
  {
    icon: Shield,
    title: 'End-to-end encrypted',
    description:
      'Your clipboard is encrypted on-device before it ever leaves. We store ciphertext - even we can\'t read your data.',
  },
  {
    icon: Search,
    title: 'Instant search',
    description:
      'Find anything you\'ve ever copied in milliseconds. Full-text search across your entire clipboard history.',
  },
  {
    icon: Tag,
    title: 'Smart tagging',
    description:
      'Clipboard items are automatically categorised by type: code, URLs, emails, passwords and more.',
  },
  {
    icon: Users,
    title: 'Team snippet library',
    description:
      'Share encrypted snippets with your team. Everyone stays in sync with the same commands, tokens and templates.',
  },
];

export default function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything your clipboard should be
          </h2>
          <p className="mt-4 text-muted-foreground">
            Snapit works silently in the background, capturing everything - so you never have
            to think about it.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group rounded-xl border border-border p-6 transition-colors hover:bg-muted/50">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
