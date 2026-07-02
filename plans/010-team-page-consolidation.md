# Plan 010: Consolidate the careers team pages into one data-driven route (with Person schema)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- "src/app/(site)/careers/team" src/app/sitemap.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: Low
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

Two team-story pages (`/careers/team/mark-pavlika`,
`/careers/team/valeria-perticucci`) are hand-coded copies of the same
scaffold: `PageHero`, then a `220px_1fr` grid with an `Avatar` and prose
paragraphs, then the same `CtaBand`. The repo's own convention for page
families is data-driven shared components (`ServicePage` +
`src/content/services.ts`, `LegalPage` for legal pages). A third team member
means another copy-paste today. Consolidating also creates the natural home
for `Person` structured data, which the AI-visibility roadmap wants for
E-E-A-T (people as entities with LinkedIn `sameAs`).

## Current state

- `src/app/(site)/careers/team/mark-pavlika/page.tsx` (87 lines) and
  `src/app/(site)/careers/team/valeria-perticucci/page.tsx` (83 lines):
  structurally identical (verified by structure-only diff), differing only
  in `metadata`, hero copy, avatar `src`/`initials`, and the paragraphs.
  Shape:
  ```tsx
  export const metadata: Metadata = { title: "...", description: "..." };
  export default function MarkPavlikaPage() {
    return (
      <>
        <PageHero eyebrow="Careers · Meet the Peloton" title="Mark Pavlika"
                  lead="Chief People & Purpose Officer, People Team" />
        <Section>
          <div className="grid gap-10 md:grid-cols-[220px_1fr]">
            <div className="w-40 md:w-full">
              <Avatar src="/team/mark-pavlika.png" name="Mark Pavlika" initials="MP" />
            </div>
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-black/75">
              <p>...</p> ...
            </div>
          </div>
        </Section>
        <CtaBand heading="Like the sound of the Peloton? See our open roles."
                 label="View open roles" href="/careers" />
      </>
    );
  }
  ```
- The content-file convention to mirror: `src/content/services.ts` typed
  records consumed by `src/components/page/service-page.tsx`, used by the
  five service pages.
- `src/app/sitemap.ts:27-28` lists both team paths as static strings.
- The JSON-LD component is `JsonLd` from `src/components/seo/json-ld.tsx`;
  schema helpers live in `src/lib/schema.ts`.
- If plan 004 has landed, both pages will also carry
  `alternates: { canonical: ... }` in their metadata; preserve that in the
  consolidated route.

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Typecheck | `npx tsc --noEmit`  | exit 0              |
| Build     | `npm run build`     | exit 0              |
| Serve     | `npm run start`     | serves on :3000     |

## Scope

**In scope**:
- `src/content/team-stories.ts` (create)
- `src/app/(site)/careers/team/[slug]/page.tsx` (create)
- `src/app/(site)/careers/team/mark-pavlika/page.tsx` (delete)
- `src/app/(site)/careers/team/valeria-perticucci/page.tsx` (delete)
- `src/app/sitemap.ts` (derive the two entries from the record)

**Out of scope**:
- `src/content/team.ts` (the full-roster strip data; different shape,
  different purpose)
- Any link pointing at these pages (URLs do not change)
- Moving team stories into Sanity (bigger content-model decision; deferred)

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Drive the careers team pages from one data-backed route`.

## Steps

### Step 1: Create the content record

`src/content/team-stories.ts`, mirroring the `services.ts` style:

```ts
export type TeamStory = {
  slug: string;
  name: string;
  role: string;        // PageHero lead, e.g. "Chief People & Purpose Officer, People Team"
  jobTitle: string;    // schema.org jobTitle, e.g. "Chief People & Purpose Officer"
  avatar: string;      // e.g. "/team/mark-pavlika.png"
  initials: string;
  metaTitle: string;   // current metadata.title, verbatim
  metaDescription: string; // current metadata.description, verbatim
  paragraphs: string[];    // body copy, one entry per <p>, verbatim
  signoff?: string;        // the final styled line, e.g. "Pav x (aka known as Mark, Mario and Maz)"
  linkedin?: string;       // optional, only if a profile URL is confirmed
};

export const TEAM_STORIES: TeamStory[] = [ ... ];
```

Copy all copy verbatim from the two existing pages, decoding JSX entities
to plain characters (`&apos;` to the apostrophe, `&amp;` to `&`, `&ndash;`
to the en dash). Do not edit or "improve" the stories: this is personal
first-person copy from the individuals themselves.

**Verify**: `npx tsc --noEmit` -> exit 0.

### Step 2: Create the dynamic route

`src/app/(site)/careers/team/[slug]/page.tsx`:

- `generateStaticParams` returns the slugs from `TEAM_STORIES`.
- `generateMetadata` returns `metaTitle`/`metaDescription` (and
  `alternates: { canonical: \`/careers/team/${slug}\` }` if plan 004 landed).
- The page body reproduces the existing scaffold exactly (PageHero, grid,
  Avatar, paragraphs, optional signoff line, CtaBand), calling `notFound()`
  for unknown slugs.
- Add Person structured data via the existing `JsonLd` component:
  ```ts
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: story.name,
    jobTitle: story.jobTitle,
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
    image: `${SITE.url}${story.avatar}`,
    url: `${SITE.url}/careers/team/${story.slug}`,
    ...(story.linkedin ? { sameAs: [story.linkedin] } : {}),
  }
  ```
  Leave `linkedin` unset unless a confirmed URL is provided; do not guess
  profile URLs.

Then delete the two hard-coded page files.

**Verify**: `npm run build` -> exit 0 and the route table shows
`/careers/team/[slug]` with two generated paths.

### Step 3: Derive the sitemap entries

In `src/app/sitemap.ts`, replace the two hard-coded
`"/careers/team/..."` strings with entries mapped from `TEAM_STORIES`
(import the record; spread `TEAM_STORIES.map((s) => `/careers/team/${s.slug}`)`
into the static paths array).

**Verify**: if plan 001 landed, `npm test` -> the sitemap test still finds
both team URLs. Otherwise `npm run build` + a curl of
`http://localhost:3000/sitemap.xml` containing both URLs.

### Step 4: Visual parity check

`npm run start`; open both URLs and compare against the live/pre-change
pages: same hero, same avatar, same paragraphs, same CTA. View source and
confirm the Person JSON-LD block is present.

**Verify**: as above.

## Test plan

- Covered by the sitemap test (step 3) and visual parity (step 4). If plan
  001 landed, add one test: `TEAM_STORIES` slugs are unique and non-empty.

## Done criteria

- [ ] Both old page files deleted; one dynamic route serves both URLs
- [ ] Copy is verbatim (diff the rendered text if unsure)
- [ ] Person JSON-LD emitted on both pages
- [ ] Sitemap still lists both URLs
- [ ] `npm run build` exits 0; no files outside the in-scope list modified
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The two pages have diverged structurally since planning (drift check) in
  a way the shared scaffold cannot express without conditionals per person:
  report rather than adding a prop for every variation.
- Route conflict: `/careers/[slug]` (jobs) must not swallow
  `/careers/team/x`. The static `team` segment takes precedence over the
  sibling dynamic segment; if the build or runtime says otherwise, stop.

## Maintenance notes

- New team stories: add one record to `TEAM_STORIES`; no new page file.
- If team stories move into Sanity later (there is already an `author` type
  with role/image/LinkedIn), this route's shape maps 1:1 onto that model.
- The middleware's legacy-slug normaliser ignores multi-segment paths like
  these (it skips any slug containing `/`), so no middleware change is
  needed; that behaviour is covered by plan 001's tests.
