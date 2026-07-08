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

// ── Browser device identity ────────────────────────────────────────────────

const BROWSER_DEVICE_KEY = 'snap_browser_device_id';

/**
 * Returns a stable UUID for this browser (persisted in localStorage).
 * Used as the device_id so the browser can be targeted and authenticated
 * in WebSocket transfer routes.
 */
export function getBrowserDeviceId() {
  let id = localStorage.getItem(BROWSER_DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(BROWSER_DEVICE_KEY, id);
  }
  return id;
}

/**
 * Registers (or updates) this browser as a 'web' device. Idempotent —
 * safe to call on every page load; the server upserts by device_id.
 */
export async function registerBrowserDevice() {
  const deviceId = getBrowserDeviceId();
  const ua = navigator.userAgent;
  const name = /Edg\//i.test(ua)
    ? 'Edge Browser'
    : /Chrome\//i.test(ua)
    ? 'Chrome Browser'
    : /Firefox\//i.test(ua)
    ? 'Firefox Browser'
    : /Safari\//i.test(ua)
    ? 'Safari Browser'
    : 'Web Browser';

  const res = await fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_id: deviceId, name, platform: 'web' }),
  });
  if (!res.ok) throw new Error('Failed to register browser device');
}

// ── Devices ───────────────────────────────────────────────────────────────

export async function listOtherDevices() {
  const res = await fetch('/api/devices');
  if (!res.ok) throw new Error('Failed to load devices');
  const { devices } = await res.json();
  const myId = getBrowserDeviceId();
  // Exclude this browser so the user can't accidentally send to themselves.
  return (devices ?? []).filter((d) => d.id !== myId);
}

// ── Start transfer ─────────────────────────────────────────────────────────

export async function startTransfer({ fileName, fileSize, mimeType, targetDeviceId }) {
  const deviceId = getBrowserDeviceId();
  const res = await fetch('/api/transfer/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
    },
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
 *
 * The `done` flag prevents ws.onerror from calling onError after the send
 * loop has already resolved. The server closes its end of the connection
 * when bytes_relayed >= file_size, which can arrive (as an onerror or
 * readyState change) slightly after ws.close()+resolve() in the success
 * path — without the flag this would flip the UI from "done" to "error".
 */
export async function sendFile(sessionId, file, { onProgress, onError } = {}) {
  const token = await getToken();
  const deviceId = getBrowserDeviceId();
  const uri = `${WS_BASE}/transfer/${sessionId}/send?token=${encodeURIComponent(token)}&device_id=${encodeURIComponent(deviceId)}`;
  const ws = new WebSocket(uri);
  ws.binaryType = 'arraybuffer';

  return new Promise((resolve, reject) => {
    let done = false;

    ws.onopen = async () => {
      try {
        let offset = 0;
        while (offset < file.size) {
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          const buf = await slice.arrayBuffer();
          // After the async gap the server may have already closed the
          // connection (it breaks when bytes_relayed >= file_size).
          // A readyState change here means all data was received; bail cleanly.
          if (ws.readyState !== WebSocket.OPEN) break;
          ws.send(buf);
          offset += buf.byteLength;
          onProgress?.(offset / file.size);
        }
        done = true;
        if (ws.readyState === WebSocket.OPEN) ws.close();
        resolve();
      } catch (err) {
        if (done) return;
        done = true;
        try { ws.close(); } catch (_) {}
        onError?.(err.message);
        reject(err);
      }
    };

    ws.onerror = () => {
      if (done) return; // post-close onerror — all data was already sent
      done = true;
      const msg = 'WebSocket error during send';
      onError?.(msg);
      reject(new Error(msg));
    };

    ws.onmessage = (e) => {
      if (done) return;
      try {
        const frame = JSON.parse(e.data);
        if (frame.error) {
          done = true;
          try { ws.close(); } catch (_) {}
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
 * Passes the browser's stable device_id so transfer_recv can verify
 * this client is the intended target (device_id == session.target_device_id).
 */
export async function receiveFile(sessionId, fileName, fileSize, { onProgress, onError } = {}) {
  const token = await getToken();
  const deviceId = getBrowserDeviceId();
  const uri = `${WS_BASE}/transfer/${sessionId}/recv?token=${encodeURIComponent(token)}&device_id=${encodeURIComponent(deviceId)}`;
  const ws = new WebSocket(uri);
  ws.binaryType = 'arraybuffer';

  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytesReceived = 0;
    let done = false;

    ws.onmessage = (e) => {
      if (typeof e.data === 'string') {
        // Server sent a JSON error frame — reject and suppress the onclose download.
        if (done) return;
        done = true;
        try {
          const frame = JSON.parse(e.data);
          if (frame.error) {
            onError?.(frame.error);
            reject(new Error(frame.error));
          }
        } catch { /* ignore malformed frame */ }
        return;
      }
      chunks.push(e.data);
      bytesReceived += e.data.byteLength;
      if (fileSize > 0) onProgress?.(Math.min(bytesReceived / fileSize, 1));
    };

    ws.onclose = () => {
      if (done) return; // error already handled — don't trigger a spurious download
      done = true;
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
      if (done) return;
      done = true;
      const msg = 'WebSocket error during receive';
      onError?.(msg);
      reject(new Error(msg));
    };
  });
}
