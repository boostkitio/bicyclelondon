# Plan 001: Establish a verification baseline (Vitest, typecheck script, first tests)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/middleware.ts src/lib/validation.ts src/app/sitemap.ts package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: Low
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

This repo has no test script and zero test files. The only gate before an
auto-deploy to production (Vercel deploys `main` on push) is `npm run build`,
which catches type and compile errors but not logic. The three most dangerous
untested paths are the legacy-redirect middleware (a regex/slugify change can
301 valid pages into 404s), the contact-form validation, and the sitemap
assembly that feeds search engines. Every other plan in this folder becomes
safer once this lands.

## Current state

- `package.json:5-10` - scripts are only:
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
  ```
- `src/middleware.ts:7-21` - a module-private `slugify()` normalises legacy
  Wix slugs (decode, lowercase, strip apostrophes, `&` to `and`, collapse
  non-alphanumerics to hyphens). `src/middleware.ts:23-40` holds a
  `LEGACY_REDIRECTS` map. Neither is exported, so they cannot be imported by
  a test today.
- `src/lib/validation.ts:3-20` - `contactSchema` (Zod) and `sanitiseLine()`
  (strips CR/LF). Pure, directly testable.
- `src/app/sitemap.ts:12-73` - builds the sitemap from a static path list
  plus three `sanityFetch` calls (article, case study, job slugs).
- `tsconfig.json:33` - `"exclude": ["node_modules", "convex", "design_handoff_scroll_effects"]`.
- Path alias: `@/*` maps to `./src/*` (`tsconfig.json:21-23`).
- Repo conventions: TypeScript strict mode, UK English in copy, no comments
  restating code. Imports use the `@/` alias.

## Commands you will need

| Purpose   | Command                | Expected on success |
|-----------|------------------------|---------------------|
| Install   | `npm install`          | exit 0              |
| Typecheck | `npx tsc --noEmit`     | exit 0, no output   |
| Build     | `npm run build`        | exit 0              |
| Tests     | `npm test` (after step 2) | all pass         |

## Scope

**In scope** (the only files you should modify or create):
- `package.json` (add devDependency + scripts)
- `package-lock.json` (via npm install only)
- `vitest.config.ts` (create)
- `src/lib/legacy-redirects.ts` (create; extracted from middleware)
- `src/middleware.ts` (import the extracted helpers; no behaviour change)
- `src/lib/__tests__/legacy-redirects.test.ts` (create)
- `src/lib/__tests__/validation.test.ts` (create)
- `src/app/__tests__/sitemap.test.ts` (create)

**Out of scope** (do not touch):
- Any page, component, or Sanity/Convex file.
- The middleware's matcher config or redirect behaviour. This plan only
  relocates pure helpers; the emitted redirects must be byte-identical.
- ESLint config (plan 011 owns lint).

## Git workflow

- Work on the current branch (`main`); this repo commits directly to `main`
  and auto-deploys from it, so run `npm run build` before any push.
- Commit message style: short imperative sentence, sentence case, no
  trailers or footers. Example from history: `Add team profiles, more
  testimonials, and a Teamtailor apply option to careers`.

## Steps

### Step 1: Install Vitest and add scripts

Run `npm install -D vitest`. Then add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

**Verify**: `npm run typecheck` -> exit 0.

### Step 2: Create vitest.config.ts

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

**Verify**: `npm test` -> exits 0 with "no test files found" (or equivalent)
rather than a config error.

### Step 3: Extract the pure redirect helpers

Create `src/lib/legacy-redirects.ts` exporting `slugify` and
`LEGACY_REDIRECTS`, moved verbatim from `src/middleware.ts:7-40` (keep the
explanatory comments). In `src/middleware.ts`, delete the moved code and add
`import { slugify, LEGACY_REDIRECTS } from "@/lib/legacy-redirects";`.
Change nothing else in the middleware.

**Verify**: `npm run typecheck` -> exit 0. `npm run build` -> exit 0.

### Step 4: Write the tests

`src/lib/__tests__/legacy-redirects.test.ts` - cases:
- `slugify("x%3B-bargain-reach%2C--but-at-what-cost%3F")` returns
  `"x-bargain-reach-but-at-what-cost"` (encoded punctuation collapses).
- `slugify` is idempotent: `slugify(slugify(s)) === slugify(s)` for the
  sample slugs above and a plain slug like `"already-clean-slug"`.
- Apostrophes are removed, `&` becomes `and`, leading/trailing hyphens strip.
- An invalid percent-encoding (e.g. `"bad%2-slug"`) does not throw.
- `LEGACY_REDIRECTS` values all start with `/slipstream` (every target is an
  internal path).

`src/lib/__tests__/validation.test.ts` - cases:
- Valid payload parses; whitespace is trimmed.
- Missing name/message fails; invalid email fails; over-length message
  (5001 chars) fails.
- `enquiryType` defaults to `"General enquiry"` when omitted.
- `sanitiseLine("a\r\nb\nc")` returns `"a b c"`.

`src/app/__tests__/sitemap.test.ts` - mock the Sanity fetch:

```ts
import { vi } from "vitest";
vi.mock("@/sanity/lib/fetch", () => ({
  sanityFetch: vi.fn(async ({ query }: { query: string }) => [
    { slug: "sample-slug" },
  ]),
}));
```

Then import the default export from `@/app/sitemap`, call it, and assert:
- Every URL starts with `https://` (no double slashes after the host).
- The homepage entry has priority 1.
- Entries exist for `/slipstream/sample-slug`, `/work/sample-slug`,
  `/careers/sample-slug`.
- All static paths from the page tree are present, including
  `/careers/benefits`, `/careers/diversity`, `/careers/values`,
  `/international`, `/purpose`, `/the-peloton`, `/modern-slavery`.

**Verify**: `npm test` -> exit 0, at least 12 tests passing.

## Test plan

Covered by step 4 (this plan is the test plan for the repo).

## Done criteria

All must hold:

- [ ] `npm run typecheck` exits 0
- [ ] `npm test` exits 0 with >= 12 passing tests
- [ ] `npm run build` exits 0
- [ ] `git grep -n "function slugify" -- src/middleware.ts` returns no match
      (helper now lives in `src/lib/legacy-redirects.ts`)
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The code at the "Current state" locations does not match the excerpts.
- Vitest cannot run because a test file transitively imports `next/server`
  or another server-only module (the extraction in step 3 exists precisely
  to avoid this; do not add polyfills or jsdom to work around it).
- `npm run build` fails after step 3 (the middleware extraction must be
  behaviour-neutral; if it is not, something else is wrong).

## Maintenance notes

- Any future change to `slugify` or `LEGACY_REDIRECTS` must update the tests;
  they are characterisation tests for live 301 behaviour.
- Plans 002-012 should run `npm test` as part of their verification once this
  lands.
- Deferred: component/E2E testing (Playwright) was considered and left out;
  revisit after the domain cutover settles.
