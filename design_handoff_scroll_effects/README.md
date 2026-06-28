# Handoff: Interactive Scroll Effects — Bicycle London (GSAP)

## Overview
Scroll-driven, "go big" interactions for the Bicycle London rebuild, themed to the brand
(electric green / navy / bold uppercase grotesque) around the **"Power of AND"** concept.

This package is a **hybrid**: the scrubbed / pinned / triggered effects use **GSAP ScrollTrigger**
(the right tool for pinning + scrub + snap + responsive), while the two effects that gain nothing
from it stay as lean dependency-free components.

| Effect | Engine | File |
|---|---|---|
| Parallax hero | GSAP (scrub) | `components/Parallax.tsx` |
| Velocity marquee | vanilla rAF | `components/Marquee.tsx` |
| Pinned "Power of AND" (+ snap) | GSAP (pin + scrub + snap) | `components/KineticPairs.tsx` |
| Horizontal work gallery | GSAP (pin + scrub) | `components/HorizontalGallery.tsx` |
| Count-up stats | GSAP (trigger) | `components/CountUp.tsx` |
| Manifesto reveal | GSAP (trigger + stagger) | `components/Reveal.tsx` |
| Sticky services swap | GSAP (pin + toggle) | `components/StickyServices.tsx` |
| Magnetic CTA button | vanilla | `components/MagneticButton.tsx` |
| Smooth scroll (app-wide) | Lenis + GSAP ticker | `components/SmoothScroll.tsx` |

## About the design files
`reference/Scroll Demo.dc.html` is the original **design reference** (open in a browser to feel the
motion). `components/` is the **production React/TypeScript port** for **Next.js (App Router)**.
`example/ExamplePage.tsx` shows how the pieces assemble — a wiring guide, not final markup.

## Fidelity
**High-fidelity.** Colors, type, spacing, and motion timings are final. Recreate faithfully, then
move the inline styles to your styling system and swap the striped placeholders for real media.

---

## Quick start (Next.js App Router, hosted on Vercel)

### 1. Install
```bash
npm i gsap @gsap/react lenis
```
GSAP — including ScrollTrigger and all former "Club" plugins — is **free for commercial use** as of
2025. `lenis` ships its React bindings (`lenis/react`) in the same package.

### 2. Drop in the files
Copy `lib/gsap.ts` and `components/*` into your repo, e.g. `src/lib/` and `src/components/scroll/`.
Adjust the relative import in each component (`../lib/gsap`) to match where you put it.

### 3. Add the global CSS (`app/globals.css`)
```css
@import 'lenis/dist/lenis.css';   /* required Lenis html/body styles */

html { scroll-behavior: auto; }   /* let Lenis own scrolling, not CSS smooth */
body { margin: 0; background: #0B1140; overflow-x: clip; }
::selection { background: #00FF00; color: #0B1140; }
```
`overflow-x: clip` (not `hidden`) is still the safe choice — the marquee/parallax can push a hair
wide, and `hidden` would turn the page into a scroll container, which interferes with scroll math.

### 3b. Wrap the app in smooth scroll (`app/layout.tsx`)
```tsx
import SmoothScroll from '@/components/scroll/SmoothScroll';
// ...
<body className={mono.variable}>
  <SmoothScroll>{children}</SmoothScroll>
</body>
```
That's the whole Lenis setup — `SmoothScroll` drives Lenis from GSAP's ticker and keeps
ScrollTrigger in sync, so the pinned/scrubbed sections feel silky instead of stepped. It falls back
to native scrolling for `prefers-reduced-motion`. For anchor links use `useLenis().scrollTo('#id')`
(see the note at the bottom of `SmoothScroll.tsx`) rather than hash jumps.

### 4. Fonts
Headlines/body: **Helvetica Neue / Helvetica / Arial** (system — matches the reference). Kickers and
labels: **Space Mono** via `next/font/google`:
```tsx
import { Space_Mono } from 'next/font/google';
const mono = Space_Mono({ subsets: ['latin'], weight: ['400','700'], variable: '--font-mono' });
```
The components reference `"Space Mono"` by name in the Tailwind `font-mono` token — wiring
`--font-mono` above makes `font-mono` resolve to it.

