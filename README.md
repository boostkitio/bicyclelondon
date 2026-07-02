# Bicycle London

Next.js rebuild of [bicyclelondon.com](https://www.bicyclelondon.com) (previously Wix).
Next.js 16 App Router, Tailwind v4, Sanity (embedded Studio at `/studio`),
Convex + Resend for the contact form, deployed on Vercel from `main`.

## Commands

```bash
npm run dev        # local dev
npm run build      # production build (run before pushing)
npm run start      # serve the production build
npm test           # unit tests (Vitest)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Setup

Copy `.env.example` to `.env.local` and fill in the values.

Full structure, content model, conventions and go-live checklist: see
[AGENTS.md](AGENTS.md).
