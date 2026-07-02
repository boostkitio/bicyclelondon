# Plan 005: Stop rendering JobPosting markup for inactive roles and complete the schema

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- src/sanity/lib/queries.ts "src/app/(site)/careers/[slug]/page.tsx" src/sanity/schemaTypes/job.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: Low-Med (needs a product decision honoured: inactive jobs 404)
- **Depends on**: none
- **Category**: seo
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Google's guidance for JobPosting structured data warns against keeping
markup on postings that no longer accept applications; violations risk loss
of job rich results across all postings. In this codebase, unticking
"active" in Sanity removes a job from the careers list and the sitemap, but
the detail page still renders on demand at HTTP 200 with full JobPosting
markup, because the by-slug query has no active filter. The markup is also
missing `validThrough`, which is what lets Google expire a listing on its
own.

## Current state

- `src/sanity/lib/queries.ts:40-52` - the list and slugs queries filter
  `active == true`, the by-slug query does not:
  ```ts
  export const allJobsQuery = groq`
    *[_type == "job" && active == true] | order(postedAt desc){ ... }`;

  export const jobSlugsQuery = groq`
    *[_type == "job" && active == true && defined(slug.current)]{ "slug": slug.current }`;

  export const jobBySlugQuery = groq`
    *[_type == "job" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, team, location, employmentType, salary, summary,
      body, applyEmail, teamtailorUrl, postedAt, seo
    }`;
  ```
- `src/app/(site)/careers/[slug]/page.tsx:42-49` - fetches via
  `jobBySlugQuery` and calls `notFound()` only when the query returns null.
  With `dynamicParams` at its default (true), a slug omitted from
  `generateStaticParams` still renders on demand.
- `src/app/(site)/careers/[slug]/page.tsx:60-83` - the `jobPosting` object
  has `title, description, datePosted, employmentType, directApply,
  hiringOrganization, jobLocation`. No `validThrough`, no `identifier`.
  `description` is plain-text summary (fine). `employmentType` comes from
  Sanity in the schema.org enum shape already (the UI reformats it for
  display at line 56).
- `src/sanity/schemaTypes/job.ts` - the job document type. It has no
  closing-date field at planning time.
- Sanity conventions in this repo: schema types live in
  `src/sanity/schemaTypes/`, use `defineType`/`defineField` (see
  `src/sanity/schemaTypes/job.ts` itself as the exemplar).

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Tests     | `npm test`          | all pass (if plan 001 landed) |

## Suggested executor toolkit

- If a Sanity best-practices skill is available in your environment, use it
  when editing `job.ts` (defineField conventions, validation rules).

## Scope

**In scope**:
- `src/sanity/lib/queries.ts` (jobBySlugQuery only)
- `src/app/(site)/careers/[slug]/page.tsx`
- `src/sanity/schemaTypes/job.ts` (add optional `validThrough` field)
- `src/sanity/lib/types.ts` (extend the `Job` type)

**Out of scope**:
- `allJobsQuery` / `jobSlugsQuery` (already correct)
- The careers listing page and the sitemap
- `baseSalary` markup: `job.salary` is a free-text string (for example a
  range with currency); emitting structured `baseSalary` needs structured
  salary fields, which is a content-model decision. Recorded as deferred.

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Return 404 for inactive jobs and add validThrough to the JobPosting schema`.

## Steps

### Step 1: Filter inactive jobs in the by-slug query

In `src/sanity/lib/queries.ts`, change the first line of `jobBySlugQuery` to:

```ts
*[_type == "job" && active == true && slug.current == $slug][0]{
```

The page's existing `if (!job) notFound();` then turns inactive slugs into
404s, in both `generateMetadata` and the page body.

**Verify**: `git grep -n "active == true" -- src/sanity/lib/queries.ts` ->
3 matches.

### Step 2: Add an optional validThrough field to the job schema

In `src/sanity/schemaTypes/job.ts`, add (following the file's existing
`defineField` style):

```ts
defineField({
  name: "validThrough",
  title: "Closing date",
  type: "datetime",
  description:
    "Optional. When set, search engines can expire the listing themselves.",
}),
```

Add `validThrough?: string;` to the `Job` type in `src/sanity/lib/types.ts`,
and add `validThrough` to the projection in `jobBySlugQuery`.

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 3: Extend the JobPosting markup

In `src/app/(site)/careers/[slug]/page.tsx`, extend the `jobPosting` object:

```ts
identifier: {
  "@type": "PropertyValue",
  name: SITE.name,
  value: job.slug,
},
...(job.validThrough ? { validThrough: job.validThrough } : {}),
```

**Verify**: `npm run build` -> exit 0. Then `npm run start` and, if at least
one active job exists in the dataset, curl its page and confirm the JSON-LD
contains `"identifier"`. If no active job exists, verify via the build alone
and note it.

## Test plan

- No unit tests (GROQ + markup wiring). Manual: in Sanity Studio, untick
  "active" on a test job (or use the dashboard), wait out the 60s
  revalidate, and confirm the job URL returns 404.
- Optional: run one live job URL through Google's Rich Results test after
  deploy.

## Done criteria

- [ ] `jobBySlugQuery` filters on `active == true`
- [ ] Schema, type, query projection, and markup all know `validThrough`
- [ ] `identifier` present in the JobPosting object
- [ ] `npx tsc --noEmit` and `npm run build` exit 0
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The operator (or content team) wants inactive jobs to redirect to
  `/careers` instead of 404ing; that is a different implementation (a
  redirect in the page, not a query filter) and needs a decision first.
  Default per this plan: 404.
- `job.ts` has gained a closing-date-like field since planning (drift);
  reuse it instead of adding a duplicate.
- Schema changes require a Studio deploy step you cannot perform; make the
  code changes, then report that `npx sanity deploy` (or the embedded
  Studio's redeploy) is needed.

## Maintenance notes

- Content team: set "Closing date" on new roles so listings auto-expire.
- Deferred: structured `baseSalary` (needs numeric min/max + currency fields
  on the job type); revisit if job rich results become a priority.
- Deferred: unpublishing behaviour for filled roles that had external links;
  if link equity matters later, switch the 404 to a 301 to `/careers`.
