import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Snapit — Universal Clipboard Vault';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 40, color: 'white' }}>S</span>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            letterSpacing: '-2px',
          }}
        >
          Snapit
        </h1>

        <p
          style={{
            fontSize: 28,
            color: '#a1a1aa',
            marginTop: 16,
            marginBottom: 0,
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Universal Clipboard Vault
        </p>

        <p
          style={{
            fontSize: 20,
            color: '#71717a',
            marginTop: 12,
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          Encrypted · Cross-device · Searchable
        </p>
      </div>
    ),
    { ...size },
  );
}
