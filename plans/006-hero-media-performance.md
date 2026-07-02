# Plan 006: Defer the Mux player and optimise the hero poster (LCP page weight)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/components/mux-bg.tsx src/components/mux-video.tsx src/components/page/page-hero.tsx "src/app/(site)/page.tsx"`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: Med (the hero film is the brand centrepiece; visual QA required)
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

The homepage hero background loads `@mux/mux-player-react` eagerly: the
player plus its HLS engine (on the order of tens of KB gzipped, plus runtime
cost) ships in the homepage's first client bundle for a decorative muted
loop, and the poster behind it is an unoptimised 128KB JPEG served raw. The
homepage is the site's most visited, most SEO-critical page, and its LCP is
exactly this poster. Service pages also mount up to three players at once in
the "films" grid. Deferring the player until it is near the viewport and
serving the poster through the image optimizer cuts first-load JS and LCP
weight with no visual change.

## Current state

- `src/components/mux-bg.tsx` - client component, static import:
  ```tsx
  import MuxPlayer from "@mux/mux-player-react";
  ...
  <MuxPlayer streamType="on-demand" playbackId={playbackId} autoPlay="muted"
    loop muted preload="auto" nohotkeys poster={poster}
    envKey={process.env.NEXT_PUBLIC_MUX_ENV_KEY}
    style={{ position: "absolute", inset: 0, ... }} />
  ```
  The `poster` prop is passed to the player element raw (no next/image).
- `src/app/(site)/page.tsx:42-47` - homepage hero:
  ```tsx
  <div className="absolute inset-0 opacity-90">
    <MuxBg playbackId="gfa01575PqXznaj7ADl84pYVnD6SkVZdwKRwg83regoQ"
           poster="/images/hero.jpg" />
  </div>
  ```
  `public/images/hero.jpg` is 128,702 bytes.
- `src/components/page/page-hero.tsx:24-30` - same `MuxBg` + `poster={image}`
  pattern for any page hero with `videoPlaybackId`; its image-only branch
  (lines 31-43) already uses `next/image` with `fill priority sizes="100vw"`;
  use that branch as the styling exemplar for the poster layer.
- `src/components/mux-video.tsx` - same static import; rendered in grids by
  `src/components/page/service-page.tsx:124` and
  `src/app/(site)/work/[slug]/page.tsx:165`.
- Repo conventions: client components declare `"use client"`; images use
  `next/image`; reduced-motion is respected across effects.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0; note route sizes table |
| Serve     | `npm run start`     | serves on :3000     |
| Typecheck | `npx tsc --noEmit`  | exit 0              |

## Scope

**In scope**:
- `src/components/mux-bg.tsx`
- `src/components/mux-video.tsx`
- `src/components/page/page-hero.tsx` (only if prop changes require it)
- `src/app/(site)/page.tsx` (only if prop changes require it)

**Out of scope**:
- The Mux playback IDs, gradients, and hero copy/layout.
- `next.config.ts`, Sanity files, scroll components.
- Replacing Mux with a plain `<video>` (considered; rejected for now because
  Mux handles adaptive bitrate and the client relationship already uses it).

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Defer the Mux player until it nears the viewport and optimise hero posters`.

## Steps

### Step 1: Record the baseline

Run `npm run build` and save the "First Load JS" figure for the `/` route
from the output table (paste it into the commit message or plan status row
for the before/after comparison).

**Verify**: figure recorded.

### Step 2: Rework MuxBg to defer the player behind an optimised poster

Rewrite `src/components/mux-bg.tsx` so that:

1. The component immediately renders the poster as a `next/image`
   (`fill`, `priority`, `sizes="100vw"`, `className="object-cover"`,
   empty `alt`), absolutely positioned to fill the container, matching the
   image-branch styling in `page-hero.tsx:33-40`.
2. The Mux player is loaded with `next/dynamic` and `ssr: false`:
   ```tsx
   const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });
   ```
3. The player mounts only when the component is near the viewport: a
   `useEffect` sets up an `IntersectionObserver` on the wrapper
   (`rootMargin: "200px"`), and a `shouldLoad` state flips true on first
   intersection, after which the observer disconnects. Render the player
   (absolutely positioned above the poster image) only when `shouldLoad`.
4. Change `preload="auto"` to `preload="none"` (the player starts fetching
   when it mounts and autoplays; the aggressive preload is redundant once
   mounting is already visibility-gated).
5. Keep the existing props contract (`playbackId`, `poster`) so call sites
   don't change; keep `autoPlay="muted" loop muted nohotkeys` and the
   `envKey` passthrough exactly as they are.

The hero is at the top of the page, so on the homepage the observer fires
immediately and the film still autoplays on load; the win is that the player
code no longer blocks first paint and hydration.

**Verify**: `npx tsc --noEmit` -> exit 0. `npm run dev`, load `/`, confirm:
poster paints instantly, film fades in and plays muted within a couple of
seconds, no layout shift.

### Step 3: Same treatment for MuxVideo

Apply the identical dynamic-import + IntersectionObserver pattern to
`src/components/mux-video.tsx` (below-fold film grids benefit most: three
players no longer initialise on page load). Keep its props contract.

**Verify**: `npm run dev`, open one service page (for example `/bicycle`)
and one case study with films; players initialise as you scroll to them and
play as before.

### Step 4: Measure and compare

`npm run build` again; compare the `/` First Load JS with step 1. Expect a
reduction (the Mux chunk moves out of the shared first load). Record both
numbers.

**Verify**: build exits 0 and the figure did not increase.

## Test plan

- No unit tests (browser-behaviour change). Manual QA checklist:
  - Homepage desktop + mobile widths: poster instant, film plays, gradients
    unchanged, no flash between poster and film.
  - A `videoPlaybackId` page hero (find one via
    `git grep -n "videoPlaybackId" -- src/app src/content`), same checks.
  - Service-page film grid and a case-study film: play on scroll-into-view.
  - Reduced motion (emulate in devtools): behaviour must be no worse than
    today (the player already autoplays muted; if you gate autoplay on
    reduced-motion as a bonus, poster must remain).

## Done criteria

- [ ] `git grep -n "from \"@mux/mux-player-react\"" -- src/components` shows
      only `dynamic(() => import(...))` usages, no static top-level import
- [ ] `git grep -n "preload=\"auto\"" -- src/components` -> no matches
- [ ] Homepage First Load JS did not increase (numbers recorded)
- [ ] Manual QA checklist above completed
- [ ] `npm run build` exits 0; no files outside the in-scope list modified
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- `next/dynamic` with `ssr: false` is rejected inside these client
  components by this Next version (check the error and the docs under
  `node_modules/next/dist/docs/` before working around it).
- The poster/film handoff visibly flashes or shifts layout and 30 minutes of
  adjustment has not fixed it: report with a screenshot rather than
  shipping a visual regression.
- The First Load JS for `/` does not drop at all (the win did not
  materialise; report the numbers instead of adding complexity).

## Maintenance notes

- Future video placements should use these components rather than importing
  `@mux/mux-player-react` directly; that keeps the deferral uniform.
- `public/images/hero.jpg` is served through next/image after this change,
  but the source file is still 128KB at whatever its native resolution is;
  if a designer re-exports it at ~1600px wide/quality 70, everyone gets a
  smaller optimizer source. Nice-to-have, not required.
- Related but separate: plan 007 trims other runtime overhead (marquee,
  Sentry sampling, font weights, image sizes).
