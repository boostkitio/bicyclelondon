# Plan 011: Make `npm run lint` pass clean (zero errors, zero warnings)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/components scripts eslint.config.mjs "src/app/(site)/careers"`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition. Also re-run `npm run lint` first;
> the error inventory below was captured at commit `e53e903`.

## Status

- **Priority**: P2
- **Effort**: S-M
- **Risk**: Low-Med (touches animation components; behaviour must not change)
- **Depends on**: plans/009-repo-housekeeping.md (deletes the handoff folder
  that owns 3 of the errors; if 009 is not done, step 6 covers it)
- **Category**: dx
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

`npm run lint` currently exits with 10 errors and 4 warnings, so lint cannot
gate anything: a new real error drowns in the standing noise. Most errors
are the `react-hooks/set-state-in-effect` rule flagging synchronous
`setState` inside effects: patterns that cause an extra render pass and,
more importantly, keep the rule useless while they stand. The fixes below
use a shared `useSyncExternalStore`-based hook for media-query state, which
is the idiomatic replacement and also deletes code.

## Current state

`npm run lint` inventory at `e53e903` (10 errors, 4 warnings):

| File | Problem |
|------|---------|
| `src/components/reveal.tsx:35` | error: setState in effect (`setShown(true)` reduced-motion branch; also seeds via `getBoundingClientRect` + `setShown`/`setArmed`) |
| `src/components/count-up.tsx:28` | error: setState in effect (`setN(to)` reduced-motion branch) |
| `src/components/stats.tsx:21` | error: setState in effect (`setN(stat.value)` reduced-motion branch) |
| `src/components/scroll/smooth-scroll.tsx:27` | error: setState in effect (`setEnabled(!mq.matches)`); plus warning at 52: ref value in cleanup |
| `src/components/site-header.tsx:27` | error: setState in effect (`setOpen(false)` on pathname change) |
| `src/app/(site)/careers/page.tsx:195` | error: unescaped `'` in JSX (`What's life at Bicycle like?`) |
| `design_handoff_scroll_effects/components/SmoothScroll.tsx` | 2 errors: explicit `any` |
| `design_handoff_scroll_effects/components/useReducedMotion.ts:10` | error: setState in effect |
| `src/app/(site)/careers/benefits/page.tsx:5` | warning: unused `SITE` import |
| `scripts/_apply-formatting.mjs:24` | warning: unused `norm` |
| `scripts/migrate.mjs:290` | warning: unused `metadata` |
| `scripts/import-slipstream-wix-images.js:9` | error: `require()` import forbidden |

Key excerpts:

- `src/components/scroll/smooth-scroll.tsx:25-31`:
  ```ts
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  ```
- `src/components/site-header.tsx:26-28`:
  ```ts
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  ```
- `src/components/reveal.tsx:34-48`: reduced-motion early return
  (`setShown(true)`), then `getBoundingClientRect()` seed and an
  IntersectionObserver whose callback also calls `setShown`.
- `count-up.tsx:27-30` / `stats.tsx:20-23`: reduced-motion early return
  setting the final value synchronously in the effect.

