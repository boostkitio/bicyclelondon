# Bicycle Proposal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, Boostkit-branded proposal website in `proposal/` on a new `proposal` git branch, covering the Bicycle London rebuild and AI-search-visibility pitch with evidence, scope, timeline and pricing, deployed to its own Vercel project at `bicycleproposal.vercel.app`; then remove the three pitch/evidence pages that currently live inside the real rebuild on `main`.

**Architecture:** `proposal/` is a fully separate Next.js app (own `package.json`, own Tailwind v4 theme using Boostkit's real brand tokens) that exists only on the `proposal` branch and never imports from the root app's `src/`. It ports and reframes evidence/content already researched for `/comparison`, `/visibility` and `/visibility/get-listed`, rewritten so nothing reveals how far along the actual rebuild is. A new Vercel project points `Root Directory: proposal/` and `Production Branch: proposal` at the same GitHub repo, so it deploys independently of the existing `bicyclelondon` Vercel project (which keeps tracking `main`, untouched).

**Tech Stack:** Next.js (App Router, TypeScript) latest stable, Tailwind CSS v4, `next/font/google` (Space Grotesk, DM Sans, JetBrains Mono), plain SVG/CSS charts (no charting library), no CMS/backend (static content only).

## Global Constraints

- `proposal/` is a fully standalone Next.js app with its own `package.json` — it must never `import` from the root app's `src/`.
- Brand tokens are Boostkit's real palette (from `C:\dev\projects\boostkit\app\globals.css`): primary `#4A08BC`, secondary `#757BBD`, accent `#188bf6`, warm `#E8723A`, ink `#0a0a0a`, paper `#fafafa`. Fonts: Space Grotesk (display), DM Sans (body), JetBrains Mono (mono/labels, optional).
- Nowhere in `proposal/` may there be a link, screenshot, or mention of the in-progress rebuild's actual state or design. Content is either (a) evidence about the *current live Wix site*, or (b) a description of *future scope*, never "already built."
- Every page is `robots: noindex, nofollow`; `proposal/src/app/robots.ts` disallows everything; there is no `sitemap.ts` in `proposal/`. It is reachable only via the exact `bicycleproposal.vercel.app` URL.
- Evidence figures (keyword counts, authority scores, LLM test results, trend data) are carried over verbatim from the existing `/comparison` and `/visibility` pages — they are live third-party data pulled 30 June 2026, not invented.
- Pricing figures are known placeholders — £8,000–£12,000 fixed fee for the rebuild, £1,200/month for the AI visibility retainer — Matt confirmed these as a starting anchor to adjust before sending; keep them as plain, easy-to-find constants (not scattered inline) so they're trivial to update.
- UK English throughout (organisation, optimise, etc.).
- Testing approach: this codebase has no unit test runner (confirmed via `package.json` — no jest/vitest/playwright deps). Its established verification pattern is `npm run build` (see root `AGENTS.md`) plus manual/browser QA. Every task below verifies with `npm run build` and, where relevant, a `curl`+`grep` content check against a locally started server, rather than a unit-test framework that doesn't exist in this codebase.
- On `main`, the cleanup task removes `src/app/(site)/comparison/`, `src/app/(site)/visibility/` (incl. `get-listed/`), the now-orphaned `src/components/charts/audit-charts.tsx`, and their three `sitemap.ts` entries, in a commit separate from all `proposal` branch work.

---

## Task 1: Scaffold the standalone `proposal/` Next.js app on a new branch

**Files:**
- Create: `proposal/` (via `create-next-app`, see below)
- Modify: `tsconfig.json` (root) — add `"proposal"` to `exclude`
- Modify: `eslint.config.mjs` (root) — add `"proposal/**"` to `globalIgnores`
- Modify: `AGENTS.md` (root) — one paragraph noting `proposal/` is a separate app

**Interfaces:**
- Produces: a working `proposal/` Next.js app skeleton other tasks add pages/components to. No shared exports yet.

- [ ] **Step 1: Create and switch to the `proposal` branch**

```bash
git checkout -b proposal
```

Expected: `Switched to a new branch 'proposal'`

- [ ] **Step 2: Scaffold the app**

Run from the repo root (`C:\dev\projects\bicycle`):

```bash
npx create-next-app@latest proposal --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

If any interactive prompt still appears (CLI versions vary), answer: TypeScript — Yes, ESLint — Yes, Tailwind CSS — Yes, `src/` directory — Yes, App Router — Yes, import alias `@/*` — Yes, accept the default on anything else (e.g. Turbopack).

Expected: a `proposal/` directory is created with `package.json`, `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `public/`.

- [ ] **Step 3: Verify no nested git repo was created**

```bash
ls -la proposal/.git 2>&1 || echo "no nested .git — correct"
```

Expected: `no nested .git — correct` (create-next-app detects it's inside an existing repo and skips `git init`). If a nested `.git` exists, remove it: `rm -rf proposal/.git`.

- [ ] **Step 4: Add `proposal/`'s own `.gitignore`**

The root `.gitignore` only ignores `/node_modules` (anchored to repo root), so it won't cover `proposal/node_modules`. create-next-app should have already written `proposal/.gitignore`; confirm it exists and covers the essentials:

```bash
cat proposal/.gitignore
```

Expected: it includes `/node_modules`, `/.next/`, `/out/`, `.env*`, `next-env.d.ts` (relative to `proposal/`, so they resolve correctly). If it's missing or absent, create `proposal/.gitignore`:

```
/node_modules
/.next/
/out/
.env*.local
*.pem
npm-debug.log*
.DS_Store
next-env.d.ts
```

- [ ] **Step 5: Exclude `proposal/` from the root app's typecheck and lint**

`proposal/` has its own `tsconfig.json` and `eslint.config.mjs`, but the root app's `tsconfig.json` `include: ["**/*.tsx", ...]` and root `eslint.config.mjs` would otherwise also try to pick up files under `proposal/` if someone runs the root app's `npm run build`/`npm run lint` from the repo root while both trees coexist on this branch.

Edit `tsconfig.json` (root), change:

```json
  "exclude": ["node_modules", "convex", "design_handoff_scroll_effects"]
```

to:

```json
  "exclude": ["node_modules", "convex", "design_handoff_scroll_effects", "proposal"]
```

Edit `eslint.config.mjs` (root), change:

```js
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
```

to:

```js
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // proposal/ is a fully separate Next.js app with its own config.
    "proposal/**",
  ]),
```

- [ ] **Step 6: Note the new app in `AGENTS.md`**

Add a short section to the end of root `AGENTS.md`:

```markdown
## proposal/ (this branch only)

`proposal/` is a separate, standalone Next.js app: a Boostkit-branded pitch
site for the Bicycle rebuild + AI SEO proposal, deployed independently to
`bicycleproposal.vercel.app`. It exists only on the `proposal` branch (never
merged into `main`) and does not import from this app's `src/`. See
`docs/superpowers/specs/2026-07-01-bicycle-proposal-site-design.md`.
```

- [ ] **Step 7: Verify the scaffolded app builds**

```bash
cd proposal && npm run build
```

Expected: build succeeds (`✓ Compiled successfully` / `Build completed`). `cd ..` back to the repo root afterwards.

- [ ] **Step 8: Commit and push**

```bash
git add -A
git commit -m "Scaffold standalone proposal/ Next.js app"
git push -u origin proposal
```

---

## Task 2: Build the shared design system (Boostkit brand) and root layout

**Files:**
- Modify: `proposal/src/app/globals.css` (replace default theme with Boostkit tokens)
- Modify: `proposal/src/app/layout.tsx` (fonts, noindex metadata, header/footer)
- Create: `proposal/src/app/robots.ts`
- Create: `proposal/src/lib/utils.ts`
- Create: `proposal/src/lib/site.ts`
- Create: `proposal/src/components/ui/container.tsx`
- Create: `proposal/src/components/ui/section.tsx`
- Create: `proposal/src/components/ui/button-link.tsx`
- Create: `proposal/src/components/page-hero.tsx`
- Create: `proposal/src/components/layout/site-header.tsx`
- Create: `proposal/src/components/layout/site-footer.tsx`
- Modify: `proposal/src/app/page.tsx` (temporary placeholder, replaced fully in Task 3)
- Delete: `proposal/public/next.svg`, `proposal/public/vercel.svg`, `proposal/public/file.svg`, `proposal/public/window.svg`, `proposal/public/globe.svg` (unused default assets)

**Interfaces:**
- Produces: `cn(...classes)`, `Container({className, children})`, `Section({tone: "white"|"paper"|"dark", className?, containerClassName?, children, id?})`, `ButtonLink({href, variant: "primary"|"dark"|"outline"|"white", className?, children})`, `PageHero({eyebrow?, title, lead?})`, `SiteHeader()`, `SiteFooter()`, `SITE: {name, url, contactEmail}`, `NAV_LINKS: {href, label}[]`. All subsequent tasks consume these.

- [ ] **Step 1: Remove unused default assets**

```bash
rm proposal/public/next.svg proposal/public/vercel.svg proposal/public/file.svg proposal/public/window.svg proposal/public/globe.svg
```

- [ ] **Step 2: Write `proposal/src/lib/utils.ts`**

```ts
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 3: Write `proposal/src/lib/site.ts`**

```ts
export const SITE = {
  name: "Boostkit",
  url: "https://bicycleproposal.vercel.app",
  contactEmail: "matt@boostkit.io",
};

export const NAV_LINKS = [
  { href: "/", label: "Overview" },
  { href: "/evidence", label: "Evidence" },
  { href: "/scope", label: "Scope" },
  { href: "/pricing", label: "Pricing" },
  { href: "/timeline", label: "Timeline" },
];
```

- [ ] **Step 4: Replace `proposal/src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-primary: #4A08BC;
  --color-primary-ink: #3a0699;
  --color-secondary: #757BBD;
  --color-accent: #188bf6;
  --color-warm: #E8723A;
  --color-ink: #0a0a0a;
  --color-paper: #fafafa;

  --font-display: var(--font-space-grotesk), "Space Grotesk", system-ui, sans-serif;
  --font-sans: var(--font-dm-sans), Arial, Helvetica, sans-serif;
  --font-mono: var(--font-jetbrains-mono), "JetBrains Mono", monospace;
}

