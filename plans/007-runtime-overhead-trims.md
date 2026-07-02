# Plan 007: Trim always-on runtime overhead (marquee loop, Sentry sampling, fonts, image sizes)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/components/scroll/marquee.tsx src/instrumentation-client.ts sentry.server.config.ts sentry.edge.config.ts src/app/layout.tsx src/components/portable-text.tsx "src/app/(site)/work/[slug]/page.tsx"`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: Low
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Four small, unrelated costs run on every visit: the homepage "AND" marquee
animates via requestAnimationFrame forever, even when scrolled far
off-screen or in a background tab, layered on top of the Lenis and GSAP
tickers; Sentry is configured to trace 100% of transactions once a DSN is
set (browser overhead and quota burn on a static marketing site); five
Raleway weights are downloaded when the site may render fewer; and fluid
content images lack `sizes`, so phones download near-desktop-resolution
files. Each fix is small; together they cut steady-state main-thread work
and transfer weight.

## Current state

- `src/components/scroll/marquee.tsx:44-70` - a scroll listener (when the
  `velocity` prop is set) plus an unconditional rAF loop:
  ```ts
  const tick = () => {
    pos += (baseSpeed + boost.current) * direction;
    ...
    track.style.transform = `translate3d(${pos}px,0,0)`;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  ```
  Cleanup cancels the rAF on unmount, but nothing pauses it while the
  marquee is off-screen or the tab is hidden. Used on the homepage
  (`src/app/(site)/page.tsx:101-116`) with `velocity` set.
- `src/instrumentation-client.ts` and `sentry.server.config.ts` (and
  `sentry.edge.config.ts`, same shape):
  ```ts
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1,
  });
  ```
- `src/app/layout.tsx:7-12` - Raleway loaded with
  `weight: ["400", "500", "600", "700", "800"]`. Raleway is applied via the
  `--font-raleway` variable; body text uses a system stack in
  `src/app/globals.css`, and the `.display`/`font-display` styles use the
  heavier weights.
- `src/components/portable-text.tsx:66-72` - article body images:
  `<Image src={urlFor(value).width(1400)...} width={1400} height={900}
  className="h-auto w-full rounded-2xl" />` inside a `max-w-3xl` column,
  no `sizes` prop.
- `src/app/(site)/work/[slug]/page.tsx:177-183` - case-study gallery images
  `width={1000} height={700}`, rendered fluid, no `sizes`.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Lint      | `npm run lint`      | no new errors       |

## Scope

**In scope**:
- `src/components/scroll/marquee.tsx`
- `src/instrumentation-client.ts`, `sentry.server.config.ts`,
  `sentry.edge.config.ts`
- `src/app/layout.tsx` (font weights only)
- `src/components/portable-text.tsx`,
  `src/app/(site)/work/[slug]/page.tsx` (sizes props only)

**Out of scope**:
- The CSS marquees in `team-strip.tsx` / `logo-wall.tsx` (already cheap).
- Lenis/GSAP ticker wiring in `smooth-scroll.tsx`.
- Reveal/CountUp IntersectionObserver consolidation (measured as minor;
  recorded as rejected in `plans/README.md`).

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Pause the marquee off-screen, sample Sentry traces, trim font weights`.

## Steps

### Step 1: Pause the marquee when off-screen or tab-hidden

In `src/components/scroll/marquee.tsx`, inside the existing effect:

- Add `let running = false;` and split the loop so `tick` only re-queues
  while `running`.
- Create an `IntersectionObserver` on the wrapper element that sets
  `running = true` and starts the rAF on intersect, and sets
  `running = false` and cancels it when not intersecting.
- Add a `visibilitychange` listener on `document` that pauses the same way
  when `document.hidden`.
- Clean up the observer and the listener in the effect's return alongside
  the existing cleanup.

Behaviour must be unchanged while the marquee is visible (same speed, same
velocity surge).

**Verify**: `npm run lint` -> no new errors. `npm run dev`, homepage: the
strip scrolls as before; scroll it out of view and confirm (via devtools
performance panel or a temporary counter) that frames stop; scroll back and
it resumes.

### Step 2: Sample Sentry traces

In all three Sentry config files, change `tracesSampleRate: 1` to
`tracesSampleRate: 0.1`.

**Verify**: `git grep -n "tracesSampleRate" -- src sentry.server.config.ts sentry.edge.config.ts`
-> every match is `0.1`.

### Step 3: Trim unused font weights

Find which Raleway weights actually render:
`git grep -rn "font-display\|font-medium\|font-semibold\|font-bold\|font-extrabold\|font-black" -- src | grep -o "font-[a-z]*" | sort | uniq -c`
plus check `src/app/globals.css` for `font-weight` declarations tied to the
Raleway variable (the `.display` class). Keep only weights that appear where
Raleway applies; remove the rest from the `weight` array in
`src/app/layout.tsx`. If in doubt about a weight, keep it; the goal is
dropping clearly unused files, not risking a fallback render.

**Verify**: `npm run dev`, compare headings and display type on the
homepage, a service page, and an article against production/pre-change: no
visible weight substitution.

### Step 4: Add sizes to fluid content images

- `src/components/portable-text.tsx` image renderer: add
  `sizes="(max-width: 800px) 100vw, 768px"` (the column is `max-w-3xl`).
- `src/app/(site)/work/[slug]/page.tsx` gallery images: add a `sizes`
  reflecting the gallery's rendered column width (inspect the wrapper
  classes at the call site; a two-column grid inside `max-w-5xl` renders at
  most ~512px per image on desktop, 100vw on mobile).

**Verify**: `npm run dev`, open an article with a body image, inspect the
`<img>` srcset/sizes in devtools, and confirm a phone-width viewport selects
a candidate well below 1400w.

## Test plan

- No unit tests. The verifications above are the test plan; run
  `npm test` at the end if plan 001 has landed to confirm nothing regressed.

## Done criteria

- [ ] Marquee pauses off-screen and on hidden tab, resumes correctly
- [ ] All `tracesSampleRate` values are 0.1
- [ ] Raleway `weight` array contains only weights verified in use
- [ ] Both image call sites have honest `sizes` props
- [ ] `npm run build` and `npm run lint` exit clean; no files outside the
      in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- Pausing/resuming the marquee causes a visible position jump (the `pos`
  accumulator must persist across pauses; if it does not, report rather
  than rewriting the component).
- The font audit shows all five weights genuinely in use (then that item is
  a no-op; record it and move on).

## Maintenance notes

- If Sentry browser tracing turns out to be unwanted entirely on this site,
  removing the tracing integration (error-only client) is the bigger bundle
  win; decision deferred to the operator once a DSN exists and real quota
  numbers are visible.
- New fluid `next/image` usages should always carry `sizes`; check in review.
