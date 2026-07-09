'use client';

/**
 * Client-side AES-256-GCM encryption utilities.
 * Key is derived from the user's password via PBKDF2 — never sent to the server.
 *
 * Key storage lifecycle:
 *  1. deriveKey(password, userId)   → CryptoKey (extractable)
 *  2. exportKey(key)                → base64 string  → sessionStorage
 *  3. importKey(base64)             → CryptoKey (non-extractable) for use
 *  sessionStorage is tab-scoped and cleared when the tab closes.
 */

const SESSION_KEY_NAME = 'snap_enc_key';

/** Derive a 256-bit AES-GCM key from password + userId using PBKDF2. */
export async function deriveKey(password, userId) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  // Salt is deterministic from userId — unique per user, no server round-trip needed.
  const salt = enc.encode(`${userId}:snap-key-v1`);

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 200_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true, // extractable so we can persist to sessionStorage
    ['encrypt', 'decrypt'],
  );
}

/** Export a CryptoKey to base64 for sessionStorage. */
export async function exportKey(key) {
  const raw = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

/** Import a base64 key from sessionStorage back to a non-extractable CryptoKey. */
export async function importKey(base64) {
  const raw = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/** Persist a derived key in sessionStorage. */
export async function storeKey(key) {
  sessionStorage.setItem(SESSION_KEY_NAME, await exportKey(key));
}

/** Load the key from sessionStorage, or null if not present. */
export async function loadKey() {
  const stored = sessionStorage.getItem(SESSION_KEY_NAME);
  if (!stored) return null;
  return importKey(stored);
}

/** Clear the key from sessionStorage (on logout). */
export function clearKey() {
  sessionStorage.removeItem(SESSION_KEY_NAME);
}

/** Decrypt a base64-encoded ciphertext+iv pair. Returns plaintext string. */
export async function decrypt(key, ciphertextB64, ivB64) {
  const ciphertext = Uint8Array.from(atob(ciphertextB64), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivB64), (c) => c.charCodeAt(0));
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

/** Encrypt a plaintext string. Returns { ciphertext, iv } as base64 strings. */
export async function encrypt(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}
