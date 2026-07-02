# Plan 003: Escape JSON-LD output so CMS text cannot break out of the script tag

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/components/seo/json-ld.tsx`
> If the file changed since this plan was written, compare the "Current
> state" excerpt against the live code before proceeding; on a mismatch,
> treat it as a stop condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: Low
- **Depends on**: none (001 recommended first so a unit test can be added)
- **Category**: security
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Every structured-data block on the site is rendered through one component
that injects `JSON.stringify(data)` via `dangerouslySetInnerHTML`.
`JSON.stringify` does not escape `<`, so a CMS value containing a
closing-script sequence (for example in an article title or standfirst
authored in Sanity, or written by any script with a write token) terminates
the `<script type="application/ld+json">` element and injects markup into
every page that renders that document. Escaping the serialised string in this
one component closes the hole for all call sites at once.

## Current state

- `src/components/seo/json-ld.tsx` (entire file):
  ```tsx
  export function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
      <script
        type="application/ld+json"
        // Structured data is trusted, server-generated JSON.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    );
  }
  ```
- Call sites (do not modify them; listed so you can smoke-test):
  `src/app/(site)/layout.tsx:45-46`, `src/app/(site)/slipstream/[slug]/page.tsx:72-88`,
  `src/app/(site)/work/[slug]/page.tsx:67-73`,
  `src/app/(site)/careers/[slug]/page.tsx:87-94`, plus service and listing
  pages via `src/lib/schema.ts` helpers.
- The data flowing in includes Sanity free-text fields (titles, standfirsts,
  author names) with no character restrictions at authoring time.

## Commands you will need

| Purpose   | Command            | Expected on success |
|-----------|--------------------|---------------------|
| Typecheck | `npx tsc --noEmit` | exit 0              |
| Build     | `npm run build`    | exit 0              |
| Tests     | `npm test`         | all pass (if plan 001 landed) |

## Scope

**In scope**:
- `src/components/seo/json-ld.tsx`
- `src/components/seo/__tests__/json-ld.test.ts` (create, only if plan 001
  has landed)

**Out of scope**:
- `src/lib/schema.ts` and all `JsonLd` call sites; the component's props
  contract does not change.
- Sanity schema validation rules.

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Escape JSON-LD payloads before injecting them into script tags`.

## Steps

### Step 1: Add an escaping serialiser

Rewrite `src/components/seo/json-ld.tsx` as:

```tsx
// JSON.stringify leaves <, U+2028 and U+2029 intact; escape them so CMS
// text can never terminate the script element or break the JS string.
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
```

The `<` form is valid JSON, so parsers (and search engines) read the
identical object; only the raw HTML changes.

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 2: Unit-test the serialiser (only if plan 001 landed)

Create `src/components/seo/__tests__/json-ld.test.ts` following the pattern
of `src/lib/__tests__/validation.test.ts`:

- `serializeJsonLd({ a: "</script><img src=x>" })` contains no literal `<`.
- `JSON.parse(serializeJsonLd(obj))` deep-equals `obj` for an object
  containing `<`, `>`, `&`, quotes, and a U+2028 character.

**Verify**: `npm test` -> exit 0, new tests pass.

### Step 3: Smoke-test rendered output

Run `npm run build && npm run start`, then:

`curl -s http://localhost:3000/ | grep -c "application/ld+json"` -> at least 2
(Organization + WebSite schema from the site layout).

Stop the server afterwards.

**Verify**: as above; page renders and the JSON-LD blocks are present.

## Test plan

Covered in step 2. If plan 001 has not landed, record that the unit test is
deferred to it in `plans/README.md`.

## Done criteria

- [ ] `git grep -n "JSON.stringify(data)" -- src/components/seo/json-ld.tsx`
      returns no direct-injection match (only the escaped serialiser)
- [ ] `npx tsc --noEmit` exits 0; `npm run build` exits 0
- [ ] Curl check in step 3 passes
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The component has grown additional props or call-site-specific logic since
  `e53e903` (drift check).
- Any structured-data validator (for example Google's Rich Results test, if
  run) reports the escaped output as invalid JSON.

## Maintenance notes

- Any future component that injects serialised data into HTML must use
  `serializeJsonLd` (or the same escaping); flag raw
  `JSON.stringify` + `dangerouslySetInnerHTML` in review.
- Related defence-in-depth items deliberately not in this plan: render-time
  URL-scheme validation for CMS links (`src/components/portable-text.tsx:53`,
  `src/components/article-byline.tsx:43`,
  `src/app/(site)/careers/[slug]/page.tsx:124` render CMS-supplied hrefs;
  today the Sanity schemas restrict them to safe schemes at authoring time),
  and the site-wide CSP in plan 012.
