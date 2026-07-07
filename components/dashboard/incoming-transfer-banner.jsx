'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';

import { receiveFile, cancelTransfer } from '@/lib/transfer-client';

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function IncomingTransferBanner() {
  const [incoming, setIncoming] = useState(null); // { sessionId, fileName, fileSize, senderDeviceName }
  const [accepting, setAccepting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const esRef = useRef(null);

  // ── SSE connection ─────────────────────────────────────────────────────

  useEffect(() => {
    let es;
    let retryTimeout;

    function connect() {
      es = new EventSource('/api/events');
      esRef.current = es;

      es.addEventListener('transfer_incoming', (e) => {
        try {
          const data = JSON.parse(e.data);
          setIncoming({
            sessionId: data.session_id,
            fileName: data.file_name,
            fileSize: data.file_size,
            senderDeviceName: data.sender_device_name,
          });
        } catch { /* ignore malformed payload */ }
      });

      es.addEventListener('transfer_cancelled', (e) => {
        try {
          const { session_id } = JSON.parse(e.data);
          setIncoming((prev) =>
            prev?.sessionId === session_id ? null : prev
          );
        } catch { /* ignore */ }
      });

      es.onerror = () => {
        es.close();
        retryTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      es?.close();
      clearTimeout(retryTimeout);
    };
  }, []);

  // ── Accept / Decline ───────────────────────────────────────────────────

  async function handleAccept() {
    if (!incoming) return;
    setAccepting(true);
    setError(null);
    try {
      await receiveFile(
        incoming.sessionId,
        incoming.fileName,
        incoming.fileSize,
        {
          onProgress: (p) => setProgress(p),
          onError: (msg) => setError(msg),
        },
      );
      setIncoming(null);
    } catch (err) {
      setError(err.message || 'Transfer failed');
    } finally {
      setAccepting(false);
      setProgress(0);
    }
  }

  async function handleDecline() {
    if (!incoming) return;
    try { await cancelTransfer(incoming.sessionId); } catch { /* ignore */ }
    setIncoming(null);
    setError(null);
  }

  if (!incoming) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Download className="size-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Incoming file</p>
            <p className="text-xs text-muted-foreground">
              From {incoming.senderDeviceName}
            </p>
            <p className="mt-0.5 truncate text-xs font-medium text-foreground">
              {incoming.fileName} &bull; {formatSize(incoming.fileSize)}
            </p>
          </div>
        </div>
        {!accepting && (
          <button onClick={handleDecline} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        )}
      </div>

      {accepting && (
        <div className="mt-3 space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="text-right text-xs text-muted-foreground">
            {Math.round(progress * 100)}%
          </p>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {!accepting && !error && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <Download className="size-3" /> Accept
          </button>
        </div>
      )}

      {accepting && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleDecline}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted"
          >
            <Loader2 className="size-3 animate-spin" /> Cancel
          </button>
        </div>
      )}
    </div>
  );
}
