# Bicycle motion & choreography pass — design spec

Date: 2026-07-06
Status: approved (design), pending spec review
Owner: Matt West

## 1. Background

The reference site [tinywins.com](https://www.tinywins.com) feels markedly more alive
than the current Bicycle build, so I analysed both stacks. They are near-identical:
Next.js + Sanity + Lenis on both sides. The only engine difference is that tinywins
uses Motion (`motion.dev`) where Bicycle uses GSAP + ScrollTrigger, and for
scroll-scrubbed, pinned choreography GSAP is the stronger tool. Bicycle already ships
a capable motion toolkit (`MaskReveal`, `Parallax`, `Marquee`, `ScrollFillText`,
`MagneticButton`, pinned sections, a page-enter transition, film grain, count-up, Mux
video backgrounds).

Conclusion: the gap is not a library gap. It is a **design-language and choreography
gap**. tinywins wins on type confidence, palette restraint, and a few big motion
moments rather than many small ones. This pass closes that gap using the toolkit
already in the repo, with no new dependencies.

## 2. Goals

- Apply tinywins-grade motion and choreography across the whole site.
- Push type scale, layout confidence and whitespace, while keeping Bicycle's existing
  brand (palette, logo, fonts) unchanged.
- Do it as one coherent **shared motion system**, so per-page work is composition, not
  23 bespoke implementations.
- Preserve every existing accessibility and performance guarantee.

## 3. Non-goals

- No rebrand. Palette (`--color-brand #00ff00`, `--color-navy #08124d`,
  `--color-electric #0100ff`), Raleway/Hanken/Space Mono, and the logo stay exactly
  as they are. The full brand relaunch remains a later, separate project.
- No new runtime dependencies. Everything is built on the existing GSAP + Lenis stack.
- No new CMS content model changes.

## 4. Constraints (carried from AGENTS.md / house conventions)

- All motion gated by `gsap.matchMedia()`; every effect fails open (visible, static)
  under `prefers-reduced-motion: reduce`.
- Pins/parallax fall back to static under `(max-width: 767px)`.
- `html`/`body` keep `overflow-x: clip`; new horizontal tracks must not force
  horizontal scroll.
- No transform on the route-template wrapper: a transform there becomes the containing
  block for `position: fixed` and breaks ScrollTrigger pinning (already documented in
  `globals.css`). The page transition curtain must be an independent `fixed` sibling.
- Lenis is driven off the single GSAP ticker (`smooth-scroll.tsx`); new ScrollTriggers
  hook that same loop, never a second RAF for scroll.
- UK English. First-person-singular voice in any copy. No em dashes.

## 5. Architecture: the motion system layer

A thin layer on top of the current toolkit, in three parts.

### 5.1 Global providers (mounted once in the root layout)

- **`CustomCursor`** (`src/components/cursor/custom-cursor.tsx`)
  - A dot that eases toward the pointer via `gsap.quickTo`. Grows into a ring and
    shows a label driven by a `data-cursor` attribute on the hovered target
    (`data-cursor="View"`, `"Play"`, `"Drag"`, `"→"`).
  - Brand-green fill, `mix-blend-mode` so it reads on both navy and paper.
  - Disabled entirely on `(pointer: coarse)` / touch and under reduced motion; the
    native cursor returns. Labels are `aria-hidden`. Never alters focus-visible or
    tab order.
  - A tiny helper prop/attribute convention so any element can opt in
    (`data-cursor="View"`), including `MagneticButton`, work cards and video.
- **`PageTransition`** (`src/components/transition/page-transition.tsx`)
  - Replaces the opacity-only `.page-enter` with a brand curtain wipe.
  - Implemented as a `fixed`, full-viewport overlay that transform-animates on its own
    (wipe in on navigation start, out on new content ready). It is a sibling of the
    page content, never an ancestor, so pinning is unaffected.
  - Content wrapper (`(site)/template.tsx`) stays opacity-only.
  - Reduced motion: instant, no wipe.
- **`ScrollProgress`** (`src/components/scroll/scroll-progress.tsx`)
  - A thin brand line fixed at the top, width bound to document scroll progress via a
    single ScrollTrigger. Hidden under reduced motion or rendered static.

### 5.2 Shared choreography primitives (new composable components)

- **`SplitReveal`** (`src/components/scroll/split-reveal.tsx`)
  - Per-word and per-character reveal for the largest display headings (finer-grained
    than the per-line `MaskReveal`). Options: `by="word" | "char"`, `stagger`,
    `scrub?`. Splits text in the DOM, wraps in masked spans, animates on enter or
    scrubbed. Fails open (full text, no split) under reduced motion. Preserves real
    heading semantics via an `as` prop, like `MaskReveal`.
- **`HeroScene`** (`src/components/scroll/hero-scene.tsx`)
  - Wraps a hero region, pins it briefly, and exposes scroll-linked transforms to its
    children (headline tracking/parallax, a velocity input for reactive elements such
    as the ampersand wheel, and a hand-off as the next section arrives).
  - Home uses it to elevate the existing `HeroFusion` signature (wheel reacts to
    scroll velocity, lines pin then release). Inner-page heroes reuse it in a simpler
    configuration.
- **`StickyStack`** (`src/components/scroll/sticky-stack.tsx`)
  - Pinned cards that stack, offset and scale as you scroll through them. Used for
    Selected work and Testimonials, and available to service pages.
- **`HoverRevealCard`** (`src/components/work/hover-reveal-card.tsx`, or an enhancement
  of `WorkGrid`)
  - Work/case-study card hover: image scale/clip reveal plus the cursor's "View"
    label via `data-cursor`. Enhances the existing `WorkGrid`/`work-grid.tsx` rather
    than replacing it.

### 5.3 Reused as-is (wired into the system, not rebuilt)

`Parallax`, `Marquee` (with `velocity`), `ScrollFillText`, `MagneticButton`,
`Reveal`, `MaskReveal`, `CountUp`, `Grain`, `MuxBg`. These get `data-cursor` hooks and
larger type where relevant, but keep their current internals.

## 6. Type & layout pass (same brand)

- Increase `display` clamps site-wide for heroes and section headings; widen
  whitespace; lean into asymmetric 12-column grids. No palette or font change.
- Convert the home "Media & Creative / Art & Science / …" stacked statement into an
  **oversized, scroll-scrubbed wordmark moment** using `SplitReveal` (`by="word"`,
  scrubbed), the Bicycle-owned equivalent of the tinywins wordmark section.
- Keep the "live" green pulse-dot language for eyebrows; do not introduce tinywins'
  red accent (palette stays Bicycle).

## 7. Per-page application map

All 23 `(site)` routes. Legal pages get global systems only.

| Route | Choreography |
|---|---|
| `/` (home) | `HeroScene` on `HeroFusion` (elevated signature), scrubbed AND wordmark, `HoverRevealCard` work grid, `StickyStack` testimonials, `SplitReveal` on the services index, existing stats count-up |
| `/work` | `SplitReveal` hero, hover-reveal grid, parallax feature imagery |
| `/work/[slug]` | `SplitReveal` hero, sticky/parallax gallery, reading rhythm reveals |
| `/bicycle` | `HeroScene`, sticky feature panels |
| `/bicycle-blade`, `/bicycle-ripple`, `/bicycle-studio` | `HeroScene` + `StickyStack` feature panels, per-unit accent |
| `/about` | `SplitReveal` headings, parallax, sticky stats |
| `/purpose` | `SplitReveal` headings, parallax, B-Corp/values reveals |
| `/international` | `SplitReveal` headings, parallax, sticky stats |
| `/the-peloton` | team `HoverRevealCard`, `SplitReveal` |
| `/careers` | values `Marquee`, `SplitReveal`, hover reveals |
| `/careers/values`, `/careers/benefits`, `/careers/diversity` | `SplitReveal` headings, reveals |
| `/careers/[slug]`, `/careers/team/[slug]` | `SplitReveal` hero, reveals |
| `/slipstream` | reveal grid, parallax hero |
| `/slipstream/[slug]` | parallax hero, article reading-progress bar |
| `/contact-us` | `SplitReveal` heading, magnetic CTA, form untouched functionally |
| `/cookie-policy`, `/privacy-policy`, `/modern-slavery` | global cursor + transition only |

## 8. Cross-cutting rules

- Reduced motion: every new component fails open. Cursor, curtain and progress bar all
  no-op.
- Mobile (<768px): pins and parallax static; cursor disabled on coarse pointers.
- Performance: hero LCP text stays server-rendered; primitives lazy-init in
  `useGSAP`; `will-change` applied only during active animation; no second scroll RAF.
- Accessibility: labels `aria-hidden`; focus-visible, skip-link and keyboard order
  unchanged; `data-cursor` is presentational only.
- One ticker: all new ScrollTriggers ride the existing GSAP/Lenis loop.

## 9. File plan

New:

```
src/components/cursor/custom-cursor.tsx
src/components/transition/page-transition.tsx
src/components/scroll/scroll-progress.tsx
src/components/scroll/split-reveal.tsx
src/components/scroll/hero-scene.tsx
src/components/scroll/sticky-stack.tsx
src/components/work/hover-reveal-card.tsx   (or WorkGrid enhancement)
```

Edited:

```
src/app/layout.tsx            (mount CustomCursor, PageTransition, ScrollProgress)
src/app/(site)/template.tsx   (coordinate with curtain; stays opacity-only)
src/app/globals.css           (cursor base styles, curtain, progress; larger clamps)
src/app/(site)/page.tsx       (compose home choreography)
+ each route page.tsx per the map in section 7
src/components/work-grid.tsx  (hover reveal + data-cursor)
src/components/hero-fusion.tsx(scroll-velocity input via HeroScene)
```

## 10. Testing & verification

- `npm run build` and `npm run typecheck` clean before pushing.
- Playwright desktop + mobile pass over home and one of each page archetype
  (index, detail, service, legal): no console errors, no horizontal scrollbar, cursor
  hidden on touch emulation.
- Manual reduced-motion pass (emulate `prefers-reduced-motion: reduce`): all content
  visible and static, cursor native, no curtain.
- Preview deploy reviewed before merge.

## 11. Delivery sequence

Even though this spec covers all 23 routes, delivery is sequenced so the feel can be
judged early:

1. Global systems (cursor, transition curtain, scroll progress) + the shared
   primitives (`SplitReveal`, `HeroScene`, `StickyStack`, `HoverRevealCard`).
2. Home page fully choreographed on a preview deploy for sign-off.
3. Roll the proven patterns out across the remaining routes per section 7.
4. Full verification pass, then merge/push.

## 12. Risks

- Pinning vs the transition curtain: mitigated by making the curtain a `fixed` sibling,
  never an ancestor transform.
- Cursor performance on low-end devices: mitigated by `quickTo` (single transform),
  coarse-pointer opt-out, and reduced-motion opt-out.
- Whole-site scope is large: mitigated by the shared-system architecture and the staged
  delivery in section 11.
