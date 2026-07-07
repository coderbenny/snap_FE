'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, RefreshCw, Loader2, ClipboardList, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { loadKey } from '@/lib/crypto';
import { decrypt } from '@/lib/crypto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UnlockForm from './unlock-form';
import ClipCard from './clip-card';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'text', label: 'Text' },
  { value: 'url', label: 'URL' },
  { value: 'image', label: 'Image' },
  { value: 'file', label: 'File' },
];

async function decryptItems(items, key) {
  return Promise.all(
    items
      .filter((item) => !item.deleted_at)
      .map(async (item) => {
        try {
          const content = await decrypt(key, item.ciphertext, item.iv);
          return { ...item, content };
        } catch {
          return { ...item, content: null };
        }
      }),
  );
}

export default function ClipboardViewer() {
  const [viewState, setViewState] = useState('checking'); // checking|locked|fetching|ready|upgrade|error
  const [clips, setClips] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [hasMore, setHasMore] = useState(false);
  const [nextSince, setNextSince] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const keyRef = useRef(null);

  const fetchClips = useCallback(async (key, since, append = false) => {
    if (!append) setViewState('fetching');
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: '50' });
      if (since) params.set('since', String(since));

      const res = await fetch(`/api/sync/pull?${params}`);

      if (res.status === 403) { setViewState('upgrade'); return; }
      if (res.status === 401) { setViewState('error'); return; }
      if (!res.ok) throw new Error('fetch failed');

      const data = await res.json();
      const decrypted = await decryptItems(data.items, key);

      setClips((prev) => (append ? [...prev, ...decrypted] : decrypted));
      setHasMore(data.has_more);
      setNextSince(data.next_since ?? null);
      if (!append) setPage(0);
      setViewState('ready');
    } catch {
      setViewState('error');
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      const k = await loadKey();
      if (!k) { setViewState('locked'); return; }
      keyRef.current = k;
      await fetchClips(k, null, false);
    }
    init();
  }, [fetchClips]);

  // Reset to first page whenever the filter changes.
  useEffect(() => { setPage(0); }, [search, typeFilter]);

  function handleUnlock(key) {
    keyRef.current = key;
    fetchClips(key, null, false);
  }

  function handleDelete(id) {
    setClips((prev) => prev.filter((c) => c.id !== id));
  }

  function handleRefresh() {
    if (keyRef.current) fetchClips(keyRef.current, null, false);
  }

  const decryptFailCount = clips.filter((c) => c.content === null).length;

  // Client-side filter
  const filtered = clips.filter((clip) => {
    if (typeFilter !== 'all' && clip.content_type !== typeFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const matchContent = clip.content?.toLowerCase().includes(q);
    const matchTags = clip.tags?.some((t) => t.toLowerCase().includes(q));
    return matchContent || matchTags;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const isLastPage = safePage >= pageCount - 1;
  const canLoadMore = isLastPage && hasMore && !search && typeFilter === 'all';

  // ── Render states ──────────────────────────────────────────────────────────

  if (viewState === 'checking' || viewState === 'fetching') {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (viewState === 'locked') {
    return <UnlockForm onUnlock={handleUnlock} />;
  }

  if (viewState === 'upgrade') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Zap className="size-6 text-primary" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">Pro plan required</h2>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Cross-device sync and the web clipboard viewer are available on the Pro plan and above.
        </p>
        <Button className="mt-5" asChild>
          <Link href="/billing">Upgrade to Pro</Link>
        </Button>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load clips. Check your connection or sign in again.
        </p>
        <Button variant="outline" className="mt-4" onClick={handleRefresh}>
          Try again
        </Button>
      </div>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {decryptFailCount > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          {decryptFailCount === clips.length
            ? 'None of your clips could be decrypted. Make sure you entered the correct password — sign out and sign back in to re-enter it.'
            : `${decryptFailCount} clip${decryptFailCount === 1 ? '' : 's'} could not be decrypted. They may have been saved by an older version of the app and cannot be recovered.`}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clips…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
            {TYPE_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  typeFilter === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Clip count */}
      {clips.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'clip' : 'clips'}
          {search || typeFilter !== 'all' ? ' matching filter' : ''}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <ClipboardList className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {clips.length === 0
              ? 'No clips synced yet. Copy something on a device with Snapit installed.'
              : 'No clips match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((clip) => (
            <ClipCard key={clip.id} clip={clip} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Pagination footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </button>

          <span className="text-xs text-muted-foreground">
            Page {safePage + 1} of {pageCount}
          </span>

          {canLoadMore ? (
            <Button
              variant="outline"
              size="sm"
              disabled={loadingMore}
              onClick={() => fetchClips(keyRef.current, nextSince, true)}
              className="text-xs"
            >
              {loadingMore && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {loadingMore ? 'Loading…' : 'Load more'}
            </Button>
          ) : (
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={isLastPage}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
