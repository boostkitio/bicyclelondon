<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bicycle London

Rebuild of bicyclelondon.com (was Wix) as a Next.js site. Faithful-but-improved
clone; a full brand relaunch is planned later.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- Sanity (embedded Studio at `/studio`) for Slipstream articles, case studies, jobs
- Convex (form storage) + Resend (email) — code in place, not yet provisioned
- Vercel hosting, auto-deploy from `main` on `boostkitio/bicyclelondon`

## Commands

```bash
npm run dev      # local dev
npm run build    # production build (run before pushing)
npm run start    # serve the production build
```

## Structure

- `src/app/(site)/` — public pages (route group; gets header/footer)
- `src/app/studio/` — embedded Sanity Studio (no site chrome)
- `src/components/` — UI, page, form, SEO components
- `src/components/scroll/` — GSAP + Lenis scroll effects (pinned, parallax, marquee, magnetic, mask reveal)
- `src/lib/gsap.ts` — single GSAP + ScrollTrigger registration point; always import GSAP from here
- `src/content/` — hard-coded marketing copy (services, team)
- `src/sanity/` — schema, client, queries, image helpers
- `src/lib/site.ts` — site config (nav, contact, socials)
- `convex/` — schema + submissions mutation (excluded from the Next typecheck)
- `scripts/` — one-off migration scripts (see below)
- `public/images/`, `public/team/` — downloaded brand assets (not hotlinked)

## Content (Sanity)

Project `2nfeuqe8`, dataset `production`. Editable types: `slipstreamArticle`,
`caseStudy`, `job`, plus `author`, `category`, `client`, `siteSettings`.
Marketing/service pages are hard-coded React in `src/content` + `src/app/(site)`.

Migration scripts (idempotent, deterministic `_id`s, read env from `.env.local`
and `C:/dev/projects/.env.boostkit-shared`):

```bash
node scripts/migrate.mjs          # case studies, jobs, articles, site settings
node scripts/migrate-logos.mjs    # client logo wall
node scripts/download-team.mjs    # team headshots -> public/team
node scripts/fix-standfirst.mjs   # regenerate summaries from body
```

## Conventions

- Clean human-readable slugs; old Wix URLs 301-redirect via `src/middleware.ts`
- App-wide smooth scroll via Lenis (`SmoothScroll` in the root layout, driven off GSAP's ticker). Logo-to-top and route scroll-reset route through `useLenis().scrollTo`, falling back to `window.scrollTo` under reduced-motion (Lenis isn't mounted then)
- Pinned/parallax/marquee effects fall back to static under `(max-width: 767px)` and reduced-motion via `gsap.matchMedia()`; `html`/`body` use `overflow-x: clip` so the tracks can't force horizontal scroll
- Logo click returns to top of home; scroll resets on navigation
- Scroll reveals: lightweight `Reveal` (fail open, body content) vs `scroll/MaskReveal` (GSAP line-mask, display headings); respect reduced-motion
- UK English

## Not yet live (needs provisioning)

- Contact form: `npx convex dev` (Node 22) + a valid `RESEND_API_KEY` / sending domain
- Domain cutover (Wix -> Vercel) is a later step
