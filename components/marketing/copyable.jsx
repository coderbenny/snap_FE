'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// A terminal command with a one-click copy button. Fitting for a clipboard app.
export default function Copyable({ command, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-secure context) — fail silently; the
      // command text is still visible and selectable.
    }
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-border bg-muted/60 px-4 py-3 ${className}`}
    >
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre font-mono text-sm text-foreground">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy command'}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-1 focus-visible:outline-ring"
      >
        {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
