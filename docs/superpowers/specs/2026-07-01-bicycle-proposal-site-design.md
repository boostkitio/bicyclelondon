# Design: Bicycle proposal site (separate pitch site for rebuild + AI SEO)

Date: 2026-07-01
Status: Approved

## Goal

Bicycle London has asked for a proposal covering (1) finishing the Next.js
rebuild and (2) an ongoing AI-search-visibility (AI SEO) workstream. Package
this as its own small pitch website, entirely separate from the real rebuild,
so it can carry pricing and competitive evidence that has no place on the
faithful-clone deliverable itself.

The pitch/evidence pages already exist today, built for this purpose but
living in the wrong place: `src/app/(site)/comparison`, `src/app/(site)/visibility`,
and `src/app/(site)/visibility/get-listed` on `main`. This design moves that
content into its own site and cleans it out of the rebuild.

## Decisions (agreed in brainstorming)

1. **New branch, new folder, same repo.** Branch `proposal` off `main`. Add a
   `proposal/` folder containing a standalone Next.js app (own `package.json`,
   own Tailwind v4 config/tokens, own fonts). It does not import from the root
   app's `src/` — different brand, different concern, and it keeps the two
   apps from ever leaking into each other.
2. **Plain, current stable Next.js for `proposal/`**, not the pinned/patched
   Next 16 setup the root app uses (see root `AGENTS.md`). This is a small,
   self-contained marketing site with no need for that complexity or its
   breaking-changes caveat.
3. **New Vercel project** (`bicycleproposal`, confirm name availability during
   implementation), same GitHub repo, **Root Directory: `proposal/`**,
   **Production Branch: `proposal`**. Pushing to `proposal` deploys to
   `bicycleproposal.vercel.app`. The existing `bicyclelondon` Vercel project
   keeps tracking `main` exactly as it does today — untouched.
4. **Boostkit-branded pitch deck**, not a Bicycle-branded demo. Own design
   system, own voice, framed as "a proposal for Bicycle London," not "here's
   a preview of your new site."
5. **Multi-page, not one long scroll** — the evidence content (LLM citation
   tables, benchmark bars, ranking-keyword trends) is dense enough to want
   its own pages rather than one long document.
6. **`noindex` + unlisted URL**, no password gate. `robots: { index: false,
   follow: false }` in the root layout metadata, a disallow-all `robots.txt`,
   no sitemap, no inbound links from the real site. Reachable only by the
   exact URL sent to Bicycle.
7. **Pricing: fixed fee (rebuild) + monthly retainer (AI SEO)**. Placeholder
   figures — £8,000–£12,000 fixed for the rebuild, £1,200/month for the AI SEO
   retainer — Matt to adjust to the real numbers before sending.
8. **Never reveal how far along the real rebuild is.** No link, screenshot, or
   mockup of the in-progress rebuild anywhere on the proposal site. The fixed
   fee needs to stay justifiable, so everything stays either (a) evidence
   about the *current live Wix site*, or (b) a description of *future scope*,
   never "look, it's basically done already."
9. **Clean up `main`**: in a separate commit on `main` (not on the `proposal`
   branch), delete the three pitch/evidence pages and their `sitemap.ts`
   entries, so the real rebuild carries no pricing-adjacent content.

## Site structure (`proposal/` app)

| Route | Purpose | Source material |
|---|---|---|
| `/` | Hero: "A proposal for Bicycle London." Short summary of both workstreams, links into the rest. | New copy |
| `/evidence` | Current-Wix-site findings: ranking keywords, visibility trend, domain authority, LLM citation testing, competitor benchmark rows. | Adapted from today's `/comparison` + `/visibility` — evidence about the *current* site only, nothing about the rebuild's design |
| `/scope` | What's delivered in each workstream: rebuild deliverables (new site, CMS-managed content, case studies, careers, contact form) described as outcomes; AI SEO deliverables (get-listed push, content plan, ongoing monitoring). | Adapted from today's `/visibility` workstreams/roadmap section |
| `/pricing` | Fixed fee for the rebuild, monthly retainer for AI SEO, laid out plainly, plus a closing CTA section: accept, questions, `mailto:matt@boostkit.io`. No form, no backend — single-recipient pitch. | New copy, placeholder figures above |
| `/timeline` | Phased plan, framed as "weeks from kickoff" (not tied to real dates, since the rebuild isn't actually starting from zero). | Adapted from today's `/visibility` timeline section |

## Content adaptation rules

- Evidence figures (ranking keywords, DA, LLM citation results, crawl findings)
  carry over as-is — they're facts about the live Wix site today and remain
  true regardless of rebuild progress.
- Any copy that currently reads as "the new site does X" gets rewritten as
  "the rebuild will do X" (future tense, scope commitment, not a status report).
- Drop anything that implies work-in-progress specifics (no dates tied to
  actual rebuild commits, no percentage-complete language).

## Migration mechanics

1. Branch `proposal` off current `main` tip.
2. On `proposal`: scaffold `proposal/` as its own Next.js app; port and rewrite
   the evidence/scope/timeline content from the three existing pages into the
   new structure; build `/`, `/pricing` new from scratch.
3. On `main`: separate commit deleting `src/app/(site)/comparison/`,
   `src/app/(site)/visibility/` (incl. `get-listed/`), and their `sitemap.ts`
   entries.
4. Push both. Create the `bicycleproposal` Vercel project pointed at the
   `proposal` branch with root directory `proposal/`.

## Out of scope

- No CMS, no Convex/Resend wiring, no contact form for the proposal site.
- No password gate (noindex + unlisted URL only, per decision 6).
- No reuse of Boostkit's own case studies/portfolio content — keeping this
  focused on Bicycle's specific evidence and scope, not a general capabilities
  pitch.
