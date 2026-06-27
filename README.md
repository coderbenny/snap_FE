# SNAP — Web Client

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

The official web client for **SNAP** — a universal clipboard vault that syncs your clipboard history across every device. This Next.js app serves two roles at once: a public marketing site (landing page, pricing, blog) and a private web dashboard where users can browse their clipboard history, manage devices, collaborate on team snippets, and handle billing.

---

## Features

| Area | What it does |
|---|---|
| **Landing page** | Marketing home, feature highlights, and call-to-action |
| **Pricing** | Plan comparison with Stripe-powered upgrade flow |
| **Blog** | MDX-powered articles served from `content/` |
| **Auth** | Email/password login and registration backed by the SNAP API |
| **Dashboard** | Paginated clipboard history with search, filter, and copy-to-clipboard |
| **Devices** | View all linked devices and revoke access tokens individually |
| **Team snippets** | Create, share, and manage snippets across a team workspace |
| **Billing** | Upgrade plan, view invoice history, manage subscription |

All dashboard content is **decrypted in the browser** — the server never sees plaintext clipboard data.

---

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org) (App Router, JavaScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Components:** [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com)
- **HTTP client:** [Axios 1.7](https://axios-http.com)
- **Session:** [iron-session](https://github.com/vvo/iron-session)
- **SEO:** [next-seo](https://github.com/garmeeh/next-seo)
- **MDX:** [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Utilities:** date-fns, clsx, tailwind-merge, lucide-react

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later (bundled with Node 18)
- A running instance of the [SNAP Flask backend](../server/README.md)

---

## Quickstart

```bash
# 1. Clone the monorepo and enter the web client
git clone <repo-url> snap
cd snap/client

# 2. Install dependencies
npm install

# 3. Copy the example environment file and fill in your values
cp .env.example .env.local
# Edit .env.local — at minimum set NEXT_PUBLIC_API_URL

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app hot-reloads on every save.

### Production build

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env.local` file in this directory (never commit it). All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle; the rest are server-only.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the SNAP Flask backend, e.g. `http://localhost:5000` |
| `NEXT_PUBLIC_APP_URL` | No | Public URL of this web client, used for canonical URLs and OG tags |
| `SESSION_SECRET` | Yes | Random 32-byte hex string used to sign iron-session cookies |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key for the client-side billing flow |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for server-side webhook and billing API routes |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |

Generate a session secret quickly:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Client-Side Decryption

SNAP uses **zero-knowledge encryption**: clipboard content is encrypted on the originating device before it ever leaves it, and the backend stores only ciphertext. The web dashboard replicates the same scheme used by the desktop and mobile clients:

1. The user's passphrase is fed into **PBKDF2-SHA256** (600 000 iterations) with a per-user salt to derive a 256-bit key — this derivation happens entirely in the browser via the Web Crypto API.
2. Each clipboard entry is decrypted with **AES-256-GCM** using that derived key and the per-entry IV stored alongside the ciphertext.
3. The derived key and all plaintext live only in memory for the duration of the session and are never sent to the server.

The relevant logic lives in `lib/crypto.js`.

---

## Project Structure

```
client/
├── app/
│   ├── (auth)/              # Login and register pages (no dashboard shell)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Authenticated dashboard (shared layout with sidebar)
│   │   ├── dashboard/       # Clipboard history viewer
│   │   ├── devices/         # Linked devices + revoke flow
│   │   ├── clipboard/       # Single-entry detail view
│   │   ├── team/            # Team snippets
│   │   └── billing/         # Plan and subscription management
│   ├── (marketing)/         # Public-facing pages (no auth required)
│   │   ├── page.js          # Landing / home page
│   │   ├── pricing/
│   │   ├── blog/
│   │   └── download/
│   └── api/                 # Next.js route handlers (thin proxies / session helpers)
├── components/              # Shared React components
├── content/                 # MDX blog posts and docs
├── hooks/                   # Custom React hooks
├── lib/
│   ├── crypto.js            # AES-256-GCM + PBKDF2 decryption helpers
│   └── api.js               # Axios instance pre-configured for the backend
├── middleware.js             # Auth guard — redirects unauthenticated requests
├── components.json          # shadcn/ui configuration
├── next.config.mjs
├── tailwind.config.js
└── .env.local               # Local secrets (not committed)
```

---

## Connecting to the Backend and Other Clients

SNAP is a monorepo. The web client talks to the shared Flask backend:

```
snap/
├── client/   ← you are here (Next.js web app)
├── server/   ← Flask REST API + WebSocket relay
├── desktop/  ← Electron/Tauri desktop agent
└── mobile/   ← React Native mobile app
```

All clients authenticate via JWT tokens issued by `POST /api/auth/login`. The web client stores the token in an encrypted iron-session cookie (HttpOnly, SameSite=Strict) rather than localStorage. Real-time clipboard sync across devices uses the WebSocket relay in the backend; the web dashboard polls via REST for simplicity.

Set `NEXT_PUBLIC_API_URL` to the backend's base URL and every `lib/api.js` call will route there automatically.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project in Vercel and set the **Root Directory** to `client`.
3. Add all required environment variables in the Vercel dashboard.
4. Vercel auto-detects Next.js and deploys on every push to `main`.

### Any Node.js host

```bash
npm run build   # outputs to .next/
npm start       # listens on PORT (default 3000)
```

Set `PORT` and all environment variables on your host before starting.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing changes |

---

## License

MIT — see [LICENSE](./LICENSE).
