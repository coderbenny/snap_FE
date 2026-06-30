export const metadata = {
  title: 'Privacy Policy',
  description: 'How Snapit collects, uses, and protects your data.',
};

const LAST_UPDATED = 'June 30, 2026';

export default function PrivacyPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose-legal">
          <Section title="1. Introduction">
            <p>
              Snapit (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates a cross-device
              clipboard synchronisation service. This Privacy Policy explains what information we
              collect when you use Snapit, how we use it, and what rights you have over it.
            </p>
            <p>
              By creating an account or using our service you agree to the practices described in
              this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <Subsection title="2.1 Account information">
              <p>
                When you register we collect your email address and a cryptographic hash of your
                password. We never store your password in plain text.
              </p>
            </Subsection>
            <Subsection title="2.2 Clipboard content">
              <p>
                Your clipboard items are encrypted on your device before being sent to our servers.
                We use AES-256-GCM encryption with a key derived from your password using PBKDF2.
                This means <strong>we cannot read your clipboard content</strong> — it is
                mathematically indistinguishable from random noise on our servers.
              </p>
            </Subsection>
            <Subsection title="2.3 Device information">
              <p>
                We record a device name, platform (macOS, Windows, iOS, Android), and the
                approximate time each device last synced. This lets you manage your connected
                devices from your account dashboard.
              </p>
            </Subsection>
            <Subsection title="2.4 Billing information">
              <p>
                Payment is processed by Paystack. We receive confirmation of successful payments and
                a Paystack customer identifier, but never see your full card number or bank details.
              </p>
            </Subsection>
            <Subsection title="2.5 Usage and technical data">
              <p>
                Our servers log standard HTTP request metadata (timestamp, HTTP method, path, status
                code, response time). These logs are used to debug errors, monitor service health,
                and detect abuse. They are not linked to individual clipboard items.
              </p>
            </Subsection>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul>
              <li>
                <strong>Service delivery</strong> — syncing your encrypted clipboard across the
                devices you authorise.
              </li>
              <li>
                <strong>Account management</strong> — sending email verification, password-reset,
                and billing receipts.
              </li>
              <li>
                <strong>Security</strong> — detecting and responding to unauthorised access,
                rate-limiting abuse, and maintaining audit logs.
              </li>
              <li>
                <strong>Service improvement</strong> — aggregate, anonymised usage metrics to
                understand feature adoption.
              </li>
            </ul>
            <p>
              We do not sell your data, serve ads, or share your information with third parties for
              marketing.
            </p>
          </Section>

          <Section title="4. Data Storage and Security">
            <p>
              Your encrypted clipboard data is stored in a database hosted in a secured cloud
              environment. All data is encrypted at rest and in transit (TLS 1.2+). Access to
              production systems is restricted to authorised personnel and protected by multi-factor
              authentication.
            </p>
            <p>
              Because clipboard items are end-to-end encrypted, a breach of our database would not
              expose the content of your clipboard — only encrypted ciphertext that is useless
              without your password.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain your data for as long as your account is active. If you delete your account,
              all associated clipboard items, device records, and personal data are permanently
              deleted within 30 days. Billing records are retained for 7 years as required by
              financial regulations.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Access a copy of the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Delete your account and all associated data.</li>
              <li>Export your data in a machine-readable format.</li>
              <li>Object to or restrict certain types of processing.</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href="mailto:privacy@snapit.ink">privacy@snapit.ink</a>. We will respond within 30
              days.
            </p>
          </Section>

          <Section title="7. Cookies and Local Storage">
            <p>
              The Snapit web application uses a single encrypted session cookie to maintain your
              login. We do not use tracking cookies, analytics pixels, or third-party advertising
              scripts.
            </p>
          </Section>

          <Section title="8. Third-Party Services">
            <ul>
              <li>
                <strong>Paystack</strong> — payment processing. Subject to{' '}
                <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer">
                  Paystack&apos;s Privacy Policy
                </a>
                .
              </li>
            </ul>
          </Section>

          <Section title="9. Children">
            <p>
              Snapit is not directed at children under 13. We do not knowingly collect personal
              information from anyone under 13. If you believe a child has provided us with personal
              information, contact us at <a href="mailto:privacy@snapit.ink">privacy@snapit.ink</a>.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this policy from time to time. We will notify registered users by email
              of any material changes at least 14 days before they take effect. Continued use of the
              service after the effective date constitutes acceptance of the revised policy.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Questions about this policy or how we handle your data? Email{' '}
              <a href="mailto:privacy@snapit.ink">privacy@snapit.ink</a>.
            </p>
          </Section>
        </div>
      </div>

      <style>{`
        .prose-legal {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: hsl(var(--foreground) / 0.85);
        }
        .prose-legal p { margin-top: 0; margin-bottom: 0.9rem; }
        .prose-legal ul { padding-left: 1.4rem; margin-bottom: 0.9rem; }
        .prose-legal li { margin-bottom: 0.35rem; }
        .prose-legal strong { color: hsl(var(--foreground)); font-weight: 600; }
        .prose-legal a { color: hsl(var(--foreground)); text-underline-offset: 3px; }
        .prose-legal a:hover { opacity: 0.75; }
        .legal-section { margin-bottom: 2.5rem; }
        .legal-section-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: hsl(var(--foreground));
          margin-bottom: 0.6rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        .legal-subsection-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-top: 1rem;
          margin-bottom: 0.4rem;
        }
      `}</style>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <div className="legal-section">
      <h2 className="legal-section-title">{title}</h2>
      {children}
    </div>
  );
}

function Subsection({ title, children }) {
  return (
    <div>
      <h3 className="legal-subsection-title">{title}</h3>
      {children}
    </div>
  );
}