html {
  scroll-behavior: auto;
}

body {
  font-family: var(--font-sans);
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
}
```

- [ ] **Step 5: Write `proposal/src/components/ui/container.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Write `proposal/src/components/ui/section.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { Container } from "./container";

type Tone = "white" | "paper" | "dark";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  paper: "bg-paper text-ink",
  dark: "bg-ink text-white",
};

export function Section({
  tone = "white",
  className,
  containerClassName,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", tones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
```

- [ ] **Step 7: Write `proposal/src/components/ui/button-link.tsx`**

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "white";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-ink",
  dark: "bg-ink text-white hover:bg-ink/90",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  white: "bg-white text-ink hover:bg-paper",
};

function isExternal(href: string) {
  return (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(base, variants[variant], className);

  if (isExternal(href)) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 8: Write `proposal/src/components/page-hero.tsx`**

```tsx
import { Container } from "@/components/ui/container";

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="bg-ink text-white">
      <Container className="pb-16 pt-28 sm:pb-20 sm:pt-36">
        {eyebrow && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl uppercase sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            {lead}
          </p>
        )}
      </Container>
    </section>
  );
}
```

- [ ] **Step 9: Write `proposal/src/components/layout/site-header.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NAV_LINKS } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white">
      <Container className="flex h-20 flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold uppercase tracking-wide text-ink"
        >
          Boostkit <span className="text-primary">/</span> Bicycle
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wide text-ink/70 hover:text-primary sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 10: Write `proposal/src/components/layout/site-footer.tsx`**

```tsx
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink py-10 text-white/70">
      <Container className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>Prepared by Boostkit (West Media Ltd) for Bicycle London.</p>
        <a
          href={`mailto:${SITE.contactEmail}`}
          className="font-semibold text-white hover:text-accent"
        >
          {SITE.contactEmail}
        </a>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 11: Replace `proposal/src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "A proposal for Bicycle London",
    template: "%s | Boostkit proposal for Bicycle London",
  },
  description:
    "A proposal from Boostkit to Bicycle London covering the Next.js rebuild and an ongoing AI-search-visibility workstream.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-white text-ink antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 12: Write `proposal/src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
```

- [ ] **Step 13: Replace `proposal/src/app/page.tsx` with a temporary placeholder**

This is replaced fully in Task 3 — it only exists here so the build has a valid home route while the design system is verified:

```tsx
import { PageHero } from "@/components/page-hero";

export default function HomePage() {
  return (
    <PageHero
      eyebrow="A proposal for Bicycle London"
      title="Placeholder — replaced in Task 3"
    />
  );
}
```

- [ ] **Step 14: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds. Then spot-check the noindex tag and robots.txt:

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/ | grep -o 'name="robots" content="[^"]*"'
curl -s http://localhost:4310/robots.txt
kill %1
cd ..
```

Expected: the grep prints `name="robots" content="noindex, nofollow..."` and `robots.txt` prints `User-Agent: *` / `Disallow: /`.

- [ ] **Step 15: Commit and push**

```bash
git add -A
git commit -m "Add Boostkit-branded design system and root layout"
git push
```

---

## Task 3: Build the home page (`/`)

**Files:**
- Modify: `proposal/src/app/page.tsx` (replace Task 2's placeholder)

**Interfaces:**
- Consumes: `PageHero`, `Section`, `ButtonLink` from Task 2.
- Produces: nothing new — this is a leaf page.

- [ ] **Step 1: Replace `proposal/src/app/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "A proposal for Bicycle London",
  description:
    "A proposal from Boostkit to Bicycle London: finish the Next.js rebuild and run an ongoing AI-search-visibility workstream, backed by live evidence and a phased plan.",
};

const workstreams = [
  {
    title: "The rebuild",
    detail:
      "A modern Next.js and Sanity-powered site to replace the current Wix build: faster, cleaner metadata, structured data, and a content engine that can grow.",
    cta: "See the rebuild scope",
  },
  {
    title: "AI search visibility",
    detail:
      "An ongoing workstream to get Bicycle into the directories, press and content that Google and AI assistants actually cite, measured monthly.",
    cta: "See the AI SEO scope",
  },
];

const headline = [
  {
    metric: "0",
    label:
      "mentions of Bicycle London across ChatGPT, Perplexity and Gemini when asked to recommend an independent UK media agency",
  },
  {
    metric: "~30",
    label:
      "ranking keywords in the UK, almost entirely the brand name itself",
  },
];

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="A proposal for Bicycle London"
        title="Two workstreams, one plan"
        lead="A rebuilt site and a deliberate push to get Bicycle into the sources Google and AI assistants actually recommend from. Here's the evidence, the scope, the timeline and the pricing."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {workstreams.map((w) => (
            <article
              key={w.title}
              className="rounded-3xl bg-paper p-8 ring-1 ring-black/5"
            >
              <h2 className="font-display text-3xl uppercase">{w.title}</h2>
              <p className="mt-4 leading-relaxed text-black/70">{w.detail}</p>
              <div className="mt-6">
                <ButtonLink href="/scope" variant="outline">
                  {w.cta}
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Why now
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The current site is invisible where it matters most
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {headline.map((h) => (
            <div
              key={h.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span className="font-display text-6xl leading-none text-accent">
                {h.metric}
              </span>
              <p className="mt-4 leading-relaxed text-white/80">{h.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/evidence" variant="white">
            See the full evidence
          </ButtonLink>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Next steps
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Ready to see the numbers?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            The pricing page covers the fixed fee for the rebuild and the
            monthly retainer for the AI visibility workstream.
          </p>
          <div className="mt-8">
            <ButtonLink href="/pricing" variant="primary">
              See pricing
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds with a static `/` route.

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/ | grep -o "Two workstreams, one plan"
kill %1
cd ..
```

Expected: prints `Two workstreams, one plan`.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "Add proposal site home page"
git push
```

---

## Task 4: Build the evidence page (`/evidence`) and chart components

**Files:**
- Create: `proposal/src/components/charts/audit-charts.tsx`
- Create: `proposal/src/app/evidence/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `ButtonLink` from Task 2.
- Produces: `TrendChart({data, unit?, color?, fill?, caption?})`, `CompareBars({items, max?, unit?})`, `SplitBar({segments, caption?})` — used only on this page, but exported for any future page that wants them.

All figures below are carried over verbatim from the existing `/comparison` and `/visibility` pages (`src/app/(site)/comparison/page.tsx`, `src/app/(site)/visibility/page.tsx` on `main`) — live third-party pulls (DataForSEO, Semrush, an Apify crawl, and direct ChatGPT/Perplexity/Gemini queries) run 30 June 2026. Do not invent new numbers; if a figure needs updating later, update it at the source pages too.

- [ ] **Step 1: Write `proposal/src/components/charts/audit-charts.tsx`**

```tsx
// Lightweight, dependency-free data-visualisation components. Pure SVG and
// CSS, no client JS, no charting library. Data is passed in as props and
// laid out deterministically at build time. Scales start at zero so nothing
// is visually exaggerated.

type Pt = { label: string; value: number };

export function TrendChart({
  data,
  unit = "",
  color = "#4A08BC",
  fill = "rgba(74,8,188,0.08)",
  caption,
}: {
  data: Pt[];
  unit?: string;
  color?: string;
  fill?: string;
  caption?: string;
}) {
  const W = 720;
  const H = 260;
  const padX = 44;
  const padTop = 28;
  const padBottom = 44;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const max = Math.max(...data.map((d) => d.value));
  const yMax = max * 1.12 || 1;

  const x = (i: number) => padX + (innerW * i) / (data.length - 1);
  const y = (v: number) => padTop + innerH * (1 - v / yMax);

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${padX},${padTop + innerH} ${line} ${padX + innerW},${padTop + innerH}`;

  const gridValues = [0, yMax / 2, yMax];

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={caption ?? "Trend chart"}
        className="w-full"
      >
        {gridValues.map((gv, i) => (
          <g key={i}>
            <line
              x1={padX}
              x2={padX + innerW}
              y1={y(gv)}
              y2={y(gv)}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
            />
            <text
              x={padX - 8}
              y={y(gv) + 4}
              textAnchor="end"
              fontSize={12}
              fill="currentColor"
              fillOpacity={0.5}
            >
              {Math.round(gv).toLocaleString()}
            </text>
          </g>
        ))}

        <polygon points={area} fill={fill} />
        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((d, i) => {
          const isEdge = i === 0 || i === data.length - 1;
          return (
            <g key={d.label}>
              <circle cx={x(i)} cy={y(d.value)} r={isEdge ? 5 : 3.5} fill={color} />
              {isEdge && (
                <text
                  x={x(i)}
                  y={y(d.value) - 12}
                  textAnchor={i === 0 ? "start" : "end"}
                  fontSize={13}
                  fontWeight={700}
                  fill={color}
                >
                  {unit}
                  {Math.round(d.value).toLocaleString()}
                </text>
              )}
              <text
                x={x(i)}
                y={padTop + innerH + 24}
                textAnchor="middle"
                fontSize={12}
                fill="currentColor"
                fillOpacity={0.55}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && (
        <figcaption className="mt-3 text-sm text-black/55">{caption}</figcaption>
      )}
    </figure>
  );
}

type Bar = { label: string; value: number; display?: string; highlight?: boolean };

export function CompareBars({
  items,
  max,
  unit = "",
}: {
  items: Bar[];
  max?: number;
  unit?: string;
}) {
  const ceiling = max ?? Math.max(...items.map((i) => i.value));

  return (
    <div className="space-y-4">
      {items.map((it) => {
        const pct = Math.max(2, (it.value / ceiling) * 100);
        return (
          <div key={it.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span
                className={
                  it.highlight
                    ? "text-sm font-bold text-ink"
                    : "text-sm font-medium text-black/70"
                }
              >
                {it.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-ink">
                {it.display ?? `${it.value.toLocaleString()}${unit}`}
              </span>
            </div>
            <div className="h-7 overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background: it.highlight ? "#E8723A" : "#4A08BC",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Segment = { label: string; value: number; color: string; textOnLight?: boolean };

export function SplitBar({
  segments,
  caption,
}: {
  segments: Segment[];
  caption?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div>
      <div className="flex h-10 w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
        {segments.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div
              key={s.label}
              className="flex items-center justify-center text-xs font-bold"
              style={{
                width: `${pct}%`,
                background: s.color,
                color: s.textOnLight ? "#000000" : "#ffffff",
              }}
            >
              {pct >= 12 ? `${Math.round(pct)}%` : ""}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-sm text-black/70">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ background: s.color }}
            />
            {s.label}
          </span>
        ))}
      </div>
      {caption && <p className="mt-4 text-sm text-black/55">{caption}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Write `proposal/src/app/evidence/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { TrendChart, CompareBars, SplitBar } from "@/components/charts/audit-charts";

export const metadata: Metadata = {
  title: "The evidence",
  description:
    "Live evidence of where Bicycle London sits in Google and in AI assistants today, and why competitors are recommended and Bicycle is not.",
};

// All figures are from live pulls run on 30 June 2026: DataForSEO (UK
// index), Semrush (uk database), an Apify crawl of the live site, and direct
// queries to ChatGPT, Perplexity and Gemini with web search on.

const llmTest = [
  {
    engine: "ChatGPT",
    model: "web search on",
    named:
      "the7stars, Mostly Media, Republic of Media, Medialab, Goodstuff, Total Media, Brainlabs, Croud and more",
    bicycle: "Not mentioned",
  },
  {
    engine: "Perplexity",
    model: "sonar-pro",
    named:
      "Medialab, Mostly Media, The Kite Factory, plus the main independent-agency directories",
    bicycle: "Not mentioned",
  },
  {
    engine: "Gemini",
    model: "2.5 Pro",
    named: "Medialab, Republic of Media, ROAST, VCCP Media, JACK RYAN and others",
    bicycle: "Not mentioned",
  },
];

const citationSources = [
  "Land of Independents",
  "Alliance of Independent Agencies",
  "The Drum Indie Agency 100",
  "Campaign",
  "Marketing Agency Index",
  "Clutch",
  "PMLive",
  "Prolific North",
  "GoodFirms",
  "Reddit r/advertising",
];

const today = [
  {
    metric: "~30",
    label: "ranking keywords (UK)",
    detail:
      "The current site ranks for around 30 keywords in the UK index, among the smallest footprints of any agency here and the only one that AI assistants do not recommend.",
    source: "DataForSEO",
  },
  {
    metric: "85%",
    label: "of organic value is one branded term",
    detail:
      "About 85% of the site's estimated organic value comes from the single search 'bicycle london'. Strip the brand name out and very little is left.",
    source: "DataForSEO, top keywords",
  },
  {
    metric: "-28%",
    label: "organic visibility since January",
    detail:
      "Estimated organic value has fallen from about 1,445 to 1,038 in six months, while competitors have been adding keywords every month.",
    source: "DataForSEO, 6-month history",
  },
  {
    metric: "0",
    label: "mentions across 3 AI assistants",
    detail:
      "Asked to recommend an independent UK media agency, ChatGPT, Perplexity and Gemini named a combined two dozen agencies. Bicycle was in none of them.",
    source: "Live LLM queries",
  },
  {
    metric: "166",
    label: "referring domains",
    detail:
      "The link profile that signals authority. Competitors carry between 215 and 827 referring domains pointing at them.",
    source: "Semrush",
  },
  {
    metric: "0.33",
    label: "AI-agent readability",
    detail:
      "Lighthouse's 'agentic browsing' score, how cleanly an AI assistant can read the site. Thin content and broken metadata leave little to quote.",
    source: "Lighthouse",
  },
];

const trendData = [
  { label: "Jan", value: 1445 },
  { label: "Feb", value: 1165 },
  { label: "Mar", value: 1051 },
  { label: "Apr", value: 1078 },
  { label: "May", value: 1037 },
  { label: "Jun", value: 1038 },
];

const keywordBars = [
  { label: "the7stars", value: 88 },
  { label: "The Kite Factory", value: 76 },
  { label: "Medialab", value: 73 },
  { label: "Republic of Media", value: 72 },
  { label: "Mostly Media", value: 71 },
  { label: "Goodstuff", value: 38 },
  { label: "Bicycle London", value: 30, highlight: true },
];

const refDomainBars = [
  { label: "Republic of Media", value: 827 },
  { label: "The Kite Factory", value: 644 },
  { label: "the7stars", value: 635 },
  { label: "Goodstuff", value: 426 },
  { label: "Medialab", value: 416 },
  { label: "Mostly Media", value: 215 },
  { label: "Bicycle London", value: 166, highlight: true },
];

const benchmarkRows = [
  { agency: "the7stars", keywords: "88", authority: "32", refs: "635", llm: "Yes" },
  { agency: "The Kite Factory", keywords: "76", authority: "25", refs: "644", llm: "Yes" },
  { agency: "Medialab", keywords: "73", authority: "26", refs: "416", llm: "Yes, all three" },
  { agency: "Republic of Media", keywords: "72", authority: "24", refs: "827", llm: "Yes" },
  { agency: "Mostly Media", keywords: "71", authority: "18", refs: "215", llm: "Yes" },
  { agency: "Goodstuff", keywords: "38", authority: "29", refs: "426", llm: "Yes" },
  {
    agency: "Bicycle London",
    keywords: "30",
    authority: "21",
    refs: "166",
    llm: "No",
    highlight: true,
  },
];

const whyInvisible = [
  "AI assistants do not read the whole web in real time. They assemble these answers from a small set of trusted sources: independent-agency directories, award lists and trade press.",
  "Competitors appear because they are listed and ranked in those sources. Bicycle is largely absent from them, so there is nothing for the model to pull in.",
  "When the models do reach the site, there is little to quote: around 13 pages, a 268-word homepage, case studies with broken metadata, and an agent-readability score of 0.33.",
  "The brand name adds friction. The site also surfaces for 'cycling jobs' and 'bike advertising', so part of its footprint is filed under cycling rather than advertising.",
];

const otherGaps = [
  "The brand name pulls in the wrong intent: the site also surfaces for searches like 'cycling jobs' and 'bike advertising', filing part of its authority under cycling rather than advertising.",
  "Career content sits on a separate careers.bicyclelondon.com subdomain, splitting authority instead of concentrating it on one domain.",
  "Case study pages output a raw record ID where the meta description should be, so search results and social previews have nothing useful to show.",
  "Forty-eight homepage images carry no alt text, and the page ships around 14MB, holding back both accessibility and AI parsing.",
];

const gap = [
  {
    title: "They are in the directories AI reads",
    detail:
      "Land of Independents, the Alliance of Independent Agencies, Clutch and Marketing Agency Index were all cited in the AI answers. Competitors hold profiles there. Bicycle does not.",
  },
  {
    title: "They enter and win awards",
    detail:
      "The Drum Indie Agency 100, Campaign's independent rankings and the Alliance Awards become citations the models trust. Bicycle has very little of this footprint.",
  },
  {
    title: "They earn trade-press coverage",
    detail:
      "Campaign, The Drum and Prolific North write about them, and AI assistants quote those articles. Bicycle generates little ongoing press to be quoted from.",
  },
  {
    title: "They publish deep, quotable content",
    detail:
      "Effectiveness points of view, data and case studies with real results give models and journalists something to cite. The current 13-page site offers almost none.",
  },
  {
    title: "They are readable by machines",
    detail:
      "Clean structured data, clear agency facts and consistent metadata let an AI extract who they are and what they do. Bicycle's metadata is broken in places and its facts are buried.",
  },
  {
    title: "They concentrate their authority",
    detail:
      "Hundreds of referring domains pointing at one site. Bicycle has 166, split further by a separate careers subdomain, so the signal is weaker and divided.",
  },
];

const faqs = [
  {
    question: "Why don't AI assistants recommend Bicycle?",
    answer:
      "AI assistants build these answers from a small set of trusted third-party sources: independent-agency directories, award lists and trade press. Competitors are listed and ranked in those sources; Bicycle is largely absent. The site itself also gives the models very little quotable, machine-readable content to draw on.",
  },
  {
    question: "How was this measured?",
    answer:
      "By asking ChatGPT, Perplexity and Gemini directly, with web search enabled, to recommend an independent UK media agency, and recording who they named and which sources they cited. The search and authority figures come from live DataForSEO and Semrush pulls and an Apify crawl, all run on 30 June 2026.",
  },
  {
    question: "Is the current site penalised or broken?",
    answer:
      "No. It is indexable and technically healthy. The issue is reach and authority, not a penalty: it ranks for very few terms, almost all of them the brand name, and it is missing from the places that feed both Google and the AI engines.",
  },
  {
    question: "Can this realistically be fixed?",
    answer:
      "Yes, and the competitors are the proof. They are not bigger because of a secret. They are simply present in the directories, awards, press and content that visibility is built from. The plan is to do the same, deliberately, and to measure it monthly.",
  },
];

export default function EvidencePage() {
  return (
    <>
      <PageHero
        eyebrow="Search and AI visibility audit"
        title="Where Bicycle stands, and why"
        lead="Type 'recommend me a good independent media agency in the UK' into ChatGPT and Bicycle is nowhere, while the competitors are everywhere. Here is the live evidence of why."
      />

      <Section tone="dark">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The test
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            One question, three AI assistants
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            I asked the three assistants most people now use, with live web search
            switched on, to recommend a good independent media agency in the UK.
            Between them they named more than twenty agencies. Bicycle was not one
            of them.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {llmTest.map((row) => (
            <article
              key={row.engine}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl uppercase text-white">
                  {row.engine}
                </h3>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  {row.model}
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                It recommended
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {row.named}
              </p>
              <p className="mt-5 rounded-xl bg-black/30 px-4 py-3 text-sm font-semibold text-accent">
                Bicycle London: {row.bicycle}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-[auto_1fr]">
          <span className="font-display text-7xl leading-none text-accent sm:text-8xl">
            0
          </span>
          <p className="text-lg leading-relaxed text-white/80">
            mentions of Bicycle London across all three assistants. The same
            agencies came up again and again, pulled from a handful of trusted
            sources. Those sources are listed further down, and Bicycle is missing
            from nearly all of them.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Where Bicycle sits today
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            A small footprint, drifting down
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            The site is not broken. It is simply under-built for search, and the
            little visibility it has is almost all the brand name. Every number
            here is from a live third-party pull.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {today.map((item) => (
            <article
              key={item.label}
              className="flex flex-col rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <span className="font-display text-6xl leading-none text-ink">
                {item.metric}
              </span>
              <p className="mt-3 text-base font-semibold text-ink">{item.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-black/65">
                {item.detail}
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-black/40">
                {item.source}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-paper p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">
              Estimated organic value, last 6 months
            </h3>
            <div className="mt-6 text-ink">
              <TrendChart
                data={trendData}
                caption="Down about 28% since January, while competitors added keywords month on month. Source: DataForSEO, UK."
              />
            </div>
          </div>
          <div className="rounded-3xl bg-paper p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">
              What that traffic is actually made of
            </h3>
            <p className="mt-4 text-black/65">
              Strip out the brand name and the commercial footprint is tiny.
            </p>
            <div className="mt-8">
              <SplitBar
                segments={[
                  {
                    label: "Brand-name searches ('bicycle london')",
                    value: 85,
                    color: "#4A08BC",
                  },
                  {
                    label: "Everything else",
                    value: 15,
                    color: "#188bf6",
                  },
                ]}
                caption="Around 85% of estimated organic value comes from one branded term. New business rarely starts by searching the brand by name."
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The competitive picture
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Bicycle vs the agencies it is up against
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These are the independents the AI assistants actually recommend.
            Bicycle is the only one missing from those answers. Underneath that,
            it trails on the two things that earn the recommendation: a broad
            non-branded footprint and the authority signals that search and AI
            lean on.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">Ranking keywords (UK)</h3>
            <p className="mt-2 text-sm text-black/55">
              How many searches each agency shows up for. Source: DataForSEO.
            </p>
            <div className="mt-6">
              <CompareBars items={keywordBars} />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">Referring domains</h3>
            <p className="mt-2 text-sm text-black/55">
              Distinct sites linking in, a core authority signal. Source: Semrush.
            </p>
            <div className="mt-6">
              <CompareBars items={refDomainBars} />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-ink text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">Agency</th>
                <th className="px-5 py-4 font-semibold">Ranking keywords (UK)</th>
                <th className="px-5 py-4 font-semibold">Authority score</th>
                <th className="px-5 py-4 font-semibold">Referring domains</th>
                <th className="px-5 py-4 font-semibold">In AI answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {benchmarkRows.map((row) => (
                <tr key={row.agency} className={row.highlight ? "bg-warm/10" : ""}>
                  <th className="px-5 py-4 font-semibold text-ink">{row.agency}</th>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.keywords}</td>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.authority}</td>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.refs}</td>
                  <td
                    className={
                      row.highlight
                        ? "px-5 py-4 font-bold text-ink"
                        : "px-5 py-4 text-black/70"
                    }
                  >
                    {row.llm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-black/55">
          Authority score is Semrush&apos;s 0 to 100 measure of backlink strength.
          Goodstuff is worth a note: it ranks for a similar number of keywords to
          Bicycle, but far more authority and brand presence is why it gets
          recommended and Bicycle does not. On the measure that matters most for
          this brief, being recommended by AI, Bicycle is the only agency here
          absent.
        </p>

        <div className="mt-8 rounded-3xl bg-ink p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The Total Media lesson
          </p>
          <h3 className="mt-3 font-display text-3xl uppercase">
            Reputation outlasts a website
          </h3>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/80">
            Total Media is an established independent that has moved into Above
            Agency. Its new home, total.above.agency, now ranks for just 9
            keywords with no measurable backlink profile of its own. Yet ChatGPT
            still recommends Total Media, purely on the strength of its reputation
            and the directories and press that already mention it. That is the
            clearest proof of the point: AI recommendations are built on off-site
            reputation, not just your own website. It is also a sharp reminder of
            how much visibility a migration can cost if equity is not protected,
            which is exactly what Bicycle&apos;s rebuild is designed to avoid.
          </p>
        </div>
      </Section>

      <Section tone="dark">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The mechanism
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Why the AI engines can&apos;t see Bicycle
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {whyInvisible.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 leading-relaxed text-white/80"
            >
              {item}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The sources the assistants cited
          </p>
          <p className="mt-3 max-w-3xl text-white/70">
            These are the directories, rankings and titles the answers were built
            from. Competitors appear across them. Bicycle appears on almost none.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {citationSources.map((src) => (
              <span
                key={src}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                {src}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The gap
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            What the competitors do that Bicycle does not
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            None of this is a secret advantage. It is a set of deliberate habits
            that build visibility for both Google and the AI engines.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {gap.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-black/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Other gaps in the current site
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Smaller technical issues that add up
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {otherGaps.map((item) => (
            <p
              key={item}
              className="rounded-2xl bg-white px-6 py-5 leading-relaxed text-black/70 ring-1 ring-black/5"
            >
              {item}
            </p>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Questions worth answering upfront
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Evidence FAQ
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <article
              key={item.question}
              className="rounded-3xl bg-paper p-6 ring-1 ring-black/5"
            >
              <h3 className="font-display text-2xl uppercase">{item.question}</h3>
              <p className="mt-4 text-black/70">{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/scope" variant="primary">
            See the plan to fix this
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds.

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/evidence | grep -o "Where Bicycle stands, and why"
curl -s http://localhost:4310/evidence | grep -o "Total Media"
kill %1
cd ..
```

Expected: both greps print a match.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "Add proposal site evidence page and audit charts"
git push
```

---

## Task 5: Build the scope pages (`/scope` and `/scope/get-listed`)

**Files:**
- Create: `proposal/src/app/scope/page.tsx`
- Create: `proposal/src/app/scope/get-listed/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `ButtonLink`, `SITE` from Tasks 2/3.
- Produces: nothing new — both are leaf pages.

The five AI-SEO workstreams and the get-listed checklist are carried over from `src/app/(site)/visibility/page.tsx` and `src/app/(site)/visibility/get-listed/page.tsx` on `main` — already written in future tense (what will be done), so they need no reframing beyond updated links and class names. The rebuild scope list below is new copy describing outcomes, deliberately not a "before vs after" comparison (that would reveal how much of the rebuild already exists).

- [ ] **Step 1: Write `proposal/src/app/scope/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Scope of work",
  description:
    "What's delivered in each workstream: the Next.js rebuild and the ongoing AI search visibility programme for Bicycle London.",
};

const rebuildScope = [
  {
    title: "A modern, fast foundation",
    detail:
      "A Next.js site on Vercel, replacing the current Wix build, with full control over rendering, caching and Core Web Vitals.",
  },
  {
    title: "An editorial workflow that scales",
    detail:
      "Sanity-managed content for case studies, careers and an articles hub, so new work and insight can be published on a steady cadence instead of waiting on a web team.",
  },
  {
    title: "Search and AI fundamentals, built in",
    detail:
      "Route-level metadata, a generated sitemap, Organisation/Article/JobPosting structured data, and explicit robots and llms.txt rules for AI crawlers.",
  },
  {
    title: "A protected migration",
    detail:
      "Every live URL mapped and 301-redirected where needed, so branded search equity carries across the move rather than resetting to zero.",
  },
  {
    title: "One domain, one authority signal",
    detail:
      "The separate careers subdomain folded into the main site, so link equity concentrates in one place instead of being split.",
  },
  {
    title: "Measurement from day one",
    detail:
      "Search Console, GA4 and rank tracking connected at launch, so every change ties back to impressions, clicks and enquiries.",
  },
];

const aiSeoScope = [
  {
    n: "01",
    title: "Get into the sources AI cites",
    detail:
      "Claim and optimise listings on Land of Independents, the Alliance of Independent Agencies, Clutch, Marketing Agency Index and The Drum, plus Crunchbase and a credible Wikipedia footprint. Enter the awards that feed those lists.",
  },
  {
    n: "02",
    title: "Build quotable, machine-readable content",
    detail:
      "A steady content cadence of data-led, answer-first points of view, five topic hubs, deeper case studies with results, and a clear agency-facts structure with full Organization schema an AI can extract.",
  },
  {
    n: "03",
    title: "Earn citations and coverage",
    detail:
      "Proactive PR and commentary into Campaign, The Drum and Prolific North around results, new business, hires and B Corp status, so there is a stream of third-party articles for the models to quote.",
  },
  {
    n: "04",
    title: "Fix the technical foundation",
    detail:
      "Ship the rebuild with the fundamentals in place: structured data, llms.txt and mapped redirects that protect the existing branded equity.",
  },
  {
    n: "05",
    title: "Measure what matters",
    detail:
      "Re-run this exact LLM-mention test every month across ChatGPT, Perplexity and Gemini, alongside Search Console, GA4, rank tracking and referring-domain growth, so progress is visible and tied to enquiries.",
  },
];

export default function ScopePage() {
  return (
    <>
      <PageHero
        eyebrow="Scope of work"
        title="What gets delivered"
        lead="Two workstreams: a rebuilt site with the fundamentals right, and a deliberate, measured push into the sources that get an agency recommended."
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Workstream one
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The rebuild
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {rebuildScope.map((item, i) => (
            <article
              key={item.title}
              className="rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-black/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Workstream two
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            AI search visibility
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            The rebuild is the foundation, not the finish line. Visibility comes
            from running these five workstreams together and measuring them every
            month.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {aiSeoScope.map((item) => (
            <article
              key={item.n}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-accent">{item.n}</span>
                <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-white/75">{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink href="/scope/get-listed" variant="white">
            Open the month-one checklist
          </ButtonLink>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-black/70">
            Full pricing for both workstreams is on the next page, and the phased
            build-out sits on the timeline after that.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/pricing" variant="primary">
              See pricing
            </ButtonLink>
            <ButtonLink href="/timeline" variant="outline">
              See the timeline
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Write `proposal/src/app/scope/get-listed/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Workstream two, month one: get listed where AI looks",
  description:
    "The month-one checklist for Bicycle London: the directories, registers, knowledge bases and awards that ChatGPT, Perplexity and Gemini cite, with verified links, priority, effort and the action for each.",
};

type Item = {
  n: string;
  title: string;
  url: string;
  kind: string;
  cost: string;
  effort: string;
  why: string;
  action: string;
  note?: string;
};

const tier1: Item[] = [
  {
    n: "01",
    title: "Land of Independents",
    url: "https://landofindependents.com",
    kind: "Independent-agency directory",
    cost: "Free to request",
    effort: "Low",
    why: "Cited directly by both ChatGPT and Perplexity, and it exists solely to list independent media agencies. Competitors like Republic of Media already have a profile here.",
    action:
      "Request a Bicycle London listing with the full agency description, the five service units, the Clerkenwell address and a link back to the site.",
    note: "Highest-priority single listing. It is specific to the exact query the client cares about.",
  },
  {
    n: "02",
    title: "Alliance of Independent Agencies",
    url: "https://allindependentagencies.org",
    kind: "Trade body and member directory",
    cost: "Paid membership",
    effort: "Medium",
    why: "Cited by Perplexity and Gemini. Members appear in the public directory, and membership is the gateway to the Alliance Awards used in workstream three.",
    action:
      "Apply for membership, then complete the member-directory profile at /member-agencies-directory/.",
    note: "One step unlocks both a cited directory listing and a route into the awards.",
  },
  {
    n: "03",
    title: "Clutch",
    url: "https://clutch.co",
    kind: "B2B reviews directory",
    cost: "Free profile",
    effort: "Medium",
    why: "Referenced by Gemini and ranks well in Google for agency queries. Profiles are ranked by verified client reviews.",
    action:
      "Create and verify the company profile, then ask three to five clients to leave a short review.",
    note: "Bicycle has no profile yet. The reviews are the real work and the thing that makes the listing count.",
  },
  {
    n: "04",
    title: "The Drum Recommends",
    url: "https://www.thedrum.com/profile",
    kind: "Ratings and reviews register",
    cost: "Free to start",
    effort: "Medium",
    why: "The Drum was cited across the assistants, including its Indie Agency 100. A Recommends profile builds a rated presence on a source the models already trust.",
    action: "Create the agency profile and collect client ratings.",
    note: "Pairs with the Indie Agency 100 entry in workstream three.",
  },
  {
    n: "05",
    title: "Marketing Agency Index",
    url: "https://www.marketingagencyindex.com/uk/ownership-model/independent",
    kind: "Curated independent index",
    cost: "Free to request",
    effort: "Low",
    why: "Cited by ChatGPT as a source of independent UK agencies. Bicycle is not in the independent list today.",
    action: "Request inclusion in the independent UK agencies index.",
  },
];

const tier2: Item[] = [
  {
    n: "06",
    title: "Crunchbase",
    url: "https://www.crunchbase.com",
    kind: "Company knowledge base",
    cost: "Free",
    effort: "Low",
    why: "A core structured source the models read for company facts: founding, location, leadership and category. Bicycle has no profile.",
    action:
      "Create the organisation profile: founded 2021, HQ in Clerkenwell, the service units, B Corp status and the leadership team.",
  },
  {
    n: "07",
    title: "B Corp directory",
    url: "https://bcorporation.eu/find-a-b-corp/",
    kind: "Certification directory",
    cost: "Free (with certification)",
    effort: "Low",
    why: "The site states Bicycle is a B Corp, and the directory is a trusted source the models and journalists draw on.",
    action:
      "Confirm the certification is current and the public directory listing is complete, on-message and links back to the site.",
    note: "Verify the certification status first, then optimise the entry.",
  },
  {
    n: "08",
    title: "Google Business Profile",
    url: "https://www.google.com/business/",
    kind: "Entity and local presence",
    cost: "Free",
    effort: "Low",
    why: "Feeds Google's knowledge panel and AI Overviews, and confirms the agency as a real, located entity.",
    action:
      "Claim and complete the profile: category Advertising agency, the Clerkenwell address, hours, services and photos.",
  },
  {
    n: "09",
    title: "LinkedIn company page",
    url: "https://www.linkedin.com/company/bicyclelondon/",
    kind: "Company knowledge source",
    cost: "Free",
    effort: "Low",
    why: "A primary source the assistants read for who a company is. The page already exists, so this is optimisation, not creation.",
    action:
      "Complete the About, specialties, website, location and tagline so they match the site word for word.",
  },
  {
    n: "10",
    title: "Wikidata",
    url: "https://www.wikidata.org",
    kind: "Open knowledge graph",
    cost: "Free",
    effort: "Medium",
    why: "Feeds the knowledge graphs behind search and the assistants. A clean, sourced entry helps the models recognise Bicycle as a defined entity.",
    action:
      "Create a Wikidata item with verified facts. Consider Wikipedia only once there is enough independent press to support notability.",
    note: "Wikipedia depends on the coverage earned in workstream three, so treat it as a later step.",
  },
];

const tier3: Item[] = [
  {
    n: "11",
    title: "Alliance of Independent Agencies Awards",
    url: "https://allindependentagencies.org",
    kind: "Industry awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "The Indies are a citation source in their own right, and award wins are exactly what the assistants quoted for competitors.",
    action: "Plan entries for the next cycle once membership is in place.",
  },
  {
    n: "12",
    title: "The Drum Indie Agency 100 and Drum Awards",
    url: "https://www.thedrum.com/indie-agencies",
    kind: "Ranking and awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "The Indie Agency 100 was cited by Perplexity by name. Inclusion puts Bicycle on a list the models read.",
    action: "Submit for the Indie Agency 100 and the relevant Drum Awards categories.",
  },
  {
    n: "13",
    title: "Campaign and the Media Week Awards",
    url: "https://www.campaignlive.co.uk",
    kind: "Trade press and awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "Campaign's independent rankings were cited by ChatGPT. Campaign coverage and award entries feed both Google and the assistants.",
    action:
      "Get on Campaign's radar with results-led stories and enter the relevant Media Week Awards categories.",
  },
];

const alsoWorth = [
  { label: "Sortlist", url: "https://www.sortlist.co.uk" },
  { label: "DesignRush", url: "https://www.designrush.com" },
  { label: "GoodFirms", url: "https://www.goodfirms.co" },
  { label: "The Manifest", url: "https://themanifest.com" },
];

function ItemCard({ item }: { item: Item }) {
  return (
    <article className="rounded-3xl bg-white p-7 ring-1 ring-black/5">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl text-primary">{item.n}</span>
        <h3 className="font-display text-2xl uppercase">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
          >
            {item.title}
          </a>
        </h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          {item.kind}
        </span>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          {item.cost}
        </span>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          Effort: {item.effort}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-black/65">
        <span className="font-semibold text-ink">Why it matters. </span>
        {item.why}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-black/65">
        <span className="font-semibold text-ink">Action. </span>
        {item.action}
      </p>
      {item.note && (
        <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm leading-relaxed text-black/60">
          {item.note}
        </p>
      )}
    </article>
  );
}

export default function GetListedPage() {
  return (
    <>
      <PageHero
        eyebrow="Workstream two, month one"
        title="Get listed where AI looks"
        lead="AI assistants build their recommendations from a small set of trusted sources. This is the ordered checklist for getting Bicycle into them, with a verified link, the priority, the effort and the action for each."
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-black/70">
            The evidence audit showed that competitors get recommended because
            they are present in the directories, registers and award lists the
            assistants cite, and Bicycle is not. Most of these can be done in the
            first month, and most are free. I would work them in the order below.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl bg-ink p-8 text-white md:grid-cols-[auto_1fr]">
          <span className="font-display text-5xl leading-none text-accent sm:text-6xl">
            !
          </span>
          <p className="leading-relaxed text-white/80">
            One rule runs through all of this: keep the facts identical
            everywhere. Same agency name, founding year, Clerkenwell address,
            service units, B Corp status and one-line description on every
            listing. The assistants triangulate facts across sources, so
            consistency is what makes them trust the entry. A different address
            or description on each site quietly works against the whole effort.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Priority one
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The directories the assistants cited
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These five were named or cited directly in the live AI answers. They
            are the fastest route to appearing in the same recommendations as the
            competitors.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier1.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Priority two
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The knowledge sources AI reads for facts
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These do not always show up as citations, but they are where the
            assistants learn who Bicycle is. Getting the facts right here improves
            every answer.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier2.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Priority three
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Awards and rankings to start now
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These take longer to pay off because they run on entry cycles, so the
            work starts this month even though the wins land later.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier3.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Also worth a profile
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
              Quick wins to mop up
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-black/70">
              Lower priority than the cited sources, but each is a free, indexed
              profile that adds another consistent reference to the agency. Worth
              an afternoon once the priority listings are in.
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            {alsoWorth.map((d) => (
              <a
                key={d.label}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-primary px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {d.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            How to know it is working
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Measure it the same way it was found
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            At the end of the month, I would re-run the exact test from the audit:
            ask ChatGPT, Perplexity and Gemini to recommend an independent UK
            media agency, and record whether Bicycle now appears and which of
            these new listings they cite. That turns the checklist into a
            tracked, repeatable measure rather than a one-off task.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/scope" variant="primary">
              Back to the scope
            </ButtonLink>
            <ButtonLink href={`mailto:${SITE.contactEmail}`} variant="white">
              Talk through the plan
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 3: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds with `/scope` and `/scope/get-listed` routes.

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/scope | grep -o "What gets delivered"
curl -s http://localhost:4310/scope/get-listed | grep -o "Land of Independents"
kill %1
cd ..
```

Expected: both greps print a match.

- [ ] **Step 4: Commit and push**

```bash
git add -A
git commit -m "Add proposal site scope and get-listed pages"
git push
```

---

## Task 6: Build the timeline page (`/timeline`)

**Files:**
- Create: `proposal/src/app/timeline/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `ButtonLink`, `SITE` from Tasks 2/3.
- Produces: nothing new — leaf page.

Timeline windows are reframed as weeks-from-kickoff (not tied to real dates), carried over from the `timeline` array in `src/app/(site)/visibility/page.tsx` on `main`.

- [ ] **Step 1: Write `proposal/src/app/timeline/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "The phased plan for the rebuild and the AI search visibility workstream, from kickoff to six months in.",
};

const timeline = [
  {
    window: "Weeks 1 to 4",
    focus: "Foundations",
    detail:
      "Deliver the rebuild, ship metadata, schema and llms.txt, baseline today's rankings and AI mentions, and claim the priority directory listings.",
  },
  {
    window: "Weeks 4 to 12",
    focus: "Authority",
    detail:
      "Publish the first topic hubs and answer-first articles, submit award entries, begin PR outreach, and consolidate the careers subdomain.",
  },
  {
    window: "Weeks 12 to 26",
    focus: "Compounding",
    detail:
      "Hold a steady content and PR cadence, watch AI mentions and non-branded rankings rise, and double down on the topics that turn into enquiries.",
  },
];

export default function TimelinePage() {
  return (
    <>
      <PageHero
        eyebrow="The first six months"
        title="How it phases"
        lead="From kickoff to a measurable shift in how Bicycle shows up in Google and in AI assistants."
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {timeline.map((item) => (
            <article
              key={item.window}
              className="rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                {item.window}
              </span>
              <h3 className="mt-3 font-display text-3xl uppercase">
                {item.focus}
              </h3>
              <p className="mt-4 leading-relaxed text-black/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            The goal
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Within six months, when someone asks an AI assistant for an
            independent UK media agency, Bicycle should be in the answer,
            sitting alongside the names it already competes with for real
            pitches. The monthly mention test is how that progress gets proven.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/pricing" variant="primary">
              See pricing
            </ButtonLink>
            <ButtonLink href={`mailto:${SITE.contactEmail}`} variant="white">
              Talk through the plan
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds with a `/timeline` route.

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/timeline | grep -o "How it phases"
kill %1
cd ..
```

Expected: prints a match.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "Add proposal site timeline page"
git push
```

---

## Task 7: Build the pricing page (`/pricing`)

**Files:**
- Create: `proposal/src/app/pricing/page.tsx`

**Interfaces:**
- Consumes: `PageHero`, `Section`, `ButtonLink`, `SITE` from Tasks 2/3.
- Produces: nothing new — leaf page.

Pricing figures are the agreed placeholders (£8,000–£12,000 fixed, £1,200/month retainer) as plain top-level constants so Matt can find and edit them in one place before sending. Payment terms (50/50 split, three-month retainer minimum) are reasonable defaults — flag them for Matt to confirm/adjust in the same pass as the headline figures.

- [ ] **Step 1: Write `proposal/src/app/pricing/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Fixed fee for the rebuild and a monthly retainer for the AI search visibility workstream.",
};

// Placeholder figures agreed as a starting anchor — adjust before sending.
const REBUILD_FEE = "£8,000–£12,000";
const RETAINER_FEE = "£1,200";

const rebuildIncludes = [
  "Full Next.js/Sanity rebuild of the current site",
  "Every live URL mapped and redirected",
  "Structured data, metadata and llms.txt across every template",
  "Careers content consolidated onto the main domain",
  "Search Console, GA4 and rank tracking connected at launch",
];

const retainerIncludes = [
  "Directory, registry and knowledge-base listings (workstream two)",
  "A steady content cadence: topic hubs and answer-first articles",
  "Award entries and trade-press outreach",
  "The monthly AI-mention test across ChatGPT, Perplexity and Gemini",
  "A monthly report tying the numbers back to enquiries",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="What this costs"
        lead="A fixed fee to deliver the rebuild, and a monthly retainer to run the AI visibility workstream once it's live."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-paper p-8 ring-1 ring-black/5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Workstream one, fixed fee
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase">The rebuild</h2>
            <p className="mt-4 font-display text-5xl">{REBUILD_FEE}</p>
            <p className="mt-2 text-sm text-black/55">
              One-off. Final figure confirmed once scope is locked at kickoff.
            </p>
            <ul className="mt-6 space-y-3 text-black/70">
              {rebuildIncludes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-black/55">
              Payment: 50% on kickoff, 50% on go-live.
            </p>
          </article>

          <article className="rounded-3xl bg-ink p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Workstream two, monthly retainer
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase">
              AI search visibility
            </h2>
            <p className="mt-4 font-display text-5xl">
              {RETAINER_FEE}
              <span className="text-2xl">/month</span>
            </p>
            <p className="mt-2 text-sm text-white/60">
              Ongoing. Three-month minimum, then rolling monthly.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              {retainerIncludes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-accent">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/60">
              Billed monthly in advance. Starts once the rebuild is live.
            </p>
          </article>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Next steps
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Ready to go ahead?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            Reply to confirm, or send over any questions, and I&apos;ll get the
            rebuild scoped and underway.
          </p>
          <div className="mt-8">
            <ButtonLink
              href={`mailto:${SITE.contactEmail}?subject=Bicycle%20proposal`}
              variant="primary"
            >
              Email {SITE.contactEmail}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
cd proposal && npm run build
```

Expected: build succeeds with a `/pricing` route.

```bash
npm run start -- -p 4310 &
sleep 2
curl -s http://localhost:4310/pricing | grep -o "What this costs"
kill %1
cd ..
```

Expected: prints a match.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "Add proposal site pricing page"
git push
```

---

## Task 8: Full-site verification pass on the `proposal` branch

**Files:** none (verification only).

**Interfaces:** none — this task only exercises what Tasks 1–7 produced.

- [ ] **Step 1: Full production build**

```bash
cd proposal && npm run build
```

Expected: build succeeds with all six routes listed in the route summary: `/`, `/evidence`, `/scope`, `/scope/get-listed`, `/timeline`, `/pricing`, plus `/robots.txt`.

- [ ] **Step 2: Smoke-test every route and the content-honesty constraint**

```bash
npm run start -- -p 4310 &
sleep 2
for path in "/" "/evidence" "/scope" "/scope/get-listed" "/timeline" "/pricing"; do
  echo "== $path =="
  curl -s "http://localhost:4310$path" | grep -o 'name="robots" content="[^"]*"'
done
# Content-honesty check: none of these should ever appear on the proposal site.
curl -s http://localhost:4310/ http://localhost:4310/evidence http://localhost:4310/scope \
     http://localhost:4310/timeline http://localhost:4310/pricing \
  | grep -iE "already (built|done|live)|mostly complete|bicyclelondon\.vercel\.app" \
  && echo "FAIL: found a rebuild-progress reveal" || echo "PASS: no rebuild-progress reveal found"
kill %1
cd ..
```

Expected: every route prints the `noindex, nofollow` robots meta tag, and the content-honesty check prints `PASS: no rebuild-progress reveal found`.

- [ ] **Step 3: Manual nav check**

Run `cd proposal && npm run dev`, open `http://localhost:3000`, and click through Overview → Evidence → Scope → (Open the month-one checklist) → Pricing → Timeline, confirming: the Boostkit purple/blue palette renders (not Bicycle's navy/green), every nav link works, the mailto links open with `matt@boostkit.io` pre-filled, and nothing links to or mentions the in-progress rebuild. Stop the dev server when done.

- [ ] **Step 4: Push (no new commit expected — this task only verifies)**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (all work was already committed and pushed in Tasks 1–7). If anything is uncommitted (e.g. a fix made during manual QA), commit and push it now:

```bash
git add -A
git commit -m "Fix issues found in proposal site QA pass"
git push
```

---

## Task 9: Clean up `main` — remove the pitch/evidence pages from the real rebuild

**Files:**
- Delete: `src/app/(site)/comparison/page.tsx`
- Delete: `src/app/(site)/visibility/page.tsx`
- Delete: `src/app/(site)/visibility/get-listed/page.tsx`
- Delete: `src/components/charts/audit-charts.tsx` (orphaned — only ever imported by `visibility/page.tsx`)
- Modify: `src/app/sitemap.ts` (remove the three now-deleted paths)

**Interfaces:** none — this is a deletion-only task on `main`, unrelated to the `proposal` branch's files.

This task runs on `main`, not on the `proposal` branch. Switch back first.

- [ ] **Step 1: Switch to `main` and confirm it's up to date**

```bash
git checkout main
git pull
```

Expected: `Already up to date.` (or fast-forwards cleanly).

- [ ] **Step 2: Delete the three pitch pages and the orphaned chart component**

```bash
git rm -r "src/app/(site)/comparison" "src/app/(site)/visibility" src/components/charts/audit-charts.tsx
```

Expected: `git rm` lists the deleted files including `page.tsx` under each directory.

- [ ] **Step 3: Remove their entries from `src/app/sitemap.ts`**

In `src/app/sitemap.ts`, remove these three lines from the `staticPaths` array:

```ts
    "/comparison",
    "/visibility",
    "/visibility/get-listed",
```

so the array reads:

```ts
  const staticPaths = [
    "",
    "/about",
    "/purpose",
    "/the-peloton",
    "/contact-us",
    "/work",
    "/slipstream",
    "/careers",
    "/bicycle",
    "/bicycle-blade",
    "/bicycle-studio",
    "/bicycle-ripple",
    "/international",
    "/privacy-policy",
    "/cookie-policy",
    "/modern-slavery",
  ];
```

- [ ] **Step 4: Confirm nothing else references the removed routes or component**

```bash
grep -rn "comparison\|visibility\|audit-charts" src --include="*.tsx" --include="*.ts"
```

Expected: no matches (confirms no dangling imports or links remain).

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: build succeeds with no reference errors, and the route summary no longer lists `/comparison`, `/visibility`, or `/visibility/get-listed`.

- [ ] **Step 6: Commit and push**

```bash
git add -A
git commit -m "Remove pitch/evidence pages from the rebuild (moved to the proposal site)"
git push
git status
```

Expected: `Your branch is up to date with 'origin/main'.`

---

## Task 10: Create the `bicycleproposal` Vercel project and verify the live deployment

**Files:** none — this is Vercel project configuration, not a code change.

**Interfaces:** none.

This task creates a new cloud resource (a Vercel project) and links it to the same GitHub repo used by the existing `bicyclelondon` project. Confirm with Matt before running Step 2 if there's any doubt about the project name or which Vercel team it should land in — this is a visible, shared-state action, not a local one.

- [ ] **Step 1: Confirm the `proposal` branch is pushed**

```bash
git checkout proposal
git status
git log origin/proposal -1 --oneline
```

Expected: `Your branch is up to date with 'origin/proposal'.` and the log shows the last commit from Task 8/9.

- [ ] **Step 2: Create the Vercel project**

From the repo root:

```bash
cd proposal
vercel link --yes --project bicycleproposal
```

If `bicycleproposal` is already taken under the team, pick an available variant (e.g. `bicycle-proposal`) and note that the resulting default domain will differ (`<project-name>.vercel.app`) — confirm the actual assigned domain in Step 5 rather than assuming it matches the name requested. If this exact flag combination doesn't match the installed Vercel CLI version, run `vercel link --help` (or `vercel project add --help`) and adapt — the intent is: create a new project named `bicycleproposal` (or the nearest available name) linked to this repo, with its root set to the `proposal/` directory.

Expected: Vercel CLI creates/links a new project and writes `proposal/.vercel/project.json`.

- [ ] **Step 3: Set the production branch and confirm root directory**

In the Vercel dashboard for the new project (Settings → Git), set:
- **Production Branch:** `proposal`
- **Root Directory:** should already be correct since the project was created by running `vercel link` from inside `proposal/`; confirm it reads `proposal` (relative to the repo root), not blank/`.`.

- [ ] **Step 4: Trigger the first deployment**

```bash
vercel --prod
cd ..
```

Expected: CLI prints a production deployment URL ending in `.vercel.app`.

- [ ] **Step 5: Verify the live deployment**

```bash
curl -sI https://bicycleproposal.vercel.app/ | head -5
curl -s https://bicycleproposal.vercel.app/ | grep -o "Two workstreams, one plan"
curl -s https://bicycleproposal.vercel.app/robots.txt
```

Expected: a `200`/`x-vercel-id` response header, the home page headline text, and `Disallow: /` in `robots.txt`. If the assigned domain differs from `bicycleproposal.vercel.app` (see Step 2's note), substitute the actual domain shown by the CLI/dashboard in all three checks.

- [ ] **Step 6: Confirm the existing `bicyclelondon` Vercel project is untouched**

```bash
vercel project ls
```

Expected: both `bicyclelondon` (tracking `main`) and the new proposal project (tracking `proposal`) are listed as separate projects, and `bicyclelondon`'s settings are unchanged.

- [ ] **Step 7: Report the URL**

Tell Matt the live proposal URL and remind him to adjust the placeholder pricing figures (`proposal/src/app/pricing/page.tsx`) before sending it to Bicycle.

