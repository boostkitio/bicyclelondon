# Plan 002: Gate the Convex submissions functions before the deployment is provisioned

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- convex/ src/app/api/contact/route.ts src/lib/validation.ts .env.example`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: Low
- **Depends on**: none (001 recommended first so `npm test` exists)
- **Category**: security
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Convex functions are callable by anyone who knows the deployment URL, and
this app ships that URL to every browser as `NEXT_PUBLIC_CONVEX_URL`. As
written, `submissions:list` would let any visitor dump every contact-form
submission (names, emails, messages: personal data), and `submissions:create`
would let bots insert records directly, bypassing the API route's rate limit,
honeypot, and Zod validation. Convex is not yet provisioned (see AGENTS.md,
"Not yet live"), so nothing is exposed today; this plan closes the gap so it
never ships live. It also adds the one missing length bound in the contact
schema.

## Current state

- `convex/submissions.ts:4-20` - `create` is a public `mutation` with no
  caller verification:
  ```ts
  export const create = mutation({
    args: {
      type: v.string(),
      name: v.string(),
      ...
  ```
- `convex/submissions.ts:22-34` - `list` is a public `query` returning
  `.collect()` of all submissions. Nothing in `src/` calls it (verified by
  grep); it exists for future admin use.
- `src/app/api/contact/route.ts:55-73` - the route calls the mutation
  server-side via a string reference when `NEXT_PUBLIC_CONVEX_URL` is set:
  ```ts
  const convex = new ConvexHttpClient(convexUrl);
  await convex.mutation(
    makeFunctionReference<"mutation">("submissions:create"),
    { type: "contact", name: data.name, ... },
  );
  ```
  Failures are caught and logged so Convex storage never blocks the email
  (that behaviour is intentional; keep it).
- `src/lib/validation.ts:12` - the honeypot field has no length cap:
  `website: z.string().optional(),` (every other field has `.max()`).
- `convex/_generated/` does not exist in the repo (it is created by
  `npx convex dev` at provisioning), so `convex/` code cannot be typechecked
  locally yet; `tsconfig.json:33` excludes it.
- `.env.example:8-10` lists `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT`.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0 (note: does not cover `convex/`) |
| Build     | `npm run build`     | exit 0              |
| Tests     | `npm test`          | all pass (if plan 001 has landed) |

## Scope

**In scope**:
- `convex/submissions.ts`
- `src/app/api/contact/route.ts`
- `src/lib/validation.ts`
- `.env.example`

**Out of scope**:
- `convex/schema.ts` (no schema change needed).
- The contact form component (`src/components/forms/contact-form.tsx`); the
  client-side contract does not change.
- Provisioning Convex itself (`npx convex dev`); that is the operator's
  go-live task, noted in AGENTS.md.
- The in-memory rate limit in the route: its per-warm-instance limitation is
  a documented tradeoff, not a defect.

## Git workflow

- Work on `main`; run `npm run build` before any push (the repo auto-deploys
  from `main`).
- Commit message style: short imperative sentence, e.g.
  `Gate the Convex submissions functions behind a server secret`.

## Steps

### Step 1: Make `list` internal

In `convex/submissions.ts`, change the `list` export from `query` to
`internalQuery` (imported from `./_generated/server`). Internal functions
cannot be called from clients at all; they remain callable from the Convex
dashboard and from other Convex functions, which is all the admin use case
needs today.

**Verify**: `git grep -n "internalQuery" -- convex/submissions.ts` -> one
match on the import and one on the `list` definition.

### Step 2: Require a shared secret on `create`

The route calls `create` over HTTP as an anonymous client, so `create` must
stay public; gate it with a server-held secret instead. In
`convex/submissions.ts`:

- Add `secret: v.string()` to the `create` args.
- At the top of the handler:
  ```ts
  if (!process.env.CONTACT_FORM_SECRET || args.secret !== process.env.CONTACT_FORM_SECRET) {
    throw new Error("Unauthorised");
  }
  ```
- Insert the row without the secret: destructure it out
  (`const { secret, ...submission } = args;` then insert
  `{ ...submission, createdAt: Date.now() }`). The secret must never be
  written to the database.

Convex functions read deployment environment variables via `process.env`;
`CONTACT_FORM_SECRET` gets set in the Convex dashboard at provisioning.

**Verify**: `git grep -n "CONTACT_FORM_SECRET" -- convex/submissions.ts` ->
match; `git grep -n "secret" -- convex/submissions.ts` shows the secret is
not part of the inserted object.

### Step 3: Pass the secret from the route

In `src/app/api/contact/route.ts`, extend the Convex gate so it runs only
when both values exist, and pass the secret through:

```ts
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexSecret = process.env.CONTACT_FORM_SECRET;
if (convexUrl && convexSecret) {
  ...
  await convex.mutation(
    makeFunctionReference<"mutation">("submissions:create"),
    { secret: convexSecret, type: "contact", ... },
  );
```

Keep the try/catch and the "never blocks the email" behaviour exactly as is.

**Verify**: `npx tsc --noEmit` -> exit 0. `npm run build` -> exit 0.

### Step 4: Cap the honeypot field

In `src/lib/validation.ts`, change line 12 to
`website: z.string().max(200).optional(),`.

**Verify**: `npm test` -> validation tests still pass (if plan 001 landed);
otherwise `npx tsc --noEmit` -> exit 0.

### Step 5: Document the new env var

In `.env.example`, under the `# Convex` block add:

```
# Shared secret the API route sends with each submission. Generate a long
# random value and set the same value in the Convex deployment's env vars.
CONTACT_FORM_SECRET=
```

Do not put a real value anywhere in the repo.

**Verify**: `git grep -n "CONTACT_FORM_SECRET" -- .env.example` -> match.

## Test plan

- If plan 001 has landed, add one case to
  `src/lib/__tests__/validation.test.ts`: a `website` value of 201 chars
  fails parsing.
- The Convex-side secret check cannot be unit-tested until the deployment
  exists; verification at provisioning is listed in Done criteria and
  Maintenance notes.

## Done criteria

- [ ] `npx tsc --noEmit` exits 0 and `npm run build` exits 0
- [ ] `list` is an `internalQuery`; `create` rejects when the secret is
      missing or wrong (code review of `convex/submissions.ts`)
- [ ] The route only calls Convex when `CONTACT_FORM_SECRET` is set and never
      logs the secret
- [ ] No real secret value appears anywhere in the diff
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- `convex/_generated/` exists in the working tree (Convex has been
  provisioned since this plan was written). In that case the typed API is
  available and the route should use `api.submissions.create` instead of a
  string reference; that changes step 3 and needs a fresh look.
- The Convex docs bundled with the installed version contradict the
  `internalQuery` import path or `process.env` availability in mutations.
- Anything requires touching `convex/schema.ts`.

## Maintenance notes

- At provisioning (`npx convex dev`, Node 22 on this machine per the
  workspace notes): set `CONTACT_FORM_SECRET` in the Convex deployment env
  and in Vercel/`.env.local`, then submit the live form once and confirm the
  row appears in the Convex dashboard, and that a mutation call without the
  secret is rejected.
- Also at provisioning: switch the route from
  `makeFunctionReference<"mutation">("submissions:create")` to the generated
  `api.submissions.create` import, and add a Convex-scoped typecheck
  (`tsc -p convex` or `npx convex dev --once`) so the function name and arg
  shape are compiler-checked from then on.
- If an admin UI ever needs `list`, expose it behind Convex auth (an
  authenticated admin identity), not by making it public again.
