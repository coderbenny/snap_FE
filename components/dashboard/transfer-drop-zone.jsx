'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Loader2, Check, X, Monitor, Laptop, Smartphone } from 'lucide-react';

import {
  listOtherDevices,
  startTransfer,
  sendFile,
  cancelTransfer,
} from '@/lib/transfer-client';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function DeviceIcon({ platform }) {
  if (platform === 'macos' || platform === 'windows' || platform === 'linux') {
    return <Laptop className="size-4 shrink-0 text-muted-foreground" />;
  }
  if (platform === 'ios' || platform === 'android') {
    return <Smartphone className="size-4 shrink-0 text-muted-foreground" />;
  }
  return <Monitor className="size-4 shrink-0 text-muted-foreground" />;
}

// ── Main component ─────────────────────────────────────────────────────────

export default function TransferDropZone({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState('idle'); // idle | picking | sending | done | error
  const [pendingFile, setPendingFile] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const dragCounter = useRef(0);

  const reset = () => {
    setStep('idle');
    setPendingFile(null);
    setSelectedDevice(null);
    setProgress(0);
    setErrorMsg('');
    setSessionId(null);
    dragCounter.current = 0;
  };

  const openPicker = useCallback(async (file) => {
    setPendingFile(file);
    setStep('picking');
    try {
      const devs = await listOtherDevices();
      setDevices(devs);
    } catch {
      setDevices([]);
    }
  }, []);

  // ── Drag handlers ────────────────────────────────────────────────────────

  function onDragEnter(e) {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) openPicker(file);
  }

  // ── Send ─────────────────────────────────────────────────────────────────

  async function handleSend() {
    if (!pendingFile || !selectedDevice) return;
    setStep('sending');
    setProgress(0);

    try {
      const sid = await startTransfer({
        fileName: pendingFile.name,
        fileSize: pendingFile.size,
        mimeType: pendingFile.type || 'application/octet-stream',
        targetDeviceId: selectedDevice.id,
      });
      setSessionId(sid);

      await sendFile(sid, pendingFile, {
        onProgress: (p) => setProgress(p),
        onError: (msg) => { setErrorMsg(msg); setStep('error'); },
      });

      setProgress(1);
      setStep('done');
      setTimeout(reset, 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Transfer failed');
      setStep('error');
    }
  }

  async function handleCancel() {
    if (sessionId) {
      try { await cancelTransfer(sessionId); } catch { /* ignore */ }
    }
    reset();
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="relative min-h-0 flex-1"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}

      {/* Drag-over overlay */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm">
          <Upload className="size-10 text-primary" />
          <p className="mt-3 text-sm font-medium text-primary">
            Drop to send to a device
          </p>
        </div>
      )}

      {/* Modal dialog */}
      {step !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            {step === 'picking' && (
              <_PickerView
                file={pendingFile}
                devices={devices}
                selected={selectedDevice}
                onSelect={setSelectedDevice}
                onSend={handleSend}
                onCancel={reset}
              />
            )}
            {step === 'sending' && (
              <_SendingView
                file={pendingFile}
                device={selectedDevice}
                progress={progress}
                onCancel={handleCancel}
              />
            )}
            {step === 'done' && <_DoneView file={pendingFile} onClose={reset} />}
            {step === 'error' && (
              <_ErrorView message={errorMsg} onClose={reset} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-views ──────────────────────────────────────────────────────────────

function _PickerView({ file, devices, selected, onSelect, onSend, onCancel }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">Send to device</p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {file?.name} &bull; {formatSize(file?.size ?? 0)}
      </p>

      {devices.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No other devices found. Install Snapit on another device first.
        </p>
      ) : (
        <ul className="mb-4 space-y-2 max-h-48 overflow-y-auto">
          {devices.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => onSelect(d)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                  selected?.id === d.id
                    ? 'border-primary bg-primary/8 text-foreground'
                    : 'border-border hover:border-primary/40 hover:bg-muted'
                }`}
              >
                <DeviceIcon platform={d.platform} />
                <span className="flex-1 truncate">{d.name}</span>
                {selected?.id === d.id && <Check className="size-3.5 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={onSend}
          disabled={!selected}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </>
  );
}

function _SendingView({ file, device, progress, onCancel }) {
  const pct = Math.round((progress ?? 0) * 100);
  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-foreground">Sending…</p>
      <p className="text-sm text-muted-foreground">
        {file?.name} → {device?.name}
      </p>
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-right text-xs text-muted-foreground">{pct}%</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
        >
          <Loader2 className="size-3.5 animate-spin" /> Cancel
        </button>
      </div>
    </div>
  );
}

function _DoneView({ file, onClose }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <Check className="size-6 text-green-600 dark:text-green-400" />
      </div>
      <p className="text-base font-semibold text-foreground">Sent!</p>
      <p className="text-sm text-muted-foreground">{file?.name} delivered.</p>
      <button onClick={onClose} className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
        Close
      </button>
    </div>
  );
}

function _ErrorView({ message, onClose }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <X className="size-6 text-destructive" />
      </div>
      <p className="text-base font-semibold text-foreground">Transfer failed</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <button onClick={onClose} className="mt-2 text-sm text-primary underline-offset-4 hover:underline">
        Close
      </button>
    </div>
  );
}