### 5. Styling: Tailwind
The components are written in **Tailwind** using four namespaced brand tokens. Merge
`tailwind.config.snippet.ts` into your `tailwind.config.ts` `theme.extend` to get:
`bg-acid` `text-acid` (`#00FF00`), `bg-navy` (`#121B54`), `bg-deep` (`#0B1140`), `text-paper`
(`#F2F3FA`), plus `font-display` and `font-mono`. A handful of one-off values (the `clamp()` type
sizes, the hero gradient, the `0.18em` ampersand gap) use Tailwind arbitrary values — keep or move to
tokens as you prefer. Components that take visual styling expose a `className` prop (`Marquee`,
`MagneticButton`, `Parallax`, `Reveal`) so you can restyle without forking them.

### 6. Use them
See `example/ExamplePage.tsx`. Render it as a page (or lift the sections into your own layout).

---

## How the GSAP integration is wired (important)

- **`lib/gsap.ts`** registers `ScrollTrigger` + `useGSAP` **once** and re-exports them. Always import
  GSAP from there so registration can't be duplicated or missed.
- Every animated component sets up inside **`useGSAP(() => {...}, { scope: ref })`** (from
  `@gsap/react`). `useGSAP` runs in `useLayoutEffect`, auto-reverts all animations/triggers created
  in scope on unmount, and is **StrictMode- and HMR-safe** — no leaked triggers in dev.
- **Responsive + reduced motion** is handled with **`gsap.matchMedia()`**: desktop gets the full
  pinned experience; `(max-width: 767px)` and `(prefers-reduced-motion: reduce)` get static
  fallbacks. matchMedia auto-reverts when a query stops matching, so resizing across the breakpoint
  Just Works.
- **`invalidateOnRefresh: true`** on the pinned triggers recomputes pin distances on resize/font
  load (functional `end`/`x` values, e.g. `end: () => '+=' + dist`).

### Refresh after async content loads
Pin math depends on layout. If fonts or above-the-fold images shift things after mount, call once:
```ts
import { ScrollTrigger } from '@/lib/gsap';
useGSAP(() => {
  const onLoad = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(onLoad);
  window.addEventListener('load', onLoad);
  return () => window.removeEventListener('load', onLoad);
});
```
If you add a smooth-scroll lib (below), wire its `scroll` event to `ScrollTrigger.update` and call
`refresh()` — that's the only integration step.

---

## Component reference
- **`Parallax`** — `speed` 0..1 (negative = drifts up). Wrap any layer.
- **`Marquee`** — `items: ReactNode[]`, `direction` ±1. Vanilla; speed = base + decaying scroll
  velocity.
- **`KineticPairs`** — `pairs: [string,string][]`. Pins for `pairs.length × 100vh`; snaps to each
  fully-revealed pair.
- **`HorizontalGallery`** — `children` (fixed-width cards) + optional `heading`. Pins and scrubs
  sideways by the exact overflow width; native swipe scroller on mobile.
- **`CountUp`** — `to`, optional `prefix`/`suffix`, `duration` (seconds).
- **`Reveal`** — `lines: ReactNode[]`, staggered mask-up on enter.
- **`StickyServices`** — `media[]` + `blocks[]`; pins the media column, swaps to match the block at
  center.
- **`MagneticButton`** — `strength` 0..1; vanilla cursor follow.
- **`SmoothScroll`** — app-wide Lenis + GSAP ticker provider; wrap once in `layout.tsx`.
- **`useReducedMotion`** — helper if you want to gate the vanilla effects too.

---

## Mobile tuning (what the components already do, + what to check)

Pinned + horizontal-scroll layouts are the heaviest things on small screens, so each component
already degrades on `(max-width: 767px)` **and** `(prefers-reduced-motion: reduce)`:

- **KineticPairs** — drops the pin entirely on mobile and renders the pairs as a **stacked,
  flowing list** (not the absolute overlay). The switch is CSS-only via a `data-animated` flag the
  desktop branch sets, so there's no layout race.
