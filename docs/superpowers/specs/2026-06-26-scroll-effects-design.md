# Design: Interactive scroll effects (Bicycle London)

Date: 2026-06-26
Status: Approved (homepage scope). Phase 2/3 noted, not yet planned.

## Goal

Bring the GSAP/Lenis scroll-effects handoff in `design_handoff_scroll_effects/`
into the live site as an enhancement layer, themed with the current brand tokens
(not the future relaunch palette). Land everything on the homepage first, then
extend selected effects across other pages.

## Decisions (agreed in brainstorming)

1. **Scope: enhance the current brand.** Map the handoff's `acid/navy/deep/paper`
   palette and Helvetica/Space Mono type onto the live tokens (navy `#08124d`,
   brand green `#00ff00`, paper, Raleway). No second parallel palette. The site
   stays the faithful clone; the relaunch is still a later, separate project.
2. **Lenis app-wide: yes**, wired through the existing scroll conventions so
   `ScrollToTop` and logo-to-top keep working.
3. **Pinned sections replace the static ones** (Selected work grid -> horizontal
   gallery; What we do grid -> sticky two-column).
4. **Overlap upgrades included:** velocity marquee, mask-up headings + a short
   manifesto, hero parallax. Stats count-up, existing `Reveal`, and `TeamStrip`
   stay as they are.

## Token & styling translation

This project is Tailwind v4 (config in `globals.css` `@theme`), so the handoff's
`tailwind.config.snippet.ts` is translated, not copied.

| Handoff class | Becomes | Note |
|---|---|---|
| `bg-acid` / `text-acid` | `bg-brand` / `text-brand` | `--color-brand` `#00ff00` |
| `bg-navy` | `bg-navy` | resolves to the live `#08124d` |
| `bg-deep` | new token `--color-deep` `#050a36` | one new token; keeps the layered depth |
| `text-paper` | `text-paper` | `--color-paper` already exists |
| `font-display` | `font-display` | resolves to Raleway |
| `font-mono` kickers | site label style: `text-xs font-semibold uppercase tracking-[0.2em]` | drop Space Mono (relaunch-only flourish) |

`globals.css` also gains `@import 'lenis/dist/lenis.css';` and `overflow-x: clip`
on `body`. `body` stays white (light-themed site); each effect section paints its
own dark background. `html { scroll-behavior: auto }` is already correct.

## Components ported into `src/components/scroll/`

One registration point added at `src/lib/gsap.ts` (registers `ScrollTrigger` +
`useGSAP`, re-exports). All ported components import GSAP from there.

| Component | Source | Adaptation |
|---|---|---|
| `SmoothScroll` | handoff | unchanged logic; wrapped once in root layout |
| `Parallax` | handoff | tokens only |
| `Marquee` | handoff | tokens only |
| `KineticPairs` | handoff | tokens; fed the existing `ANDS` pairs |
| `HorizontalGallery` | handoff | tokens; kicker labels restyled (no Space Mono) |
| `StickyServices` | handoff | tokens; kicker labels restyled |
| `MagneticButton` | handoff | tokens; used inside the CTA band |
| `MaskReveal` | handoff `Reveal.tsx` | **renamed** to avoid colliding with existing `Reveal` |

Existing `src/components/reveal.tsx`, `stats.tsx`, `team-strip.tsx`, and
`logo-wall.tsx` are untouched.

## Homepage composition (`src/app/(site)/page.tsx`)

