'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Copy, Trash2, Check, Loader2, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadKey, encrypt, decrypt } from '@/lib/crypto';

function SnippetCard({ snippet, currentUserId, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCopy() {
    if (!snippet.content) return;
    await navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/teams/${snippet.team_id}/snippets/${snippet.id}`, {
        method: 'DELETE',
      });
      if (res.ok || res.status === 204) onDelete(snippet.id);
    } finally {
      setDeleting(false);
    }
  }

  const relativeTime = formatDistanceToNow(new Date(snippet.synced_at), { addSuffix: true });
  const isOwn = snippet.created_by === currentUserId;

  return (
    <div className="group rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{snippet.title}</p>
          <div className="mt-1.5">
            {snippet.content ? (
              <p className="whitespace-pre-wrap break-all text-sm text-muted-foreground line-clamp-3">
                {snippet.content}
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground italic">
                <Lock className="size-3" />
                Encrypted by another member
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">{relativeTime}</span>
            {snippet.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {snippet.content && (
            <button
              onClick={handleCopy}
              title="Copy"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
            </button>
          )}
          {isOwn && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamSnippets({ teamId, currentUserId }) {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const keyRef = useRef(null);

  useEffect(() => {
    async function init() {
      const k = await loadKey();
      keyRef.current = k;
      await fetchSnippets(k);
    }
    init();
  }, [teamId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchSnippets(key) {
    setLoading(true);
    try {
      const res = await fetch(`/api/teams/${teamId}/snippets?limit=100`);
      const data = await res.json();
      const items = data.items || [];

      const decrypted = await Promise.all(
        items
          .filter((s) => !s.deleted_at)
          .map(async (s) => {
            if (!key) return { ...s, content: null };
            try {
              const content = await decrypt(key, s.ciphertext, s.iv);
              return { ...s, content };
            } catch {
              return { ...s, content: null };
            }
          }),
      );
      setSnippets(decrypted);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');

    if (!keyRef.current) {
      setFormError('Encryption key not available. Please reload the page and sign in again.');
      return;
    }

    setSaving(true);
    try {
      const { ciphertext, iv } = await encrypt(keyRef.current, content);
      const tagList = tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : null;

      const res = await fetch(`/api/teams/${teamId}/snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ciphertext, iv, tags: tagList }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || 'Failed to save snippet'); return; }

      // Optimistically add to list with decrypted content
      setSnippets((prev) => [{ ...data, content }, ...prev]);
      setTitle('');
      setContent('');
      setTags('');
      setShowForm(false);
    } catch {
      setFormError('Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id) {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{snippets.length} shared snippet{snippets.length !== 1 ? 's' : ''}</p>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1.5 size-3.5" />
          New snippet
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground">New shared snippet</h3>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="space-y-1.5">
            <Label htmlFor="snippet-title">Title</Label>
            <Input
              id="snippet-title"
              placeholder="e.g. Deployment command"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="snippet-content">Content</Label>
            <textarea
              id="snippet-content"
              placeholder="Paste your snippet here…"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="snippet-tags">Tags <span className="text-muted-foreground font-normal">(optional, comma-separated)</span></Label>
            <Input
              id="snippet-tags"
              placeholder="e.g. deploy, bash"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-3.5 animate-spin" />}
              Save snippet
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
          <BookOpen className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No shared snippets yet. Create the first one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {snippets.map((s) => (
            <SnippetCard key={s.id} snippet={s} currentUserId={currentUserId} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
