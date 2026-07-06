# Motion System Foundation + Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared motion system (custom cursor, page-transition curtain, scroll progress, and the reusable scroll primitives) and apply it to the home page, so the tinywins-grade feel can be judged on a preview deploy.

**Architecture:** A thin motion-system layer on top of the existing GSAP + Lenis toolkit. Pure logic lives in small `.ts` helpers (unit-tested in node/vitest); the visual/GSAP layer lives in `"use client"` `.tsx` components that consume those helpers and are verified with Playwright + a reduced-motion pass. Global providers mount once in `(site)/layout.tsx`; the home page composes the primitives.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger (`@/lib/gsap`), `@gsap/react` `useGSAP`, Lenis (`smooth-scroll.tsx`), Vitest (node env).

## Global Constraints

- No new runtime dependencies. Build only on GSAP, `@gsap/react`, Lenis, Tailwind v4.
- Import GSAP only from `@/lib/gsap` (`import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"`). Never register plugins elsewhere.
- Every effect gated by `gsap.matchMedia()` and fails open (content visible, static) under `prefers-reduced-motion: reduce`.
- Pins/parallax fall back to static under `(max-width: 767px)` via `gsap.matchMedia()`.
- No transform on `(site)/template.tsx` or any ancestor of pinned content: a transform there becomes the containing block for `position: fixed` and breaks ScrollTrigger pinning. The transition curtain is a `fixed` sibling that transform-animates on its own.
- New scroll work rides the existing GSAP ticker (see `smooth-scroll.tsx`); never start a second scroll RAF.
- `html`/`body` keep `overflow-x: clip`; no new track may force horizontal scroll.
- Brand unchanged: `--color-brand #00ff00`, `--color-navy #08124d`, `--color-electric #0100ff`, Raleway/Hanken/Space Mono. No palette or font change.
- Cursor labels are `aria-hidden`; focus-visible, skip-link and keyboard tab order stay untouched. Cursor disabled on `(pointer: coarse)`.
- Vitest: tests are `.ts` files under `src/`, `environment: "node"`, run with `npm test`. Test only pure logic; no DOM/React rendering tests.
- UK English. First-person-singular voice in any copy. No em dashes.

---

## File structure

New pure helpers (unit-tested):
```
src/components/cursor/cursor-label.ts          resolveCursorState()
src/components/scroll/progress-math.ts         scrollFraction()
src/components/scroll/split-text.ts            splitToTokens()
src/components/scroll/stack-math.ts            stackTransform()
src/components/scroll/velocity.ts              accumulateBoost()
```

New client components:
```
src/components/cursor/custom-cursor.tsx        CustomCursor
src/components/transition/page-transition.tsx  PageTransition
src/components/scroll/scroll-progress.tsx      ScrollProgress
src/components/scroll/split-reveal.tsx         SplitReveal
src/components/scroll/hero-scene.tsx           HeroScene
src/components/scroll/sticky-stack.tsx         StickyStack
```

Modified:
```
src/app/(site)/layout.tsx      mount CustomCursor, PageTransition, ScrollProgress
src/app/globals.css            cursor hide, curtain, progress styles, larger clamps
src/components/hero-fusion.tsx accept scroll-velocity input
src/components/work-grid.tsx   hover reveal + data-cursor="View"
src/app/(site)/page.tsx        compose home choreography
```

---

## Task 1: Cursor state helper

**Files:**
- Create: `src/components/cursor/cursor-label.ts`
- Test: `src/components/cursor/cursor-label.test.ts`

**Interfaces:**
- Produces: `resolveCursorState(el: Element | null): CursorState` where `type CursorState = { variant: "dot" | "ring" | "label"; label: string }`. Walks up from `el` via `closest("[data-cursor]")`; the attribute value is the label. Empty value or `"ring"` gives the ring variant with no text; any other non-empty value is a label; no match is the plain dot.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/cursor/cursor-label.test.ts
import { describe, it, expect } from "vitest";
import { resolveCursorState } from "./cursor-label";

function el(attr?: string) {
  return {
    closest: (sel: string) =>
      sel === "[data-cursor]" && attr !== undefined
        ? { getAttribute: () => attr }
        : null,
  } as unknown as Element;
}