1. Hero - existing Mux video + `GsapHeroHeading`, content wrapped in subtle `Parallax`
2. "AND" band - velocity `Marquee` (replaces the CSS marquee)
3. Power of AND - `KineticPairs`, pinned, using the existing `ANDS` array (new showpiece)
4. Meet Bicycle - unchanged
5. Stats - unchanged (existing `StatsBand`)
6. Manifesto - `MaskReveal`: "We don't pick data *or* instinct... we choose **and**" (mid-page, so it doesn't collide with the CTA payoff)
7. The Peloton - unchanged `TeamStrip`
8. Logo wall - unchanged
9. What we do - `StickyServices`, pinned two-column (replaces card grid)
10. Selected work - `HorizontalGallery`, pinned horizontal scroll (replaces grid)
11. CTA - `MagneticButton` in `CtaBand`

Three pinned sections + parallax + velocity marquee + mask reveal.

## Lenis wiring + convention changes

- `SmoothScroll` wraps `children` in the **root** `layout.tsx` (`ReactLenis root`,
  driven off the GSAP ticker; destroys itself under reduced-motion).
- `ScrollToTop`: becomes Lenis-aware. On route change, if no hash, call
  `lenis.scrollTo(0, { immediate: true })`; fall back to
  `window.scrollTo({ top: 0, behavior: "instant" })` when Lenis is absent or
  reduced-motion is set.
- `Logo` onClick (already on `/`): `lenis.scrollTo(0)` instead of native smooth
  scroll, with the same fallback.
- Anchor/jump links: `lenis.scrollTo('#id', { offset: -80 })`.
- `(site)/template.tsx` `.page-enter`: change from `translateY` + opacity to
  **opacity-only**. A transformed ancestor breaks `position: fixed`, which is how
  ScrollTrigger pins; opacity-only removes that class of bug entirely while keeping
  the entrance fade.

## Mobile / reduced-motion

Each pinned component already degrades under `(max-width: 767px)` and
`(prefers-reduced-motion: reduce)` via `gsap.matchMedia()`:
- `KineticPairs` -> stacked flowing list (no pin)
- `HorizontalGallery` -> native swipe scroller with scroll-snap
- `StickyServices` -> single stacked column (separate `md:hidden` tree)
- `Parallax` -> disabled; `Marquee` keeps gentle auto-scroll; magnetic is a no-op on touch

## Risks & mitigations

1. **Pinning vs page transition** - addressed by the opacity-only `.page-enter` change.
2. **Lenis vs conventions** - addressed by the Lenis-aware `ScrollToTop`/`Logo`.
3. **Stacked pins on one page** - fine on desktop; matchMedia drops pinning under 768px.
4. **iOS `100vh` jump** - if pinned sections feel like they snap on iOS Safari, switch
   the relevant heights to `100svh`/`100dvh`. Verify on a real device.
5. **Reduced-motion + destroyed Lenis** - consumers check reduced-motion / `lenis`
   presence before calling `scrollTo`.

## File changes

- New: `src/lib/gsap.ts`; `src/components/scroll/{SmoothScroll,Parallax,Marquee,KineticPairs,HorizontalGallery,StickyServices,MagneticButton,MaskReveal}.tsx`
- Edited: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/scroll-to-top.tsx`, `src/components/logo.tsx`, `src/app/(site)/template.tsx`, `src/app/(site)/page.tsx`, `package.json` (`+ lenis`)
- Untouched: `reveal.tsx`, `stats.tsx`, `team-strip.tsx`, `logo-wall.tsx`

## Verification

- `npm run build` passes clean.
- Visual QA (Playwright) desktop + mobile: hero parallax, marquee velocity, the
  three pins (scrub/snap/swap), mask reveal, magnetic CTA.
- Navigation conventions: logo-to-top from home and from a sub-page; scroll resets
  to top on every client navigation; anchor links still land correctly.
- `prefers-reduced-motion`: all pins fall back to static/stacked; Lenis off.
- No horizontal page scroll on mobile.

## Phase 2 - cross-site rollout (documented, not yet planned)

Once the homepage lands and passes QA, extend the lighter effects to other pages:
- `MaskReveal` for big page-hero headings (`/work`, `/about`, `/purpose`, service pages).
- `Parallax` on page-hero imagery.
- `Marquee` where a textural band fits (e.g. careers, about).
- `MagneticButton` on primary CTAs site-wide.
- Consider `HorizontalGallery` for the `/work` index and case-study related-work rows.

## Phase 3 - jazz-up audit (documented, not yet planned)

A pass over the rest of the site for elements that need lifting (page heroes,
section transitions, hover states, empty states), prioritised after Phase 2.

## Non-goals

- The brand relaunch palette/type (separate future project).
- Replacing the existing `Reveal`, `StatsBand`, or `TeamStrip`.
- Convex/Resend form provisioning (unrelated, tracked elsewhere).