- **HorizontalGallery** — becomes a **native horizontal swipe scroller with scroll-snap** on mobile
  (no pin, no hijacked scroll). Cards in the example are `w-[82vw] snap-start` so one-and-a-bit
  cards show at a time — the natural mobile pattern.
- **StickyServices** — collapses from two pinned columns to a **single stacked column** where each
  service's media sits directly above its text. It's rendered as a separate `md:hidden` tree so the
  GSAP pin refs never point at a `display:none` element.
- **Parallax / Marquee / magnetic** — parallax is disabled under reduced-motion; the marquee keeps
  its gentle auto-scroll (cheap); magnetic does nothing on touch (no hover) which is correct.

Things to verify on a real device (quick pass, ~10 min):
1. **No horizontal page scroll.** Confirm `overflow-x: clip` on `body` and that the marquee row
   isn't forcing width. (Biggest mobile gotcha.)
2. **iOS Safari address-bar resize.** `100vh` jumps when the bar hides/shows. If pinned sections
   feel like they "snap," switch the relevant heights to `100svh` / `100dvh`. ScrollTrigger's
   `invalidateOnRefresh` already recomputes pin distance on resize.
3. **Type scale.** The `clamp()` minimums are tuned for ~360px; bump the lower bound if headings
   feel tight on the smallest phones.
4. **Touch + Lenis.** `SmoothScroll` leaves touch scrolling native by default (best feel). If you
   ever enable `syncTouch`, re-test momentum on the horizontal gallery.
5. **Tap targets** on the CTA / nav ≥ 44px — the magnetic button is well over; just check nav.

---

## Design tokens

**Colors**
| Token | Hex |
|---|---|
| Green (accent) | `#00FF00` |
| Navy (bg) | `#121B54` |
| Deep navy | `#0B1140` |
| Paper (text) | `#F2F3FA` |
| Hairline | `rgba(255,255,255,0.16)` |
| Placeholder stripes | `repeating-linear-gradient(125deg,#1b2670 0 16px,#16205f 16px 32px)` |

**Type** — Display: Helvetica Neue, **800**, uppercase, `letter-spacing -0.03em`, `line-height
0.9–0.95`, sizes via `clamp()`. Kicker/label: Space Mono, 13–15px, `letter-spacing 0.16–0.2em`,
uppercase. Body: Helvetica, 18px, `line-height 1.6`, `rgba(255,255,255,0.7)`.

**Motion** — pinned scrub `1`; kinetic enter/exit `0.4` + hold `0.3` (timeline units); reveal `0.8s`
`power3.out`, stagger `0.09`; count-up `1.6s` `power2.out`; image swap `opacity .5s`; magnetic
`0.2s cubic-bezier(.16,1,.3,1)`.

---

## Gotchas
1. **Always import GSAP from `lib/gsap.ts`**, never directly, so the plugin is registered.
2. **`overflow-x: clip`, not `hidden`**, on `body` / section wrappers (GSAP pinning is fine either
   way, but `hidden` still bites the marquee/parallax scroll math).
3. **`'use client'`** on every animated component (they touch the DOM) — already set.
4. Don't read `window` during render; all measurement is inside `useGSAP`.
5. Stacking many pins on one page is fine with ScrollTrigger, but keep an eye on mobile — the
   `matchMedia` fallbacks already drop pinning under 768px.

## Optional next level
- **SplitText** (now free with GSAP) for per-character/word headline reveals if you want the
  manifesto or hero to go bigger.
- **`gsap.ticker.fps()`** / Lenis `lerp` & `duration` are the two knobs for tuning how heavy the
  smoothing feels — start with `duration: 1.1` and adjust to taste.

## Files
- `lib/gsap.ts` — plugin registration + re-exports.
- `tailwind.config.snippet.ts` — brand tokens (`acid`/`navy`/`deep`/`paper`, `font-display`/`font-mono`) to merge into your config.
- `components/` — the React/TS port (GSAP + vanilla + `SmoothScroll`, Tailwind, one file per effect).
- `example/ExamplePage.tsx` — full assembly.
- `reference/Scroll Demo.dc.html` — original prototype.
