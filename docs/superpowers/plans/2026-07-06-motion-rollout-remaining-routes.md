# Motion Rollout — Remaining Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Apply the already-built, already-tested motion system (Plan 1) across the remaining 22 routes, mostly by upgrading three shared wrappers plus targeted per-page work.

**Architecture:** Composition, not new primitives. Reuse `SplitReveal`, `HeroScene`, `StickyStack`, `Parallax`, `Marquee`, `MaskReveal`, `Reveal`, `CountUp`, and the `data-cursor` attribute convention. The highest-leverage moves upgrade `PageHero` (14 routes), `ServicePage` (5 routes), and `LegalPage` (3 routes, inherits from PageHero) once; the rest is per-page card-grid hover/stagger and a few bespoke heroes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger (`@/lib/gsap`), Lenis.

## Global Constraints

- No new runtime dependencies. Import GSAP only from `@/lib/gsap`.
- Every effect gated by `gsap.matchMedia()` and fails open under `prefers-reduced-motion`. Pins/parallax fall back to static under `(max-width: 767px)`.
- Reuse existing primitives; do not create new ones or duplicate their logic.
- Pages are Server Components — motion lives in the client primitives they compose, or in small client wrappers. Never add `"use client"` to a route `page.tsx`; if a page needs client state, add a small client component.
- `data-cursor="View|Play|Drag"` opts an element into the custom cursor (plain attribute, no import).
- Keep all existing copy, layout intent, and brand (green/navy, Raleway/Hanken/Space Mono). UK English. First-person voice in any copy. No em dashes.
- Verify each task with `npm run typecheck && npm run build` (clean). Interactive Playwright + reduced-motion pass is consolidated in the final task.
- Commits in Matt's voice, NO "Co-Authored-By" trailer, NO "Generated with" footer. Stage only the files each task touches.

---

## Shared-wrapper leverage (read before starting)

- `src/components/page/page-hero.tsx` (PageHero) — used by 14 routes; already does MaskReveal h1 + Parallax bg. Upgrading it cascades everywhere.
- `src/components/page/service-page.tsx` (ServicePage) — used by bicycle, bicycle-blade, bicycle-ripple, bicycle-studio, international. Hero is a plain `<h1>` (weakest hero on the site); grids use `Reveal` but no hover cursor/stagger.
- `src/components/page/legal-page.tsx` (LegalPage) — used by the 3 legal pages; wraps PageHero. Inherits PageHero's upgrade automatically; no separate work.
- Card grids: `WorkGrid` (hover done in Plan 1), `SlipstreamGrid`, the-peloton MemberCard, ServicePage points/logos/videos grids, careers card grids.

---

## Task 1: Upgrade PageHero (cascades to 14 routes)

**Files:**
- Modify: `src/components/page/page-hero.tsx`

**Interfaces:**
- Consumes: `SplitReveal` (`@/components/scroll/split-reveal`), existing `Parallax`.
- Produces: same PageHero public props; internally the h1 becomes a `SplitReveal` (word-level, play-on-enter) while keeping the existing Parallax background and reduced-motion fallback.

- [ ] **Step 1: Read the file** and note how the h1 currently renders (MaskReveal, `lines` or `title` prop) and how the eyebrow/subtitle sit around it.

- [ ] **Step 2: Replace the h1 reveal with SplitReveal** (word-level, not scrubbed) at the same size/classes. If PageHero currently maps a `title` string, pass it as `text`; if it splits lines, keep the visual line breaks by keeping the display classes. Use `by="word"`, no `scrub`. Preserve the eyebrow and any subtitle exactly. Keep the existing `Parallax` background wrapper.

- [ ] **Step 3: Add `data-cursor` where apt** — if PageHero renders a scroll-down affordance or a primary CTA, leave CTAs to MagneticButton; no cursor change needed here unless there's an obvious interactive hero element. Skip if none.

- [ ] **Step 4: Build.** `npm run typecheck && npm run build` — clean. Because this cascades to 14 pages, spot-check the build output lists them without error.

