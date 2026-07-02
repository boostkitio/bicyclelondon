# Plan 004: Canonical URLs, working noIndex/ogImage controls, and entity-schema gaps

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/app src/lib/site.ts src/sanity/lib public/llms.txt`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P1
- **Effort**: M (many small edits, one pattern)
- **Risk**: Low
- **Depends on**: none
- **Category**: seo
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

This rebuild exists partly to fix Bicycle's search and AI-assistant
visibility (see `docs/llm-visibility-roadmap.md`), and the design spec lists
canonicals as a shipped deliverable, but no page sets a canonical URL, every
page inherits `og:url` pointing at the homepage, two Sanity SEO controls
(`noIndex`, `ogImage`) are silently ignored by the frontend, the Organization
schema is missing the `logo` and `alternateName` the roadmap explicitly calls
out, `robots.txt` emits a malformed `Host` line, and `llms.txt` links to a
removed page. All are small, mechanical fixes with outsized effect for a
media agency whose product is being findable.

## Current state

- `src/app/layout.tsx:14-28` - root metadata sets `metadataBase: new URL(SITE.url)`
  and `openGraph: { type: "website", siteName: "Bicycle London", locale: "en_GB", url: SITE.url }`.
  The `url: SITE.url` line makes every page that does not override
  `openGraph` claim the homepage as its og:url. No `alternates` anywhere in
  the repo (verified by grep).
- `SITE.url` is `process.env.NEXT_PUBLIC_SITE_URL || "https://www.bicyclelondon.com"`
  (`src/lib/site.ts:6`). The www host matches the live site; do not change it.
- Static pages each export `metadata` (for example
  `src/app/(site)/careers/page.tsx:60-64`); dynamic routes use
  `generateMetadata`:
  - `src/app/(site)/slipstream/[slug]/page.tsx:27-47` - reads
    `a.seo?.metaTitle` / `a.seo?.metaDescription`, builds OG image from
    `a.heroImage`. Ignores `a.seo?.noIndex` and `a.seo?.ogImage`.
  - `src/app/(site)/work/[slug]/page.tsx:30-49` - same pattern.
  - `src/app/(site)/careers/[slug]/page.tsx:25-40` - same pattern, no OG
    image at all.
- The Sanity `seo` object defines both controls
  (`src/sanity/schemaTypes/seo.ts:25,31`) and the TS type has them
  (`src/sanity/lib/types.ts:10-11`: `ogImage?: SanityImage; noIndex?: boolean`).
- Image URL helper: `urlFor(image).width(1200).height(630).url()` from
  `src/sanity/lib/image.ts` (see its use at
  `src/app/(site)/slipstream/[slug]/page.tsx:34-36`).
- Organization schema at `src/app/(site)/layout.tsx:7-29`: has name, url,
  description, email, telephone, foundingDate, address, sameAs. Missing
  `logo` and `alternateName`.
- `src/app/robots.ts:32` - `host: SITE.url` emits
  `Host: https://www.bicyclelondon.com`; the directive expects a bare
  hostname.
- `public/llms.txt:14` - links `https://www.bicyclelondon.com/comparison`,
  a page removed in commit `7e6ed1f` (no `/comparison` route exists).
- AGENTS.md warns this Next.js version differs from older conventions:
  read `node_modules/next/dist/docs/` for the Metadata API before coding.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Serve     | `npm run start`     | serves on :3000     |
| Tests     | `npm test`          | all pass (if plan 001 landed) |

## Suggested executor toolkit

- Read the Metadata API guide in `node_modules/next/dist/docs/` first,
  specifically how `alternates.canonical` and `openGraph.url` resolve
  against `metadataBase`, and how nested metadata objects merge (they
  replace, not deep-merge, per object key).

## Scope

**In scope**:
- `src/app/layout.tsx`
- Every page file under `src/app/(site)/` (adding `alternates.canonical`
  and, on dynamic routes, `robots`/`ogImage` handling)
- `src/app/(site)/layout.tsx` (Organization schema)
- `src/app/robots.ts`
- `public/llms.txt`

**Out of scope**:
- `src/lib/site.ts` (the www canonical host is a deliberate pre-cutover
  choice; flipping to apex is a separate go-live decision)
- `src/middleware.ts`, `src/app/sitemap.ts`
- Sanity schema files (both fields already exist)
- JobPosting-specific schema fixes (plan 005 owns those)

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Add canonical URLs and wire up the Sanity noIndex and ogImage controls`.

## Steps

### Step 1: Root layout og:url

In `src/app/layout.tsx`, delete the `url: SITE.url,` line from the
`openGraph` object (keep `type`, `siteName`, `locale`). Per-page og:url then
derives from each page's canonical/metadataBase instead of asserting the
homepage everywhere.

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 2: Canonicals on static pages

For every static page under `src/app/(site)/` that exports `metadata`, add
`alternates: { canonical: "<path>" }` with the page's own path. Relative
paths resolve against `metadataBase`. Full list (path = route):

`/` (page.tsx), `/about`, `/purpose`, `/the-peloton`, `/contact-us`, `/work`,
`/slipstream`, `/careers`, `/careers/benefits`, `/careers/values`,
`/careers/diversity`, `/careers/team/mark-pavlika`,
`/careers/team/valeria-perticucci`, `/bicycle`, `/bicycle-blade`,
`/bicycle-studio`, `/bicycle-ripple`, `/international`, `/privacy-policy`,
`/cookie-policy`, `/modern-slavery`.

The homepage (`src/app/(site)/page.tsx`) currently exports no `metadata`
object of its own; add one containing only `alternates: { canonical: "/" }`
so the root-layout defaults still apply.

Note: the service pages (`/bicycle*`, `/international`) may build their
metadata via a shared helper or `src/content/services.ts`; if a single
component generates them, add the canonical there once, keyed by the page's
path, rather than editing five files.

**Verify**: `npm run build && npm run start`, then
`curl -s http://localhost:3000/about | grep -o '<link rel="canonical"[^>]*>'`
-> one tag ending `/about"`. Spot-check `/careers/benefits` and `/bicycle`
the same way.

