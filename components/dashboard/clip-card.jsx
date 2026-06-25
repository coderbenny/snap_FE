'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Trash2, Check, Type, Link2, ImageIcon, FileText, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  text: Type,
  url: Link2,
  image: ImageIcon,
  file: FileText,
};

const TYPE_COLORS = {
  text: 'text-blue-500',
  url: 'text-green-500',
  image: 'text-purple-500',
  file: 'text-orange-500',
};

const PREVIEW_LENGTH = 240;

export default function ClipCard({ clip, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const Icon = TYPE_ICONS[clip.content_type] || Type;
  const iconColor = TYPE_COLORS[clip.content_type] || 'text-muted-foreground';

  const content = clip.content;
  const isLong = content && content.length > PREVIEW_LENGTH;
  const displayContent = isLong && !expanded ? content.slice(0, PREVIEW_LENGTH) + '…' : content;

  async function handleCopy() {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch('/api/sync/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [clip.id] }),
      });
      if (res.ok) onDelete(clip.id);
    } finally {
      setDeleting(false);
    }
  }

  const relativeTime = formatDistanceToNow(new Date(clip.synced_at), { addSuffix: true });

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-muted/30',
        clip.pinned && 'ring-1 ring-primary/20',
      )}
    >
      <div className="flex items-start gap-3">
        {/* Type icon */}
        <div className="mt-0.5 shrink-0">
          <Icon className={cn('size-4', iconColor)} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {content ? (
            <p
              className={cn(
                'whitespace-pre-wrap break-all text-sm text-foreground',
                clip.content_type === 'url' && 'text-blue-500 underline-offset-4 hover:underline',
              )}
            >
              {displayContent}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground">[Could not decrypt]</p>
          )}

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{relativeTime}</span>
            {clip.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {clip.pinned && (
              <Pin className="size-3 shrink-0 text-primary" />
            )}
          </div>
        </div>

        {/* Actions — shown on hover */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleCopy}
            title="Copy"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3.5 text-green-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
