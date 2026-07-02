# Implementation plans

Generated from a full site and codebase audit on 2026-07-02 at commit
`e53e903`. Execute in the order below unless the dependency notes say
otherwise. Each executor: read the plan fully before starting, honour its
stop conditions, and update your row when done.

Every plan is self-contained: it assumes no knowledge of the audit session
or the other plans.

## Execution order and status

All plans were executed and pushed to `main` on 2026-07-02 (commits
`b1c7dee`..`79df5e7`). A follow-up request (case-study gallery lightbox) was
also delivered in the same session (`8b87951`).

| Plan | Title | Priority | Effort | Depends on | Status |
|------|-------|----------|--------|------------|--------|
| 001 | Verification baseline (Vitest, typecheck, first tests) | P1 | M | none | Done |
| 002 | Gate the Convex submissions functions | P1 | S | none | Done |
| 003 | Escape JSON-LD output | P1 | S | none | Done |
| 004 | Canonicals, noIndex/ogImage wiring, entity schema, robots host, llms.txt | P1 | M | none | Done |
| 005 | JobPosting: 404 inactive roles, add validThrough/identifier | P2 | S | none | Done |
| 006 | Defer the Mux player, optimise hero posters | P2 | M | none | Done |
| 007 | Runtime overhead trims (marquee, Sentry sampling, fonts, image sizes) | P2 | S | none | Done |
| 008 | Serve the Slipstream index statically | P2 | M | none | Done |
| 009 | Repo housekeeping (dead code, README, env drift, audit fix) | P3 | S | none | Done |
| 010 | Consolidate careers team pages, add Person schema | P3 | S | none | Done |
| 011 | Make `npm run lint` pass clean | P2 | S-M | 009 (soft) | Done |
| 012 | Security headers and CSP | P2 | M | 006, 007 (soft) | Done |

Notes from execution:
- 002: `create` now takes a `CONTACT_FORM_SECRET` (must be set in the Convex
  deployment env and the site env at provisioning); `list` is `internalQuery`.
- 004: Organization `logo` points at the white-on-transparent mark, the only
  full logo available; swap for a dark/colour version when the client
  supplies one. Awards still deferred pending confirmed names.
- 005: inactive jobs 404 via `active == true` on the by-slug query plus
  `dynamicParams = false` on the route.
- 006: also fixed two team headshots (`.png`, not `.jpg`) that were 404ing.
- 012: one residual console entry remains, Mux's benign Google Cast probe;
  no CSP satisfies it without loosening script-src and it has no functional
  impact on the muted background video.

Status values: Todo | In progress | Done | Blocked (with one-line reason) |
Rejected (with one-line rationale).

## Dependency notes

- 001 first: it creates `npm test` and `npm run typecheck`, which most
  later plans use as verification gates. Every plan states its fallback
  when 001 has not landed, so strict blocking is not required.
- 011 after 009: deleting the design-handoff folder removes three of the
  standing lint errors; 011 carries a fallback step if 009 has not run.
- 012 last among the P2s: the CSP must be tested against the media and
  monitoring behaviour that plans 006/007 change.
- 002 must land before Convex is provisioned (the go-live step in
  AGENTS.md); it is safe to land any time before that.
- 004 and 010 interact mildly: 010 preserves whatever canonicals 004 added
  to the team pages. Either order works.

## Findings considered and rejected

Recorded so they are not re-audited:

- **www vs apex canonical host**: the site is consistently `www`
  everywhere (env-driven via `NEXT_PUBLIC_SITE_URL`), matching the live
  Wix site. Defensible pre-cutover; the host decision belongs to the
  domain-cutover task, not a code fix now.
- **Sanity v5 major upgrade** (clears the remaining moderate `npm audit`
  advisories): breaking Studio changes, low runtime exposure. Defer to a
  planned upgrade.
- **In-memory rate limit on the contact route** (per-warm-instance): a
  documented tradeoff in the route's own comment; honeypot is the stated
  main defence. Not a finding.
- **`ref.current!` non-null assertions in the GSAP scroll components**:
  idiomatic post-mount usage, compiler-checked context, no action.
- **Reveal/CountUp per-instance IntersectionObservers**: real but minor
  overhead; consolidation adds complexity disproportionate to the win.
  Revisit only if profiling shows hydration jank on the-peloton.
- **TeamStrip duplicate headshot requests** (~56 image elements on the
  homepage loop): optimised thumbnails are individually small and the
  browser dedupes repeated URLs; the fix (CSS clones/sprites) is not worth
  the churn now.
- **`GsapHeroHeading` importing gsap directly instead of via `@/lib/gsap`**:
  harmless today (no plugins used); fold into any future edit of that file
  rather than a standalone change.
- **Render-time URL-scheme validation for CMS links**: mitigated at
  authoring time by Sanity schema validation; noted in plan 003's
  maintenance notes as defence-in-depth if the content surface grows.

## Direction findings (not planned; operator decisions)

From the audit, grounded in `docs/llm-visibility-roadmap.md`; each would be
a design/spike plan if picked up:

1. **AI Visibility dashboard** (roadmap Track C, `:149-166`): the
   measurement layer for the whole LLM-visibility programme. Convex is in
   the stack; LLM-answer capture APIs exist in the tooling already used.
2. **Category explainer / citable-list content engine** (roadmap A3/B3):
   `faqPageSchema()` and `webPageSchema()` in `src/lib/schema.ts` are built
   and unused; the gap is a content type plus authored pages.
3. **Person schema and leadership pages beyond the two team stories**
   (plan 010 lays the foundation; Sanity `author` records already hold
   role/image/LinkedIn).
4. **Recognition/press hub** (roadmap B5): converts held awards and
   memberships into ungated, schema-marked, citable pages.

Also: the intent docs have drifted from the code (the roadmap claims a
comparison page ships with the rebuild; the design spec claims canonicals
are delivered and names the newsletter "The Peloton"). Worth a
reconciliation pass by the author of those docs.