Repo conventions: client components in `src/components/`, hooks would live
in `src/lib/`, `@/` import alias, no eslint-disable comments anywhere in
`src` (keep it that way; fix causes, don't suppress).

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Lint      | `npm run lint`      | exit 0, no output   |
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Tests     | `npm test`          | all pass (if plan 001 landed) |

## Scope

**In scope**:
- `src/lib/use-prefers-reduced-motion.ts` (create)
- `src/components/reveal.tsx`, `count-up.tsx`, `stats.tsx`,
  `scroll/smooth-scroll.tsx`, `site-header.tsx`
- `src/app/(site)/careers/page.tsx` (one character),
  `src/app/(site)/careers/benefits/page.tsx` (one import)
- `scripts/_apply-formatting.mjs`, `scripts/migrate.mjs`,
  `scripts/import-slipstream-wix-images.js`
- `eslint.config.mjs` (only if step 6's fallback is needed)

**Out of scope**:
- Any visual/behavioural change to the animations. These fixes must be
  render-equivalent.
- Adding `eslint-disable` comments (not the repo style).
- The GSAP components with `ref.current!` assertions (idiomatic, not
  flagged, leave alone).

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Fix the standing lint errors so the lint gate is usable`.

## Steps

### Step 1: Shared reduced-motion hook

Create `src/lib/use-prefers-reduced-motion.ts`:

```ts
"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // server snapshot: assume motion, components fail open
  );
}
```

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 2: smooth-scroll.tsx

Replace the `enabled` state and its whole first effect with the hook:

```ts
const reduced = usePrefersReducedMotion();
const enabled = !reduced;
```

Delete `useState` for `enabled` and the media-query effect entirely; keep
the second effect (ticker wiring) exactly as is, still keyed on
`[enabled]`. While here, fix the line-52 warning: inside the ticker effect,
capture `const ref = lenisRef;` is not the issue; the cleanup reads
`lenisRef.current?.lenis`. Copy the instance lookup into the cleanup from a
variable captured during the effect:

```ts
return () => {
  gsap.ticker.remove(update);
  lenisRef.current?.lenis?.off("scroll", onLenisScroll);
};
```

becomes: track the bound instance in a local (`let bound: Lenis | undefined`)
set where `scrollBound` flips, and call `bound?.off(...)` in cleanup.

**Verify**: `npm run lint` -> smooth-scroll errors and warning gone.
`npm run dev`: scrolling is still smooth; toggling the OS/devtools
reduced-motion setting swaps to native scrolling.

### Step 3: count-up.tsx and stats.tsx

In both, use the hook and derive the displayed value instead of setting
state in the effect:

```ts
const reduced = usePrefersReducedMotion();
...
useEffect(() => {
  if (!el || reduced) return; // no setState here
  ...
}, [to, duration, reduced]);
const shown = reduced ? to : n;
```

Render `shown` where `n` was rendered (in `stats.tsx` the equivalent is
`stat.value`). Remove the `matchMedia` lines from the effects.

**Verify**: `npm run lint` -> both errors gone. In the browser with reduced
motion emulated, stats show final values immediately; without it, they
count up as before.

### Step 4: reveal.tsx

Use the hook for the reduced-motion branch (`const reduced =
usePrefersReducedMotion();` and render visible when `reduced`). For the
seeding error: delete the `getBoundingClientRect` seed and the synchronous
`setShown`/`setArmed` calls; instead set both from the observer's first
callback (IntersectionObserver always fires the callback with the initial
intersection state on `observe`):

```ts
const io = new IntersectionObserver(([entry]) => {
  setArmed(true);
  setShown(entry.isIntersecting);
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
io.observe(el);
```

The `armed && !shown` hidden logic keeps content visible until the first
callback, preserving the "fails open, no above-the-fold flash" behaviour
documented in the component's comment. Keep that comment truthful: update
it to describe the observer-seeded approach.

**Verify**: `npm run lint` -> error gone. `npm run dev`: above-the-fold
content does not flash on load; below-fold content still reveals on scroll,
and re-reveals when scrolled out and back.

### Step 5: site-header.tsx (menu close on navigation)

Replace the pathname effect with the render-time adjustment pattern the
rule sanctions:

```ts
const [prevPathname, setPrevPathname] = useState(pathname);
if (prevPathname !== pathname) {
  setPrevPathname(pathname);
  setOpen(false);
}
```

Delete the `useEffect(() => { setOpen(false); }, [pathname]);` block. The
scroll-listener effect (lines 18-23) and the body-scroll-lock effect stay
as they are.

**Verify**: `npm run lint` -> site-header error gone. `npm run dev` at a
mobile width: open the menu, tap a nav link, the menu closes on navigation.

### Step 6: The one-liners

- `careers/page.tsx:195`: replace the raw apostrophe in
  `What's life at Bicycle like?` with a typographic apostrophe character
  (the same one used in the file's other copy).
- `careers/benefits/page.tsx:5`: delete the unused `SITE` import.
- `scripts/_apply-formatting.mjs:24` and `scripts/migrate.mjs:290`: delete
  the unused variables (confirm nothing below uses them).
- `scripts/import-slipstream-wix-images.js`: convert `require()` calls to
  ESM imports and rename to `.mjs` if needed (match the other scripts,
  which are all `.mjs` with imports). Verify with
  `node --check scripts/<newname>.mjs`.

**Verify**: `npm run lint` -> these entries gone.

### Step 7: Handoff-folder errors (only if plan 009 has not run)

If `design_handoff_scroll_effects/` still exists, do not fix its code; add
the folder to the `globalIgnores` array in `eslint.config.mjs` with a
comment `// design reference, not shipped; removal planned (plan 009)`.
If plan 009 already deleted it, skip this step.

**Verify**: `npm run lint` -> exit 0, zero errors, zero warnings.

## Test plan

- `npm test` (if plan 001 landed) plus the manual animation checks embedded
  in steps 2-4. The machine gate is `npm run lint` exiting 0.

## Done criteria

- [ ] `npm run lint` exits 0 with no errors and no warnings
- [ ] `git grep -rn "eslint-disable" -- src` -> no matches
- [ ] `npx tsc --noEmit` and `npm run build` exit 0
- [ ] Manual checks: smooth scroll, stats count-up, reveal, mobile menu
      close-on-navigate all behave as before
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The rule still flags `site-header.tsx` after step 5's render-time
  adjustment pattern: stop and report rather than suppressing.
- Reveal's no-flash behaviour regresses (above-the-fold content visibly
  blinks on hard reload) and one adjustment attempt has not fixed it.
- The lint rule set itself changed since `e53e903` (new/renamed rules make
  this inventory stale): re-run, re-inventory, and report if the shape is
  materially different.

## Maintenance notes

- `usePrefersReducedMotion` is now the one way to read reduced-motion in
  client components; new components should use it rather than raw
  `matchMedia` effects.
- Once green, lint failures are meaningful; consider wiring
  `npm run lint && npm run typecheck && npm test` as the standard pre-push
  gate (documented in AGENTS.md's commands section).
