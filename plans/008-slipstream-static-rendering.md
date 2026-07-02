# Plan 008: Serve the Slipstream index statically (move category filtering client-side)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- "src/app/(site)/slipstream/page.tsx"`
> If the file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch,
> treat it as a stop condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: Low
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

The blog index reads `searchParams` in the server component, which opts the
entire route into per-request dynamic rendering. Every visit and every
category-chip click becomes a serverless render with full TTFB, even though
the article data itself is already ISR-cached and the filter is a simple
in-memory match. Moving the filter client-side lets the route be built
statically and served from the CDN, while keeping `?category=` URLs working
(shareable and back/forward-safe).

## Current state

- `src/app/(site)/slipstream/page.tsx:22-41`:
  ```tsx
  type Props = { searchParams: Promise<{ category?: string }> };

  export default async function SlipstreamPage({ searchParams }: Props) {
    const { category } = await searchParams;
    const articles = await sanityFetch<ArticleCard[]>({
      query: allArticlesQuery,
      tags: ["slipstreamArticle"],
    });

    const categories = Array.from(
      new Map(
        articles
          .filter((a) => a.category && a.categorySlug)
          .map((a) => [a.categorySlug, a.category as string]),
      ).entries(),
    );

    const filtered = category
      ? articles.filter((a) => a.categorySlug === category)
      : articles;
  ```
  Below that, the page renders a `JsonLd` collection schema, category chip
  links (`/slipstream?category=...`), and the filtered article grid, with
  each card wrapped in the `Reveal` component.
- All data comes from one cached fetch; the only per-request work is the
  filter and chip highlighting.
- Repo conventions: client components live in `src/components/` with
  `"use client"`; pages stay server components where possible. The site
  already uses `useSearchParams`-free patterns elsewhere; scroll state
  and pathname come from `next/navigation` hooks in client components
  (see `src/components/site-header.tsx`).

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0; see step 3 for the route-table check |

## Suggested executor toolkit

- Read the `useSearchParams` page in `node_modules/next/dist/docs/` first:
  a client component calling it must sit inside a `<Suspense>` boundary for
  the route to remain statically renderable, and the docs state the current
  rules for this Next version.

## Scope

**In scope**:
- `src/app/(site)/slipstream/page.tsx`
- `src/components/slipstream-grid.tsx` (create; name/location per repo
  convention)

**Out of scope**:
- `src/app/(site)/slipstream/[slug]/page.tsx` (article pages, already static)
- `src/sanity/lib/queries.ts` (the fetch stays as is)
- The `Reveal` component and card markup (reuse, don't restyle)
- URL shape: `?category=` links must keep working; do not switch to hash or
  path segments in this plan.

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Serve the Slipstream index statically with client-side category filtering`.

## Steps

### Step 1: Extract a client grid component

Create `src/components/slipstream-grid.tsx` (`"use client"`). Props: the
full `articles: ArticleCard[]` and the derived
`categories: [string, string][]`. Inside it:

- `const category = useSearchParams().get("category")` (import from
  `next/navigation`).
- Compute `filtered` exactly as the page does today.
- Render the category chips and the article grid by moving that JSX from the
  page into this component unchanged (chips stay `<Link href>` to
  `/slipstream?category=...`; add `scroll={false}` to chip links so
  filtering doesn't jump to top).

### Step 2: Slim the page

`src/app/(site)/slipstream/page.tsx` stops reading `searchParams` entirely:
remove the `Props` type usage for it and the `await searchParams` line. The
page keeps the fetch, the `categories` derivation, the `JsonLd`, the page
hero/heading, and renders:

```tsx
<Suspense fallback={null}>
  <SlipstreamGrid articles={articles} categories={categories} />
</Suspense>
```

(`Suspense` from `react`.) The JSON-LD collection schema must keep listing
all articles, not the filtered set, exactly as today.

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 3: Confirm the route went static

`npm run build` and read the route table. `/slipstream` must no longer be
marked as dynamic (server-rendered on demand); it should build as static or
ISR-revalidated, matching `/work` and `/about`. The build output legend
names the symbols; compare against `/work` which has the target rendering
mode.

**Verify**: build table shows `/slipstream` with the same rendering mode as
`/work`.

### Step 4: Behaviour check

`npm run start`, then:
- `/slipstream` shows all articles.
- Clicking a category chip updates the URL to `?category=...`, filters the
  grid instantly, and does not full-page reload.
- Opening `/slipstream?category=<existing-slug>` directly (hard load) shows
  the filtered grid after hydration.
- An unknown category (`?category=does-not-exist`) shows an empty grid, not
  an error; if today's behaviour differs, match today's behaviour.

**Verify**: all four checks pass.

## Test plan

- No unit tests (rendering-mode change). The build-table check in step 3 is
  the machine-checkable regression gate; note the route table line in the
  commit message.

## Done criteria

- [ ] `git grep -n "searchParams" -- "src/app/(site)/slipstream/page.tsx"` -> no matches
- [ ] Build route table shows `/slipstream` non-dynamic (step 3)
- [ ] Behaviour checks in step 4 pass
- [ ] `npm run build` exits 0; no files outside the in-scope list modified
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The Next docs (see toolkit) reveal `useSearchParams` inside `Suspense`
  still forces this route dynamic in this Next version: report before
  trying alternative APIs.
- The route remains dynamic after step 2 and the cause is not this page
  (something else in the tree, for example a layout, reads dynamic APIs):
  identify and report, don't fix out-of-scope files.

## Maintenance notes

- If category archive pages are ever wanted for SEO (crawlable
  `/slipstream/category/x` URLs with their own metadata), that supersedes
  this client-side filter; today's chips are UX sugar, and search engines
  index the unfiltered hub.
- Adding future filters (author, search) should extend the client grid, not
  reintroduce server `searchParams`.
