# Snapit — Web Client

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

The official web client for **Snapit** — a universal clipboard sync system. This Next.js app serves two roles: a public marketing site (landing page, pricing, blog) and a private web dashboard where users can browse their clipboard history, manage devices, collaborate on team snippets, and handle billing.

---

## Features

| Area | What it does |
|---|---|
| **Landing page** | Marketing home, feature highlights, and call-to-action |
| **Pricing** | Plan comparison with Paystack-powered upgrade flow |
| **Blog** | MDX-powered articles served from `content/` |
| **Auth** | Email/password login and registration backed by the SNAP API |
| **Dashboard** | Paginated clipboard history with search, filter, and copy-to-clipboard |
| **Devices** | View all linked devices and revoke access tokens individually |
| **Team snippets** | Create, share, and manage snippets across a team workspace |
| **Billing** | Upgrade plan, view invoice history, manage subscription |

All dashboard content is **decrypted in the browser** — the Snapit server never sees plaintext clipboard data.

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
- A running instance of the [Snapit Flask backend](https://github.com/coderbenny/snap_BE)

---

## Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/coderbenny/snap_FE
cd snap_FE

# 2. Install dependencies
npm install

# 3. Copy the example environment file and fill in your values
cp .env.local.example .env.local
# Edit .env.local — at minimum set API_URL and SESSION_SECRET

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
| `API_URL` | Yes | Base URL of the Snapit Flask backend (server-side only), e.g. `http://localhost:5559/snap` |
| `SESSION_SECRET` | Yes | Random string of at least 32 characters used to sign iron-session cookies |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL of this web app, used for canonical links and OG tags, e.g. `https://snapit.ink` |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Yes | Paystack publishable key — safe to expose, used by the Paystack inline checkout in the browser |

Generate a strong session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Client-Side Decryption

Snapit uses **zero-knowledge encryption**: clipboard content is encrypted on the originating device before it ever leaves it, and the backend stores only ciphertext. The web dashboard replicates the same scheme used by the desktop and mobile clients:

1. The user's passphrase is fed into **PBKDF2-SHA256** (200 000 iterations) with a per-user salt to derive a 256-bit key — this derivation happens entirely in the browser via the Web Crypto API.
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

Snapit is split across separate repositories. The web client talks to the Flask backend:

| Repo | Role |
|---|---|
| [snap_FE](https://github.com/coderbenny/snap_FE) | **This repo** — Next.js web app |
| [snap_BE](https://github.com/coderbenny/snap_BE) | Flask REST API, SSE event stream, WebSocket file-transfer relay |
| [snap_PC](https://github.com/coderbenny/snap_PC) | Flutter desktop app (macOS) |
| [snap_mobile](https://github.com/coderbenny/snap_mobile) | Flutter Android app |

All clients authenticate via JWT tokens issued by `POST /snap/auth/login`. The web client stores the token in an encrypted iron-session cookie (HttpOnly, SameSite=Strict) rather than localStorage. Real-time events (sync, file transfer notifications, plan changes) are delivered to the browser via **Server-Sent Events** on the `/snap/events` endpoint.

Set `API_URL` to the backend's base URL and every server-side API call will route there automatically.

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
