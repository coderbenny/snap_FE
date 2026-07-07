'use client';

const WS_BASE =
  process.env.NEXT_PUBLIC_WS_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'wss://api.snapit.ink/snap'
    : 'ws://localhost:5559/snap');

const CHUNK_SIZE = 65_536; // 64 KB — must match server

// ── Token ─────────────────────────────────────────────────────────────────

async function getToken() {
  const res = await fetch('/api/auth/token');
  if (!res.ok) throw new Error('Not authenticated');
  return (await res.json()).token;
}

// ── Devices ───────────────────────────────────────────────────────────────

export async function listOtherDevices() {
  const res = await fetch('/api/devices');
  if (!res.ok) throw new Error('Failed to load devices');
  const { devices } = await res.json();
  // Filter out the current browser "device" — browsers don't register devices,
  // so all returned devices are valid targets.
  return devices ?? [];
}

// ── Start transfer ─────────────────────────────────────────────────────────

export async function startTransfer({ fileName, fileSize, mimeType, targetDeviceId }) {
  const res = await fetch('/api/transfer/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_name: fileName,
      file_size: fileSize,
      mime_type: mimeType,
      target_device_id: targetDeviceId,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to start transfer');
  }
  return (await res.json()).session_id;
}

export async function cancelTransfer(sessionId) {
  await fetch(`/api/transfer/${sessionId}`, { method: 'DELETE' });
}

// ── Send file ─────────────────────────────────────────────────────────────

/**
 * Streams [file] to the server over WebSocket.
 * onProgress(0–1) fires for each chunk sent.
 */
export async function sendFile(sessionId, file, { onProgress, onError } = {}) {
  const token = await getToken();
  const uri = `${WS_BASE}/transfer/${sessionId}/send?token=${encodeURIComponent(token)}`;
  const ws = new WebSocket(uri);
  ws.binaryType = 'arraybuffer';

  return new Promise((resolve, reject) => {
    ws.onopen = async () => {
      try {
        let offset = 0;
        while (offset < file.size) {
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          const buf = await slice.arrayBuffer();
          ws.send(buf);
          offset += buf.byteLength;
          onProgress?.((offset / file.size));
        }
        ws.close();
        resolve();
      } catch (err) {
        ws.close();
        onError?.(err.message);
        reject(err);
      }
    };

    ws.onerror = (e) => {
      const msg = 'WebSocket error during send';
      onError?.(msg);
      reject(new Error(msg));
    };

    ws.onmessage = (e) => {
      // Server may send JSON error frames.
      try {
        const frame = JSON.parse(e.data);
        if (frame.error) {
          ws.close();
          onError?.(frame.error);
          reject(new Error(frame.error));
        }
      } catch { /* binary ack — ignore */ }
    };
  });
}

// ── Receive file ──────────────────────────────────────────────────────────

/**
 * Opens recv WebSocket, collects chunks, triggers a browser download.
 * onProgress(0–1) fires as bytes arrive.
 */
export async function receiveFile(sessionId, fileName, fileSize, { onProgress, onError } = {}) {
  const token = await getToken();
  const uri = `${WS_BASE}/transfer/${sessionId}/recv?token=${encodeURIComponent(token)}`;
  const ws = new WebSocket(uri);
  ws.binaryType = 'arraybuffer';

  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytesReceived = 0;

    ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        try {
          const frame = JSON.parse(e.data);
          if (frame.error) {
            onError?.(frame.error);
            reject(new Error(frame.error));
          }
        } catch { /* ignore */ }
        return;
      }
      chunks.push(e.data);
      bytesReceived += e.data.byteLength;
      if (fileSize > 0) onProgress?.(Math.min(bytesReceived / fileSize, 1));
    };

    ws.onclose = () => {
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    };

    ws.onerror = () => {
      const msg = 'WebSocket error during receive';
      onError?.(msg);
      reject(new Error(msg));
    };
  });
}