- [ ] **Step 5: Commit.**
```bash
git add src/components/page/page-hero.tsx
git commit -m "Upgrade PageHero to a word-level SplitReveal headline"
```

---

## Task 2: Upgrade ServicePage (cascades to 5 routes)

**Files:**
- Modify: `src/components/page/service-page.tsx`

**Interfaces:**
- Consumes: `SplitReveal`, existing `Parallax`, `Reveal`, `data-cursor`.
- Produces: same ServicePage props; a stronger hero (SplitReveal heading + Parallax bg, matching PageHero's language) and card grids that opt into the cursor and stagger.

- [ ] **Step 1: Read the file** — note the hero (`<h1>` plain or sr-only + logo image), the points 3-col grid, badges row, brand-logos grid, videos grid, and their existing `Reveal` usage/hover.

- [ ] **Step 2: Strengthen the hero** — wrap the visible heading in `SplitReveal` (`by="word"`) at the same size; if `content.logo` is used (sr-only h1 + logo image), keep the logo but add a `Parallax` on the hero background to match PageHero. Keep the accent glow and bg video/image.

- [ ] **Step 3: Card grids** — on the points cards, brand-logo tiles, and video tiles, add `data-cursor="View"` to each card/link root (videos get `data-cursor="Play"`). Keep the existing `Reveal`; add a small stagger by passing an incremental `delay` (e.g. `i * 60`) if `Reveal` supports it (check its props — Plan 1 pages used `delay`). Do not change layout.

- [ ] **Step 4: Build.** `npm run typecheck && npm run build` — clean.

- [ ] **Step 5: Commit.**
```bash
git add src/components/page/service-page.tsx
git commit -m "Give ServicePage a SplitReveal hero and cursor-aware, staggered grids"
```

---

## Task 3: Work index + case study

**Files:**
- Modify: `src/app/(site)/work/page.tsx`
- Modify: `src/app/(site)/work/[slug]/page.tsx`

**Interfaces:** Consumes `SplitReveal`, `Parallax`, `data-cursor`, existing `WorkGrid` (hover already added in Plan 1), `CountUp`.

- [ ] **Step 1: Read both files.**

- [ ] **Step 2: work/page.tsx** — the hero already uses MaskReveal + Parallax; leave the hero unless a `SplitReveal` upgrade is trivial and consistent. Confirm `WorkGrid` here benefits from the Plan 1 hover (it does — same component). Add `Parallax` to any full-bleed feature imagery if not already wrapped. Minimal change if already rich.

- [ ] **Step 3: work/[slug]/page.tsx** — keep the MaskReveal hero (or upgrade to SplitReveal for consistency), confirm the Results band uses `CountUp` (already does), add `data-cursor="View"` on gallery images (they open the lightbox) and wrap gallery in `Parallax`/`StickyStack` only if it reads well; otherwise add a gentle `Parallax` per image. Keep the lightbox behaviour intact.

- [ ] **Step 4: Build.** `npm run typecheck && npm run build` — clean.

- [ ] **Step 5: Commit.**
```bash
git add "src/app/(site)/work/page.tsx" "src/app/(site)/work/[slug]/page.tsx"
git commit -m "Carry motion to the work index and case-study pages"
```

---

## Task 4: Slipstream index + article

**Files:**
- Modify: `src/components/slipstream-grid.tsx`
- Modify: `src/app/(site)/slipstream/[slug]/page.tsx`
- Create: `src/components/scroll/reading-progress.tsx` (article reading-progress bar, per design spec section 7)

**Interfaces:** Consumes `data-cursor`, `Reveal`, `gsap`/`ScrollTrigger` (for reading progress, same pattern as `ScrollProgress` from Plan 1 but scoped to the article element).

- [ ] **Step 1: Read `slipstream-grid.tsx`** — add `data-cursor="View"` to each article card link and an image hover reveal (`overflow-hidden` wrapper + `group-hover:scale-[1.05] motion-reduce:transform-none`), matching the WorkGrid pattern. Add a stagger `delay` if the grid wraps cards in `Reveal`.

- [ ] **Step 2: Create `ReadingProgress`** — a client component: a thin brand bar (like `ScrollProgress`) whose width tracks scroll progress **through a target element** (the article body), via a ScrollTrigger with `trigger` = the article, `start: "top top"`, `end: "bottom bottom"`, `scrub`. Gate with `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`, inert otherwise. It takes no props; it finds `[data-article]` or accepts a `targetId`. Prefer a `targetId` prop for clarity.

```tsx
// src/components/scroll/reading-progress.tsx
"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** A reading-progress bar that fills as you scroll through the element with id=targetId. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
      const st = ScrollTrigger.create({
        trigger: target,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  });
  return (
    <div ref={ref} aria-hidden className="fixed left-0 top-0 z-[140] h-[3px] w-full bg-brand" style={{ transform: "scaleX(0)" }} />
  );
}
```

- [ ] **Step 3: Wire it into the article page** — in `slipstream/[slug]/page.tsx`, give the article body wrapper `id="article"` and render `<ReadingProgress targetId="article" />`. Keep everything else.

- [ ] **Step 4: Build.** `npm run typecheck && npm run build` — clean.

- [ ] **Step 5: Commit.**
```bash
git add src/components/slipstream-grid.tsx src/components/scroll/reading-progress.tsx "src/app/(site)/slipstream/[slug]/page.tsx"
git commit -m "Add card hover and an article reading-progress bar to Slipstream"
```

---

## Task 5: Purpose page

**Files:**
- Modify: `src/app/(site)/purpose/page.tsx`

**Interfaces:** Consumes `Marquee`, `SplitReveal`, existing `Parallax`/`Reveal`/`MaskReveal`.

- [ ] **Step 1: Read the file.**

- [ ] **Step 2: Partner-logo strip → Marquee** — convert the static partner-logo band to a `Marquee` (steady cruise, `velocity`), matching the home "AND" marquee usage. Keep the same logos.

- [ ] **Step 3: Section headings → SplitReveal** — upgrade the main block headings (B Corp, looking after our people, XO Bikes, Recycle-to-work) from plain/Reveal to `SplitReveal` (`by="word"`), keeping sizes. Leave the existing Parallax images and Reveal body copy.

- [ ] **Step 4: Build + Commit.**
```bash
git add "src/app/(site)/purpose/page.tsx"
git commit -m "Add a logo marquee and SplitReveal headings to the Purpose page"
```

---

## Task 6: The Peloton + Careers set

**Files:**
- Modify: `src/app/(site)/the-peloton/page.tsx`
- Modify: `src/app/(site)/careers/page.tsx`
- Modify: `src/app/(site)/careers/values/page.tsx`
- Modify: `src/app/(site)/careers/benefits/page.tsx`

**Interfaces:** Consumes `data-cursor`, `Reveal` (with `delay` stagger), `SplitReveal`, `Marquee`.

- [ ] **Step 1: the-peloton** — add `data-cursor="View"` to each MemberCard (already has hover photo-swap + LinkedIn link). Keep the existing staggered Reveal.

- [ ] **Step 2: careers/page.tsx** — wrap the job-list rows, the 3-card "more links" grid, the testimonial grid, and the peloton-teaser cards in `Reveal` with an incremental `delay` stagger, and add `data-cursor="View"` to each card/row link. No layout change.

- [ ] **Step 3: careers/values** — the 3 values (Drive / Balance / Freedom) are short punchy words: make each value heading a `SplitReveal` (`by="char"`) and stagger the three cards with `Reveal` `delay`.

- [ ] **Step 4: careers/benefits** — stagger the 5 benefit groups in with `Reveal` `delay`. Keep the bullet lists.

- [ ] **Step 5: Build + Commit.**
```bash
git add "src/app/(site)/the-peloton/page.tsx" "src/app/(site)/careers/page.tsx" "src/app/(site)/careers/values/page.tsx" "src/app/(site)/careers/benefits/page.tsx"
git commit -m "Add cursor-aware hover and staggered reveals across the Peloton and careers pages"
```

---

## Task 7: About stats + remaining low-density pages

**Files:**
- Modify: `src/app/(site)/about/page.tsx`
- Modify: `src/app/(site)/contact-us/page.tsx`
- Modify: `src/app/(site)/careers/diversity/page.tsx` (only if a simple reveal helps)
- Modify: `src/app/(site)/careers/[slug]/page.tsx` and `src/app/(site)/careers/team/[slug]/page.tsx` (light Parallax on portrait only)

**Interfaces:** Consumes `Reveal`, `Parallax`, existing `StatsBand`/`ScrollFillText`.

- [ ] **Step 1: about** — confirm `StatsBand` count-up works (it uses `CountUp`); optionally wrap the stats row so it counts up on enter (already does). Add a gentle `Parallax` on the team image if not present (it is). Minimal.

- [ ] **Step 2: contact-us** — wrap the contact-details column in `Reveal`. Add `data-cursor` to the email/phone links only if it reads well (optional).

- [ ] **Step 3: careers/[slug] + careers/team/[slug]** — wrap the single portrait/avatar in `Parallax` (gentle) and reveal the body copy. Minimal.

- [ ] **Step 4: careers/diversity** — reveal-on-scroll the long-form paragraphs with `Reveal`. Minimal.

- [ ] **Step 5: Build + Commit.**
```bash
git add "src/app/(site)/about/page.tsx" "src/app/(site)/contact-us/page.tsx" "src/app/(site)/careers/diversity/page.tsx" "src/app/(site)/careers/[slug]/page.tsx" "src/app/(site)/careers/team/[slug]/page.tsx"
git commit -m "Polish reveals on about, contact, and the low-density career pages"
```

---

## Task 8: Full verification + preview

**Files:** none (verification only)

- [ ] **Step 1:** `npm test` — all Plan 1 unit tests still pass (37).
- [ ] **Step 2:** `npm run typecheck && npm run build` — clean, all 61 routes.
- [ ] **Step 3: Playwright** against a local dev server, across an archetype of each wrapper:
  - A PageHero page (e.g. `/about`), a ServicePage (e.g. `/bicycle-blade`), a card index (`/slipstream`), a detail page (`/work/[slug]`), a legal page (`/privacy-policy`).
  - Desktop (1440×900) and mobile (390×844): no console errors, no horizontal scrollbar, cursor present desktop / absent on coarse pointer.
- [ ] **Step 4: Reduced-motion pass** — emulate `prefers-reduced-motion: reduce`; every page's content is visible and static; reading-progress and marquees inert.
- [ ] **Step 5: Push the branch** (preview deploy). Confirm `git status` is clean and the branch is pushed. Do NOT merge — Matt reviews the preview, then it merges to production.

---

## Self-review notes

- **Spec coverage (spec section 7):** PageHero upgrade (T1) covers slipstream, about, the-peloton, careers ×6, contact, legal ×3; ServicePage (T2) covers bicycle/blade/ripple/studio/international; work + case study (T3); Slipstream grid + reading-progress (T4); purpose marquee + SplitReveal (T5); Peloton + careers hover/stagger (T6); about/contact/low-density (T7); verification (T8). Legal pages inherit PageHero — deliberately no bespoke task.
- **No placeholders:** the one new component (`ReadingProgress`) has complete code; all other tasks are composition of existing primitives with explicit instructions to read the real file first (props/markup may have changed).
- **Type consistency:** `ReadingProgress({ targetId })`, `SplitReveal({ text, by, scrub })`, `data-cursor` attribute — all match Plan 1 definitions.
- **Risk calibration for review:** T1 and T2 cascade to many routes → full task review. T3–T7 are lower-risk per-page composition → build-verify + controller diff-check, full review only if a diff looks off.
