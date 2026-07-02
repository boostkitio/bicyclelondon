# Plan 009: Repo housekeeping (dead code, stock README, env drift, audit fix)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- design_handoff_scroll_effects src/components/scroll tsconfig.json README.md .env.example package-lock.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: Low
- **Depends on**: none (plan 011 depends on this one)
- **Category**: tech-debt / dx / deps
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Four unrelated pieces of drift: a 750-line design-handoff folder duplicates
shipped scroll components in unlinted, untypechecked form; three scroll
components are no longer imported anywhere after the homepage was de-pinned;
the README is still create-next-app boilerplate while the real docs live in
AGENTS.md; `.env.example` documents an env var nothing reads; and `npm audit`
reports five high advisories, all one transitive `ws` package in Sanity's
CLI tooling chain, fixable without a breaking bump. None is urgent; together
they mislead the next contributor and pad every audit.

## Current state

- `design_handoff_scroll_effects/` at repo root: `components/`, `lib/`,
  `reference/`, `example/`, `tailwind.config.snippet.ts`. Its README calls
  it a port to "recreate faithfully, then move to your styling system"; the
  live implementations exist under `src/components/scroll/` and
  `src/components/`. Nothing under `src/` imports the folder (grep clean at
  planning). `tsconfig.json:33` excludes it.
- Unused components (no importers outside their own folder, verified by
  `git grep -l "StickyServices\|KineticPairs\|HorizontalGallery" -- src`
  returning only the component files):
  - `src/components/scroll/sticky-services.tsx`
  - `src/components/scroll/kinetic-pairs.tsx`
  - `src/components/scroll/horizontal-gallery.tsx`
  These were used by the pinned homepage design and became orphans when the
  homepage was de-pinned (commit `3de64d8`). Git history preserves them.
- `README.md` - unmodified create-next-app template.
- `.env.example:15` - `JOBS_TO_EMAIL=jobs@bicyclelondon.com`; no code reads
  `JOBS_TO_EMAIL` (grep clean); the careers apply flow uses
  `job.teamtailorUrl` / `job.applyEmail` from Sanity with
  `SITE.jobsEmail` as fallback.
- `npm audit --omit=dev`: 5 high advisories, all `ws` 8.x range via
  `sanity -> @sanity/workbench-cli -> @module-federation/... -> ws`,
  reported as fixable via `npm audit fix`; plus moderates in the Sanity
  chain whose only fix is a breaking `sanity` major (leave those).

## Commands you will need

| Purpose   | Command                    | Expected on success |
|-----------|----------------------------|---------------------|
| Typecheck | `npx tsc --noEmit`         | exit 0              |
| Build     | `npm run build`            | exit 0              |
| Audit     | `npm audit --omit=dev`     | 0 high, 0 critical after step 5 |
| Tests     | `npm test`                 | all pass (if plan 001 landed) |

## Scope

**In scope**:
- `design_handoff_scroll_effects/` (delete)
- `src/components/scroll/sticky-services.tsx`, `kinetic-pairs.tsx`,
  `horizontal-gallery.tsx` (delete)
- `tsconfig.json` (remove the now-dead exclude entry)
- `README.md` (rewrite, short)
- `.env.example` (remove the dead var)
- `package-lock.json` (via `npm audit fix` only)

**Out of scope**:
- `package.json` dependency ranges: `npm audit fix` must not change them; if
  it wants to, stop (see Stop conditions).
- `docs/` (including `docs/superpowers/`, a historical archive).
- Every other scroll component: `marquee.tsx`, `magnetic-button.tsx`,
  `mask-reveal.tsx`, `parallax.tsx`, `smooth-scroll.tsx` are all in use.

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Remove the design-handoff folder and orphaned scroll components`.

## Steps

### Step 1: Re-verify the dead code is dead

```
git grep -n "design_handoff" -- src
git grep -ln "StickyServices\|KineticPairs\|HorizontalGallery" -- src
```

First command: no matches. Second: only the three component files
themselves.

**Verify**: as above. If anything else matches, stop.

### Step 2: Delete

Delete `design_handoff_scroll_effects/` and the three component files. In
`tsconfig.json`, change the exclude array to
`"exclude": ["node_modules", "convex"]`.

**Verify**: `npx tsc --noEmit` -> exit 0. `npm run build` -> exit 0.

### Step 3: Rewrite the README

Replace `README.md` with a short, true document (10-20 lines): one-line
project description (Next.js rebuild of bicyclelondon.com), the three
commands (`npm run dev`, `npm run build`, `npm run start`, plus `npm test`
and `npm run typecheck` if plan 001 has landed), env setup (`copy
.env.example to .env.local and fill in`), and a pointer: "Full structure,
content model, and conventions: see AGENTS.md." Keep it in the same plain
tone as AGENTS.md. UK English.

**Verify**: `git grep -n "create-next-app" -- README.md` -> no matches.

### Step 4: Remove the dead env var

Delete the `JOBS_TO_EMAIL=...` line from `.env.example`.

**Verify**: `git grep -rn "JOBS_TO_EMAIL"` -> no matches anywhere.

### Step 5: Clear the ws advisories

Run `npm audit fix`. Then check `git diff package.json` is empty (lockfile
changes only) and run the full gate: `npm run build`, `npm test` if present.

**Verify**: `npm audit --omit=dev` -> 0 high, 0 critical. Moderates in the
Sanity chain may remain; that is expected.

## Test plan

- Existing suite (`npm test`) if plan 001 landed; otherwise build +
  typecheck are the gate. No new tests: deletions and docs.

## Done criteria

- [ ] `design_handoff_scroll_effects/` gone; three orphaned components gone
- [ ] `npx tsc --noEmit` and `npm run build` exit 0
- [ ] README describes this project, not the template
- [ ] `JOBS_TO_EMAIL` appears nowhere
- [ ] `npm audit --omit=dev` reports 0 high/critical
- [ ] `git diff package.json` empty (audit fix touched the lockfile only)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- Step 1's greps show new importers (the components came back into use since
  planning).
- `npm audit fix` wants to modify `package.json` or bump `sanity`/`next`
  majors: abort the fix (`git checkout -- package-lock.json package.json`)
  and report what it wanted.
- The operator has expressed intent to re-pin the homepage using these
  components (check recent commit messages since `e53e903` for pin-related
  work); deletion is still recoverable from git history, but flag it.

## Maintenance notes

- If a pinned/horizontal-scroll section returns to the design, recover the
  components from git history (`git log --diff-filter=D --summary`) rather
  than rewriting them.
- Re-run `npm audit --omit=dev` after any `sanity` upgrade; the remaining
  moderates clear with the next `sanity` major (a separate, breaking
  upgrade that was considered and deferred).