describe("resolveCursorState", () => {
  it("returns the plain dot when nothing opts in", () => {
    expect(resolveCursorState(el())).toEqual({ variant: "dot", label: "" });
  });
  it("returns a label variant for a worded attribute", () => {
    expect(resolveCursorState(el("View"))).toEqual({ variant: "label", label: "View" });
  });
  it("returns a ring for an empty or 'ring' attribute", () => {
    expect(resolveCursorState(el(""))).toEqual({ variant: "ring", label: "" });
    expect(resolveCursorState(el("ring"))).toEqual({ variant: "ring", label: "" });
  });
  it("returns the plain dot for a null element", () => {
    expect(resolveCursorState(null)).toEqual({ variant: "dot", label: "" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- cursor-label`
Expected: FAIL, `resolveCursorState is not a function` / module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/cursor/cursor-label.ts
export type CursorState = {
  variant: "dot" | "ring" | "label";
  label: string;
};

/**
 * Resolve the cursor's visual state from the element under the pointer.
 * Any ancestor carrying `data-cursor` opts in: an empty value (or "ring")
 * grows the dot into a ring; any other value shows that word as a label.
 */
export function resolveCursorState(el: Element | null): CursorState {
  const target = el?.closest("[data-cursor]");
  if (!target) return { variant: "dot", label: "" };
  const value = (target.getAttribute("data-cursor") ?? "").trim();
  if (value === "" || value.toLowerCase() === "ring") {
    return { variant: "ring", label: "" };
  }
  return { variant: "label", label: value };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- cursor-label`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/cursor/cursor-label.ts src/components/cursor/cursor-label.test.ts
git commit -m "Add cursor state resolver for the contextual custom cursor"
```

---

## Task 2: CustomCursor component + mount

**Files:**
- Create: `src/components/cursor/custom-cursor.tsx`
- Modify: `src/app/(site)/layout.tsx`
- Modify: `src/app/globals.css` (hide native cursor when custom cursor is active)

**Interfaces:**
- Consumes: `resolveCursorState` from Task 1; `gsap` from `@/lib/gsap`; `usePrefersReducedMotion` from `@/lib/use-prefers-reduced-motion`.
- Produces: `<CursorState>`-driven overlay. No exported API beyond the `CustomCursor` component. Opt-in convention for the rest of the app: put `data-cursor="View"` (or `"Play"`, `"Drag"`, `"→"`, `""`/`"ring"`) on any element.

- [ ] **Step 1: Write the component**

```tsx
// src/components/cursor/custom-cursor.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { resolveCursorState, type CursorState } from "./cursor-label";

/**
 * Contextual custom cursor. A dot eases toward the pointer; over any element
 * carrying `data-cursor` it grows to a ring and can show a word. Disabled on
 * coarse pointers and under reduced motion (native cursor returns). The label
 * is decorative (aria-hidden) and never affects focus or tab order.
 */
export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({ variant: "dot", label: "" });

  // Only enable on fine pointers with motion allowed. Checked on the client.
  useEffect(() => {
    if (reduced) return setEnabled(false);
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;
    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      // Throttle state resolution to one per frame.
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setState(resolveCursorState(document.elementFromPoint(e.clientX, e.clientY)));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.classList.add("has-custom-cursor");
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  const scale = state.variant === "dot" ? 1 : state.label ? 3.4 : 2.4;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-brand text-[0.6rem] font-bold uppercase tracking-[0.14em] text-black transition-[width,height] duration-300 ease-out"
        style={{
          width: state.label ? "4.5rem" : "0.75rem",
          height: state.label ? "4.5rem" : "0.75rem",
          transform: state.label ? "none" : `scale(${scale})`,
        }}
      >
        {state.label}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the site layout**

In `src/app/(site)/layout.tsx`, add the import and render it just inside the fragment (before `JsonLd` is fine):

```tsx
import { CustomCursor } from "@/components/cursor/custom-cursor";
```

```tsx
  return (
    <>
      <CustomCursor />
      <JsonLd data={organisationSchema} />
```

- [ ] **Step 3: Hide the native cursor when active**

Append to `src/app/globals.css`:

```css
/* Custom cursor: hide the native pointer only when the JS cursor is mounted
   (fine pointer + motion allowed). Never hides it under reduced motion/touch,
   because the class is only added then. */
.has-custom-cursor,
.has-custom-cursor a,
.has-custom-cursor button,
.has-custom-cursor [data-cursor] {
  cursor: none;
}
```

- [ ] **Step 4: Build check**

Run: `npm run typecheck && npm run build`
Expected: no type errors; build succeeds.

- [ ] **Step 5: Playwright smoke (desktop)**

Run a Playwright check against `npm run dev` (or the preview): navigate to `/`, move the pointer, assert an element with class `has-custom-cursor` exists on `<html>` and a `z-[200]` fixed element is present. Emulate `(pointer: coarse)` and assert the cursor element is absent.
Expected: cursor present on fine pointer, absent on coarse.

- [ ] **Step 6: Commit**

```bash
git add src/components/cursor/custom-cursor.tsx "src/app/(site)/layout.tsx" src/app/globals.css
git commit -m "Add contextual custom cursor and mount it site-wide"
```

---

## Task 3: Scroll progress helper + bar

**Files:**
- Create: `src/components/scroll/progress-math.ts`
- Create: `src/components/scroll/progress-math.test.ts`
- Create: `src/components/scroll/scroll-progress.tsx`
- Modify: `src/app/(site)/layout.tsx`

**Interfaces:**
- Produces: `scrollFraction(scrollTop: number, scrollHeight: number, viewport: number): number` returning a value clamped to `[0, 1]` (`scrollHeight - viewport <= 0` returns `0`). Consumed by `ScrollProgress`.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/scroll/progress-math.test.ts
import { describe, it, expect } from "vitest";
import { scrollFraction } from "./progress-math";

describe("scrollFraction", () => {
  it("is 0 at the top", () => {
    expect(scrollFraction(0, 2000, 800)).toBe(0);
  });
  it("is 1 at the bottom", () => {
    expect(scrollFraction(1200, 2000, 800)).toBe(1);
  });
  it("is 0.5 halfway", () => {
    expect(scrollFraction(600, 2000, 800)).toBeCloseTo(0.5);
  });
  it("clamps and avoids divide-by-zero for short pages", () => {
    expect(scrollFraction(50, 700, 800)).toBe(0);
    expect(scrollFraction(9999, 2000, 800)).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- progress-math`
Expected: FAIL, module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/scroll/progress-math.ts
/** Fraction of the page scrolled, clamped to [0,1]. Short pages return 0. */
export function scrollFraction(
  scrollTop: number,
  scrollHeight: number,
  viewport: number,
): number {
  const scrollable = scrollHeight - viewport;
  if (scrollable <= 0) return 0;
  const f = scrollTop / scrollable;
  return f < 0 ? 0 : f > 1 ? 1 : f;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- progress-math`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the component**

```tsx
// src/components/scroll/scroll-progress.tsx
"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Thin brand line at the very top, scaled by scroll progress. Rides
 * ScrollTrigger (same loop as Lenis). Reduced motion: matchMedia simply never
 * adds the trigger, so the bar stays at 0 width and is visually inert.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => gsap.set(ref.current, { scaleX: self.progress }),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed left-0 top-0 z-[150] h-[3px] w-full bg-brand"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
```

- [ ] **Step 6: Mount it in the site layout**

```tsx
import { ScrollProgress } from "@/components/scroll/scroll-progress";
```

```tsx
      <CustomCursor />
      <ScrollProgress />
      <JsonLd data={organisationSchema} />
```

- [ ] **Step 7: Build + verify**

Run: `npm run typecheck && npm run build`
Expected: passes. Manually (or via Playwright) scroll `/` and confirm the top bar grows left-to-right; under emulated reduced motion it stays empty.

- [ ] **Step 8: Commit**

```bash
git add src/components/scroll/progress-math.ts src/components/scroll/progress-math.test.ts src/components/scroll/scroll-progress.tsx "src/app/(site)/layout.tsx"
git commit -m "Add scroll-progress bar"
```

---

## Task 4: Page transition curtain

**Files:**
- Create: `src/components/transition/page-transition.tsx`
- Modify: `src/app/(site)/layout.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation`; `gsap` from `@/lib/gsap`.
- Produces: `PageTransition` — a `fixed` curtain overlay (sibling of content, never an ancestor) that wipes across on pathname change. No exported API. `(site)/template.tsx` stays opacity-only and is not modified.

- [ ] **Step 1: Write the component**

```tsx
// src/components/transition/page-transition.tsx
"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Brand curtain wipe on navigation. A fixed full-viewport panel sweeps up and
 * off whenever the pathname changes. It is a sibling of the page content (never
 * an ancestor), so its transform cannot become the containing block for pinned
 * (position: fixed) ScrollTrigger sections. Reduced motion: the panel is never
 * shown (matchMedia gate), so navigation is instant.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline()
          .set(ref.current, { yPercent: 0, display: "block" })
          .to(ref.current, { yPercent: -100, duration: 0.55, ease: "power4.inOut" })
          .set(ref.current, { display: "none" });
      });
      return () => mm.revert();
    },
    { dependencies: [pathname] },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[180] bg-brand"
      style={{ display: "none" }}
    />
  );
}
```

- [ ] **Step 2: Mount it in the site layout**

```tsx
import { PageTransition } from "@/components/transition/page-transition";
```

```tsx
      <CustomCursor />
      <ScrollProgress />
      <PageTransition />
      <JsonLd data={organisationSchema} />
```

- [ ] **Step 3: Build + verify pinning is intact**

Run: `npm run typecheck && npm run build`
Expected: passes. Via Playwright/manual: navigate between `/` and `/work`, confirm the green curtain sweeps up on each navigation, then confirm any pinned/scroll-scrubbed section on `/` still pins correctly (regression check for the containing-block rule). Under reduced motion, navigation shows no curtain.

- [ ] **Step 4: Commit**

```bash
git add src/components/transition/page-transition.tsx "src/app/(site)/layout.tsx"
git commit -m "Replace the page fade with a brand curtain-wipe transition"
```

---

## Task 5: Split-text helper + SplitReveal

**Files:**
- Create: `src/components/scroll/split-text.ts`
- Create: `src/components/scroll/split-text.test.ts`
- Create: `src/components/scroll/split-reveal.tsx`

**Interfaces:**
- Produces: `splitToTokens(text: string, by: "word" | "char"): Token[]` where `type Token = { text: string; space: boolean }`. For `word`, whitespace runs become `space: true` tokens preserved between words. For `char`, each non-space character is its own token and each space is a `space: true` token. Consumed by `SplitReveal`.
- Produces: `SplitReveal` component: `{ text: string; by?: "word" | "char"; as?: ElementType; className?: string; stagger?: number; scrub?: boolean }`.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/scroll/split-text.test.ts
import { describe, it, expect } from "vitest";
import { splitToTokens } from "./split-text";

describe("splitToTokens", () => {
  it("splits words and preserves the spaces between them", () => {
    expect(splitToTokens("Power of and", "word")).toEqual([
      { text: "Power", space: false },
      { text: " ", space: true },
      { text: "of", space: false },
      { text: " ", space: true },
      { text: "and", space: false },
    ]);
  });
  it("splits characters and marks spaces", () => {
    expect(splitToTokens("a b", "char")).toEqual([
      { text: "a", space: false },
      { text: " ", space: true },
      { text: "b", space: false },
    ]);
  });
  it("returns an empty array for an empty string", () => {
    expect(splitToTokens("", "word")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- split-text`
Expected: FAIL, module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/scroll/split-text.ts
export type Token = { text: string; space: boolean };

/**
 * Tokenise text for staggered reveals. Whitespace is preserved as its own
 * token so word spacing survives when each token becomes an inline-block.
 */
export function splitToTokens(text: string, by: "word" | "char"): Token[] {
  if (text.length === 0) return [];
  if (by === "word") {
    return text
      .split(/(\s+)/)
      .filter((p) => p.length > 0)
      .map((p) => ({ text: p, space: /^\s+$/.test(p) }));
  }
  return Array.from(text).map((ch) => ({ text: ch, space: /\s/.test(ch) }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- split-text`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the component**

```tsx
// src/components/scroll/split-reveal.tsx
"use client";
import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { splitToTokens } from "./split-text";

/**
 * Word- or character-level masked reveal for large display headings (finer
 * than the per-line MaskReveal). Each token rises from within an overflow-hidden
 * box. With `scrub`, the reveal is tied to scroll position; otherwise it plays
 * once on enter. Fails open under reduced motion (full text, no animation).
 * Renders a real element via `as` (e.g. "h2") with tokens as inline spans.
 */
export function SplitReveal({
  text,
  by = "word",
  as = "div",
  className = "display text-[clamp(40px,8vw,120px)] leading-[0.95]",
  stagger = 0.05,
  scrub = false,
}: {
  text: string;
  by?: "word" | "char";
  as?: ElementType;
  className?: string;
  stagger?: number;
  scrub?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as;
  const tokens = splitToTokens(text, by);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const spans = gsap.utils.toArray<HTMLElement>("[data-token] > span", ref.current!);
        gsap.from(spans, {
          yPercent: 115,
          duration: 0.8,
          ease: "power4.out",
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: scrub ? "bottom 55%" : undefined,
            scrub: scrub ? 0.5 : false,
            toggleActions: scrub ? undefined : "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {tokens.map((t, i) =>
        t.space ? (
          <span key={i} style={{ whiteSpace: "pre" }}>
            {t.text}
          </span>
        ) : (
          <span key={i} data-token className="inline-block overflow-hidden align-bottom">
            <span className="inline-block">{t.text}</span>
          </span>
        ),
      )}
    </Tag>
  );
}
```

- [ ] **Step 6: Build check**

Run: `npm run typecheck && npm run build`
Expected: passes.

- [ ] **Step 7: Commit**

```bash
git add src/components/scroll/split-text.ts src/components/scroll/split-text.test.ts src/components/scroll/split-reveal.tsx
git commit -m "Add SplitReveal word/char masked reveal primitive"
```

---

## Task 6: Velocity helper + HeroScene

**Files:**
- Create: `src/components/scroll/velocity.ts`
- Create: `src/components/scroll/velocity.test.ts`
- Create: `src/components/scroll/hero-scene.tsx`

**Interfaces:**
- Produces: `accumulateBoost(current: number, deltaY: number, opts?: { perPx?: number; cap?: number }): number` — adds `min(|deltaY|, 80) * perPx` to `current`, clamped to `cap` (defaults: `perPx 0.22`, `cap 16`). Same shape as the marquee's surge maths, extracted for reuse and testing.
- Produces: `HeroScene` component: `{ children: ReactNode; className?: string; onVelocity?: (boost: number) => void }`. Provides a pinned-ish scroll scene and reports a decaying scroll boost via `onVelocity` each frame (0 when idle). Reduced motion / mobile: renders children statically, never calls `onVelocity`.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/scroll/velocity.test.ts
import { describe, it, expect } from "vitest";
import { accumulateBoost } from "./velocity";

describe("accumulateBoost", () => {
  it("adds a scaled, per-event-capped amount", () => {
    expect(accumulateBoost(0, 100)).toBeCloseTo(80 * 0.22); // delta capped at 80
    expect(accumulateBoost(0, 10)).toBeCloseTo(10 * 0.22);
  });
  it("never exceeds the cap", () => {
    expect(accumulateBoost(15, 100)).toBe(16);
  });
  it("treats negative deltas by magnitude", () => {
    expect(accumulateBoost(0, -10)).toBeCloseTo(10 * 0.22);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- velocity`
Expected: FAIL, module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/scroll/velocity.ts
/**
 * Accumulate a scroll "boost" from how far the page jumped this event, capped
 * per event and overall. Callers bleed it off each frame (multiply by ~0.9) so
 * it always settles back to zero. Mirrors the marquee surge maths.
 */
export function accumulateBoost(
  current: number,
  deltaY: number,
  opts: { perPx?: number; cap?: number } = {},
): number {
  const perPx = opts.perPx ?? 0.22;
  const cap = opts.cap ?? 16;
  const next = current + Math.min(Math.abs(deltaY), 80) * perPx;
  return next > cap ? cap : next;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- velocity`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the component**

```tsx
// src/components/scroll/hero-scene.tsx
"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { accumulateBoost } from "./velocity";

/**
 * A hero region that reports a decaying scroll-velocity "boost" to its children
 * so signature elements (e.g. the ampersand wheel) can react to scroll speed.
 * The boost accumulates from wheel/scroll movement and bleeds off every frame.
 * Reduced motion / coarse pointer: children render statically, onVelocity is
 * never called. The subtle headline parallax is applied by the caller via the
 * existing Parallax component; HeroScene only supplies velocity.
 */
export function HeroScene({
  children,
  className = "",
  onVelocity,
}: {
  children: ReactNode;
  className?: string;
  onVelocity?: (boost: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const boost = useRef(0);

  useEffect(() => {
    if (!onVelocity) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        boost.current = accumulateBoost(boost.current, y - lastY);
        lastY = y;
      };
      const tick = () => {
        boost.current *= 0.9;
        onVelocity(boost.current);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      gsap.ticker.add(tick);
      return () => {
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
      };
    });
    return () => mm.revert();
  }, [onVelocity]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 6: Build check**

Run: `npm run typecheck && npm run build`
Expected: passes.

- [ ] **Step 7: Commit**

```bash
git add src/components/scroll/velocity.ts src/components/scroll/velocity.test.ts src/components/scroll/hero-scene.tsx
git commit -m "Add HeroScene scroll-velocity provider"
```

---

## Task 7: Stack math helper + StickyStack

**Files:**
- Create: `src/components/scroll/stack-math.ts`
- Create: `src/components/scroll/stack-math.test.ts`
- Create: `src/components/scroll/sticky-stack.tsx`

**Interfaces:**
- Produces: `stackTransform(index: number, count: number, progress: number): { scale: number; y: number }` — for a card at `index` of `count`, given overall scroll `progress` in `[0,1]`, returns the scale (earlier cards shrink slightly as later ones arrive) and a small y offset. Deterministic, pure.
- Produces: `StickyStack` component: `{ children: ReactNode[]; className?: string }` — pins the stack and applies `stackTransform` to each child on scroll. Reduced motion / mobile: children render as a normal stacked flow.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/scroll/stack-math.test.ts
import { describe, it, expect } from "vitest";
import { stackTransform } from "./stack-math";

describe("stackTransform", () => {
  it("leaves the last card at full scale, no offset", () => {
    const t = stackTransform(2, 3, 1);
    expect(t.scale).toBeCloseTo(1);
    expect(t.y).toBeCloseTo(0);
  });
  it("shrinks earlier cards as progress advances", () => {
    const early = stackTransform(0, 3, 1);
    expect(early.scale).toBeLessThan(1);
    expect(early.scale).toBeGreaterThan(0.8);
  });
  it("is identity at progress 0", () => {
    const t = stackTransform(0, 3, 0);
    expect(t.scale).toBeCloseTo(1);
    expect(t.y).toBeCloseTo(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- stack-math`
Expected: FAIL, module not found.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/components/scroll/stack-math.ts
/**
 * Transform for a card in a sticky stack. As overall progress advances, cards
 * earlier in the stack recede: they scale down a little and lift slightly, so
 * later cards appear to settle on top. The last card never moves.
 */
export function stackTransform(
  index: number,
  count: number,
  progress: number,
): { scale: number; y: number } {
  const fromEnd = count - 1 - index; // 0 for the last card
  const recede = Math.min(progress, 1) * fromEnd;
  return {
    scale: 1 - recede * 0.05,
    y: -recede * 8,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- stack-math`
Expected: PASS (3 tests).

- [ ] **Step 5: Write the component**

```tsx
// src/components/scroll/sticky-stack.tsx
"use client";
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { stackTransform } from "./stack-math";

/**
 * Cards that pin and stack: as you scroll the section, earlier cards recede
 * (scale/lift) while later cards settle on top. Reduced motion / mobile: the
 * cards render as an ordinary vertical flow (no pin, no transform).
 */
export function StickyStack({
  children,
  className = "",
}: {
  children: ReactNode[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const count = children.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", ref.current!);
        cards.forEach((c) => (c.style.position = "sticky"));
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            cards.forEach((c, i) => {
              const { scale, y } = stackTransform(i, count, self.progress);
              gsap.set(c, { scale, y });
            });
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          data-stack-card
          className="top-24 will-change-transform"
          style={{ transformOrigin: "center top" }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Build check**

Run: `npm run typecheck && npm run build`
Expected: passes.

- [ ] **Step 7: Commit**

```bash
git add src/components/scroll/stack-math.ts src/components/scroll/stack-math.test.ts src/components/scroll/sticky-stack.tsx
git commit -m "Add StickyStack pinned-stacking primitive"
```

---

## Task 8: Work grid hover reveal + cursor label

**Files:**
- Modify: `src/components/work-grid.tsx`

**Interfaces:**
- Consumes: the `data-cursor` convention from Task 2.
- Produces: no new exports. Each work card gains `data-cursor="View"` and an image scale/clip hover reveal via Tailwind group utilities (no JS), so it works under reduced motion too (transitions respect `motion-reduce`).

- [ ] **Step 1: Read the current file**

Read `src/components/work-grid.tsx` in full to find the card link/image markup and its existing `group`/hover classes.

- [ ] **Step 2: Add the cursor label and hover reveal**

On each card's root link element, add `data-cursor="View"`. Wrap the card image in an `overflow-hidden` container (if not already) and add a scale-on-hover to the image plus `motion-reduce:transform-none`:

```tsx
// On the card's <Link> (or <a>):
data-cursor="View"

// The image element (inside an overflow-hidden wrapper) gains:
className="... transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
```

Keep every existing class; only add these. Do not change the grid layout or data flow.

- [ ] **Step 3: Build + verify**

Run: `npm run typecheck && npm run build`
Expected: passes. Via Playwright/manual on `/work` and home Selected work: hovering a card scales its image within the frame and the cursor shows "View"; under reduced motion the image does not scale.

- [ ] **Step 4: Commit**

```bash
git add src/components/work-grid.tsx
git commit -m "Add hover image reveal and View cursor to work cards"
```

---

## Task 9: globals.css bolder type + base motion styles

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: a `.display-xl` helper for the biggest heroes/wordmark and a reduced-motion top-up covering the new fixed overlays. No behavioural change to existing helpers.

- [ ] **Step 1: Add a display-xl helper**

Append to `globals.css`:

```css
/* Oversized display for hero and wordmark moments (bolder-layout pass). */
.display-xl {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.02em;
  font-size: clamp(3rem, 11vw, 12rem);
}
```

- [ ] **Step 2: Extend the reduced-motion block**

In the existing `@media (prefers-reduced-motion: reduce)` rule, the new JS components already self-disable via matchMedia. No selector change is needed, but confirm the block still lists the CSS-animation classes. Leave as-is if nothing new uses a CSS keyframe.

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "Add display-xl helper for hero and wordmark moments"
```

---

## Task 10: Home hero — elevate the signature

**Files:**
- Modify: `src/components/hero-fusion.tsx`
- Modify: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `HeroScene` (Task 6), `accumulateBoost` behaviour via `HeroScene`'s `onVelocity`.
- Produces: `HeroFusion` accepts an optional imperative handle or prop to receive the scroll boost. Simplest approach: `HeroFusion` exposes `boostRef` via a prop `velocityRef?: React.MutableRefObject<number>`, and its ticker reads that ref to add rotation speed to the wheel.

- [ ] **Step 1: Give HeroFusion a velocity input**

In `src/components/hero-fusion.tsx`, add an optional prop and feed it into the wheel rotation. Replace the fixed-duration wheel spin with a ticker that adds base speed plus the current boost:

```tsx
export function HeroFusion({
  velocityRef,
}: {
  velocityRef?: React.MutableRefObject<number>;
} = {}) {
```

Inside the `no-preference` matchMedia branch, replace the `gsap.to(".hero-wheel", { rotation: 360, ... })` tween with a ticker-driven rotation:

```tsx
const wheel = root.current!.querySelector<SVGSVGElement>(".hero-wheel");
let rot = 0;
const spin = () => {
  const boost = velocityRef?.current ?? 0;
  rot += 0.35 + boost * 0.6; // deg per frame: idle cruise + scroll surge
  if (wheel) gsap.set(wheel, { rotation: rot, transformOrigin: "50% 50%" });
};
gsap.ticker.add(spin);
```

Add `gsap.ticker.remove(spin);` to the branch's returned cleanup. Keep the ampersand breathe tween, the entrance timeline, and the ticker cross-fade exactly as they are. Keep the reduced-motion branch unchanged.

- [ ] **Step 2: Wrap the home hero in HeroScene**

In `src/app/(site)/page.tsx`, import `HeroScene` and a ref, and drive `HeroFusion`. Because `page.tsx` is a Server Component, add a tiny client wrapper rather than using refs inline. Create it inline as a new component:

Create `src/components/home-hero.tsx`:

```tsx
// src/components/home-hero.tsx
"use client";
import { useRef } from "react";
import { HeroScene } from "@/components/scroll/hero-scene";
import { HeroFusion } from "@/components/hero-fusion";

/** Client wrapper: connects HeroScene's scroll velocity to the wheel. */
export function HomeHero() {
  const velocityRef = useRef(0);
  return (
    <HeroScene onVelocity={(b) => (velocityRef.current = b)}>
      <HeroFusion velocityRef={velocityRef} />
    </HeroScene>
  );
}
```

In `page.tsx`, replace `<HeroFusion />` with `<HomeHero />` and update the import (remove the direct `HeroFusion` import from `page.tsx`, add `HomeHero`).

- [ ] **Step 3: Build + verify**

Run: `npm run typecheck && npm run build`
Expected: passes. Via Playwright/manual: on `/`, the ampersand wheel turns steadily and visibly speeds up while scrolling, then eases back. Under reduced motion the wheel holds still (unchanged reduced-motion branch).

- [ ] **Step 4: Commit**

```bash
git add src/components/hero-fusion.tsx src/components/home-hero.tsx "src/app/(site)/page.tsx"
git commit -m "Make the hero ampersand wheel react to scroll velocity"
```

---

## Task 11: Home — scrubbed AND wordmark

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `SplitReveal` (Task 5), `.display-xl` (Task 9).
- Produces: the "Power of AND" stacked statement section becomes an oversized, scroll-scrubbed word reveal.

- [ ] **Step 1: Replace the MaskReveal statement block**

In `page.tsx`, the section currently rendering `<MaskReveal ... lines={ANDS.map(...)} />` becomes a stack of `SplitReveal` lines, one per pair, scrubbed and oversized. Replace that `MaskReveal` usage with:

```tsx
<div className="relative space-y-2">
  {ANDS.map(([a, b]) => (
    <SplitReveal
      key={a}
      as="h2"
      by="word"
      scrub
      className="display-xl text-center text-white"
      text={`${a} & ${b}`}
    />
  ))}
</div>
```

Add `import { SplitReveal } from "@/components/scroll/split-reveal";` and remove the now-unused `MaskReveal` import if nothing else on the page uses it (check first; keep it if still used elsewhere).

- [ ] **Step 2: Build + verify**

Run: `npm run typecheck && npm run build`
Expected: passes. Via Playwright/manual: scrolling through the AND section reveals each pair word-by-word tied to scroll; under reduced motion all pairs are fully visible and static.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "Turn the AND statement into an oversized scroll-scrubbed wordmark"
```

---

## Task 12: Home — sticky testimonials + bolder headings

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/components/testimonials.tsx` (only if needed to accept stacked children)

**Interfaces:**
- Consumes: `StickyStack` (Task 7), `SplitReveal` (Task 5).
- Produces: testimonials presented as a sticky stack; the "What we do" and "Selected work" headings use larger display type.

- [ ] **Step 1: Inspect testimonials**

Read `src/components/testimonials.tsx`. If it already maps items to cards, wrap those cards in `StickyStack` on the home page. If its internals are not composable, present the testimonials on home via `StickyStack` around the individual cards instead of the current `Testimonials` component; keep `Testimonials` for other pages.

- [ ] **Step 2: Apply the sticky stack on home**

In the testimonials section of `page.tsx`, render:

```tsx
<StickyStack className="mx-auto max-w-3xl">
  {testimonials.map((t) => (
    <blockquote
      key={t._id}
      className="rounded-[2rem] bg-navy p-10 text-white shadow-xl"
    >
      <p className="display text-2xl leading-snug sm:text-3xl">{t.quote}</p>
      <footer className="label mt-6 text-brand">{t.author}</footer>
    </blockquote>
  ))}
</StickyStack>
```

Match the exact `Testimonial` field names from `@/sanity/lib/types` (inspect the type; use the real property names, not guesses). Add `import { StickyStack } from "@/components/scroll/sticky-stack";`.

- [ ] **Step 3: Enlarge the section headings**

Change the "What we do" and "Selected work" `<h2>` classes from `text-4xl sm:text-5xl` to `text-5xl sm:text-6xl lg:text-7xl` for the bolder-layout pass. Leave copy unchanged.

- [ ] **Step 4: Build + verify**

Run: `npm run typecheck && npm run build`
Expected: passes. Via Playwright/manual: testimonials pin and stack while scrolling on desktop; on mobile and under reduced motion they render as a normal vertical list.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/page.tsx" src/components/testimonials.tsx
git commit -m "Stack home testimonials and enlarge section headings"
```

---

## Task 13: Full verification + preview

**Files:** none (verification only)

- [ ] **Step 1: Unit tests**

Run: `npm test`
Expected: all helper tests pass (cursor-label, progress-math, split-text, velocity, stack-math).

- [ ] **Step 2: Typecheck + build**

Run: `npm run typecheck && npm run build`
Expected: clean.

- [ ] **Step 3: Playwright desktop + mobile**

Drive `npm run dev` (or a preview URL). On desktop viewport (1440x900) and mobile viewport (390x844), for `/`:
- No console errors.
- No horizontal scrollbar (`document.scrollingElement.scrollWidth <= innerWidth`).
- Custom cursor element present on desktop (fine pointer), absent on mobile emulation (coarse pointer).
- Scroll bottom-to-top: progress bar fills; hero wheel surges; AND words reveal; testimonials stack (desktop only).

- [ ] **Step 4: Reduced-motion pass**

Emulate `prefers-reduced-motion: reduce`. Reload `/`:
- All content visible and static; no curtain on navigation; native cursor; progress bar inert.

- [ ] **Step 5: Push and open a preview**

```bash
git push
```
Vercel redeploys from `main`. Confirm `git status` shows the branch up to date, then open the preview/production URL and review the home page end to end.

- [ ] **Step 6: Handoff note**

Confirm with Matt on the preview before starting Plan 2 (the route rollout across the remaining 22 pages).

---

## Self-review notes

- **Spec coverage (this plan = stages 1-2 of the spec):** global systems — CustomCursor (T1-2), PageTransition (T4), ScrollProgress (T3); primitives — SplitReveal (T5), HeroScene (T6), StickyStack (T7), HoverRevealCard as a WorkGrid enhancement (T8); type/layout pass (T9, T11, T12); home application (T10-12); cross-cutting reduced-motion/mobile/no-deps rules embedded in every component task and re-checked in T13. Stage 3 (rollout to the other 22 routes) is deliberately out of scope for this plan and becomes Plan 2.
- **No placeholders:** every code step carries complete code; tests carry real assertions.
- **Type consistency:** `CursorState`, `Token`, `resolveCursorState`, `splitToTokens`, `scrollFraction`, `accumulateBoost`, `stackTransform` names and signatures match between their defining task and their consuming component.
- **Known follow-ups flagged inline:** T8/T12 require reading the real `WorkGrid`/`Testimonial` field names before editing (the plan says so rather than guessing them).
