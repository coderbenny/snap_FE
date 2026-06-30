export const metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of the Snapit clipboard sync service.',
};

const LAST_UPDATED = 'June 30, 2026';

export default function TermsPage() {
  return (
    <main className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose-legal">
          <Section title="1. Acceptance">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Snapit
              clipboard synchronisation service, including our website, desktop applications, and
              mobile applications (collectively, the &quot;Service&quot;).
            </p>
            <p>
              By creating an account or using the Service you confirm that you have read,
              understood, and agree to be bound by these Terms. If you do not agree, do not use the
              Service.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              Snapit provides end-to-end encrypted clipboard synchronisation across your authorised
              devices. Clipboard items are encrypted on your device before transmission; we cannot
              access the contents of your clipboard.
            </p>
            <p>
              The Service is available on a free tier (single device) and paid tiers (Pro, Pro + AI,
              Team) as described on our <a href="/pricing">pricing page</a>.
            </p>
          </Section>

          <Section title="3. Accounts">
            <Subsection title="3.1 Registration">
              <p>
                You must provide a valid email address and choose a password with a minimum of eight
                characters. You are responsible for maintaining the confidentiality of your
                password. Because clipboard data is encrypted with a key derived from your password,{' '}
                <strong>losing your password means your clipboard data cannot be recovered</strong>.
              </p>
            </Subsection>
            <Subsection title="3.2 Account security">
              <p>
                You are responsible for all activity that occurs under your account. Notify us
                immediately at <a href="mailto:security@snapit.ink">security@snapit.ink</a> if you
                suspect unauthorised access.
              </p>
            </Subsection>
            <Subsection title="3.3 Eligibility">
              <p>
                You must be at least 13 years old to use the Service. By using the Service you
                represent that you meet this requirement.
              </p>
            </Subsection>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service to store or transmit unlawful content.</li>
              <li>Attempt to circumvent encryption, authentication, or rate limits.</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
              <li>
                Use automated tools to access the Service at a volume that disrupts normal
                operation.
              </li>
              <li>Resell or sublicense access to the Service without written permission.</li>
              <li>Impersonate any person or entity.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these rules without
              prior notice.
            </p>
          </Section>

          <Section title="5. Subscriptions and Billing">
            <Subsection title="5.1 Paid plans">
              <p>
                Paid subscriptions are billed on a recurring monthly basis via Paystack. By
                subscribing you authorise Paystack to charge your payment method each billing period
                until you cancel.
              </p>
            </Subsection>
            <Subsection title="5.2 Cancellation">
              <p>
                You may cancel your subscription at any time from your account settings.
                Cancellation takes effect at the end of the current billing period; you retain
                access to paid features until then. We do not provide pro-rated refunds for partial
                months.
              </p>
            </Subsection>
            <Subsection title="5.3 Price changes">
              <p>
                We will give you at least 30 days&apos; notice before increasing the price of an
                existing subscription. Continued use after the effective date constitutes acceptance
                of the new price.
              </p>
            </Subsection>
            <Subsection title="5.4 Taxes">
              <p>
                Prices are exclusive of applicable taxes. You are responsible for any taxes
                applicable in your jurisdiction.
              </p>
            </Subsection>
          </Section>

          <Section title="6. Data and Privacy">
            <p>
              Your use of the Service is also governed by our <a href="/privacy">Privacy Policy</a>,
              which is incorporated into these Terms by reference.
            </p>
            <p>
              You retain ownership of your clipboard content. By using the Service you grant us a
              limited, non-exclusive licence to store and transmit your encrypted data solely for
              the purpose of providing the Service.
            </p>
          </Section>

          <Section title="7. Service Availability">
            <p>
              We aim for high availability but do not guarantee uninterrupted access. Planned
              maintenance, unexpected outages, or force-majeure events may temporarily affect the
              Service. We are not liable for losses arising from unavailability.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              The Snapit name, logo, application code, and website content are owned by us and
              protected by applicable intellectual property laws. Nothing in these Terms grants you
              a licence to use our trademarks or proprietary content beyond what is necessary to use
              the Service normally.
            </p>
          </Section>

          <Section title="9. Disclaimers">
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, express or implied, including warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the Service will be error-free, virus-free, or that any
              particular clipboard item will be retained indefinitely.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, our total liability to you for any
              claims arising from or related to the Service shall not exceed the greater of (a) the
              amount you paid us in the 12 months preceding the claim or (b) USD 100.
            </p>
            <p>
              We are not liable for indirect, incidental, special, consequential, or punitive
              damages, including loss of data, loss of profits, or business interruption.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              You may terminate your account at any time by deleting it from your account settings.
              We may suspend or terminate your access if you breach these Terms, with or without
              notice depending on the severity of the breach.
            </p>
            <p>
              Upon termination, your right to use the Service ceases immediately. We will delete
              your data in accordance with our Privacy Policy.
            </p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>
              We may update these Terms from time to time. We will notify you by email at least 14
              days before material changes take effect. Continued use of the Service after the
              effective date constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="13. Governing Law">
            <p>
              These Terms are governed by and construed in accordance with applicable law. Any
              disputes that cannot be resolved amicably will be submitted to the jurisdiction of the
              competent courts.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              Questions about these Terms? Email{' '}
              <a href="mailto:legal@snapit.ink">legal@snapit.ink</a>.
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