### Step 3: Canonicals, noIndex, and ogImage on the three dynamic routes

In each of `slipstream/[slug]/page.tsx`, `work/[slug]/page.tsx`,
`careers/[slug]/page.tsx`, inside `generateMetadata`, extend the returned
object with this pattern (shown for articles; adapt paths/types):

```ts
const og = a.seo?.ogImage?.asset
  ? urlFor(a.seo.ogImage).width(1200).height(630).url()
  : img; // img = existing heroImage-derived URL
return {
  title: ...,
  description: ...,
  alternates: { canonical: `/slipstream/${a.slug}` },
  ...(a.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  openGraph: { ...existing, url: `/slipstream/${a.slug}`, images: og ? [og] : undefined },
};
```

For `careers/[slug]`, which currently returns no `openGraph`, add
`alternates` and the `robots` conditional only (job OG images are optional;
add `seo.ogImage` support if trivial).

**Verify**: `npx tsc --noEmit` -> exit 0; `npm run build` -> exit 0.

### Step 4: Organization schema logo and alternateName

In `src/app/(site)/layout.tsx`, add to `organisationSchema`:

- `alternateName: "Bicycle"`.
- `logo: \`${SITE.url}<logo-path>\`` where `<logo-path>` is an existing file
  under `public/images/`. List the candidates
  (`ls public/images | grep -i logo`) and choose a mark that is legible on a
  white background; if only white-on-transparent marks exist, note that in
  the commit and use the most complete mark available.

Do not add `award` entries in this plan: the award strings on the careers
page are unverified as schema claims; the operator should confirm exact
titles/years first (recorded in Maintenance notes).

**Verify**: `curl -s http://localhost:3000/ | grep -o '"alternateName":"Bicycle"'`
-> match (after rebuild + start).

### Step 5: robots host

In `src/app/robots.ts`, change `host: SITE.url` to
`host: new URL(SITE.url).host`.

**Verify**: after rebuild, `curl -s http://localhost:3000/robots.txt` shows
`Host: www.bicyclelondon.com` (no scheme) and still shows the sitemap line
and the `/studio` + `/api/` disallows.

### Step 6: llms.txt

In `public/llms.txt`: remove the `/comparison` line (line 14 at planning
time), check every other listed URL corresponds to an existing route under
`src/app/(site)/`, and update the `Last updated:` date to today (verify the
date with a shell `date` command; do not guess it).

**Verify**: `git grep -n "comparison" -- public/llms.txt` -> no matches.

## Test plan

- If plan 001 landed, no new unit tests are required (this is metadata
  wiring); rely on the curl checks above.
- Manual: after deploy, run one slipstream URL through a structured-data/
  metadata checker of choice and confirm canonical + og:url point at the
  article, not the homepage.

## Done criteria

- [ ] `git grep -rn "alternates" -- src/app | wc -l` >= 20 (every page)
- [ ] `git grep -n "url: SITE.url" -- src/app/layout.tsx` -> no match
- [ ] `git grep -n "noIndex" -- src/app` -> at least 3 matches (the three
      dynamic routes)
- [ ] Curl checks in steps 2, 4, 5 pass
- [ ] `npm run build` exits 0; `npm test` passes if present
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The Next.js docs in `node_modules/next/dist/docs/` show that
  `alternates.canonical` or `openGraph.url` no longer resolve relative paths
  against `metadataBase` (the pattern above then needs absolute URLs
  instead; do not mix the two styles).
- The service pages' metadata turns out to be generated somewhere that
  would require touching out-of-scope files.
- Removing the root `openGraph.url` visibly breaks OG tags on any page
  (check with curl before and after).

## Maintenance notes

- New pages must ship with `alternates.canonical`; add it to any page
  template used for future routes.
- At domain cutover, whichever host is chosen (www vs apex) must agree
  across `NEXT_PUBLIC_SITE_URL`, the canonical tags, the sitemap, robots,
  and the redirect direction. The canonicals added here follow `SITE.url`,
  so only the env var needs to change.
- Deferred: `award` entries in the Organization schema, pending operator
  confirmation of exact award names and years (source strings at
  `src/app/(site)/careers/page.tsx:66`).
- Deferred: generating `llms.txt` from a route so it cannot drift; worth
  doing if it drifts again.
