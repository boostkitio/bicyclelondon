# Bicycle London rebuild: design spec

Date: 2026-06-25
Status: approved, in build

## Goal

Rebuild the current Wix site at bicyclelondon.com as a Next.js + Vercel site with
Sanity for editable content, as a faithful-but-improved clone of the existing site.
A full brand relaunch is planned later in the year; this build keeps the current
brand and structure while fixing the UX, performance and SEO problems found in the
Wix version. A secondary, ongoing goal is to make Bicycle the best-ranked
independent media agency in the UK through a post-launch SEO programme.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- Sanity (embedded Studio at `/studio`) for Slipstream articles, case studies, jobs
- Convex for form-submission storage
- Resend for transactional email
- Vercel hosting, GitHub `boostkitio/bicyclelondon`, auto-deploy on push
- Newsletter ("The Peloton") stays on Substack; an on-site signup feeds it

## Routes

```
/                  /about            /purpose          /contact-us
/bicycle           /bicycle-blade    /bicycle-studio   /bicycle-ripple
/international      /the-peloton
/work              /work/[slug]
/slipstream        /slipstream/[slug]            (+ category filtering)
/careers           /careers/[slug]
/privacy-policy    /cookie-policy    /modern-slavery
/studio/[[...tool]]
sitemap.ts  robots.ts  llms.txt
```

Old URL-encoded Wix slugs (for example `/slipstream/x%3B-bargain-reach%2C--but-at-what-cost%3F`
and trailing-dot slugs like `/slipstream/tv-stays-on-top.`) are replaced with clean
slugs and 301-redirected so no existing SEO equity is lost.

## Sanity content models

- `slipstreamArticle`: title, slug, standfirst, category (ref), issue number, hero
  image, author (ref), publishedAt, Portable Text body, SEO fields
- `caseStudy`: client, logo, hero, slug, challenge, solution, results (metrics),
  services, gallery, body, SEO
- `job`: title, slug, team, location, type, summary, responsibilities,
  requirements, apply email, active flag, SEO
- `author`: name, role, image, bio
- `category`: title, slug
- `client`: name, logo, url (homepage logo wall)
- `siteSettings` (singleton): phone, WhatsApp, emails, address, social links,
  default OG/SEO

Marketing/service pages (home, about, purpose, the six "And" units) are static
React in code; they change rarely and benefit from bespoke layout.

## Forms (Convex + Resend)

`submissions` table with `type` of `contact` or `application`. Flow: server action →
Zod validation + honeypot + rate-limit → store in Convex → await Resend email
(contact to info@, applications to jobs@). No fire-and-forget sends.

## SEO layer

- Per-page Metadata API: titles with template, descriptions, canonicals, OG/Twitter
- JSON-LD: Organization, WebSite, Article, BreadcrumbList, JobPosting
- Dynamic sitemap from Sanity + static routes; robots.ts; llms.txt
- next/image, next/font (Raleway), static/ISR rendering
- Clean slugs, 301 redirects from old Wix URLs

## Known issues in the current site to fix during the build

1. URL-encoded and trailing-dot slugs (bad for SEO)
2. `/work` listing reuses the same hero image on every case-study tile
3. Slipstream index images are mostly empty-state placeholders
4. Inconsistent contact details (two WhatsApp numbers, two phone numbers) - confirm correct ones with Matt
5. Bicycle Ripple "Read more" on the homepage is not linked
6. All assets on the Wix CDN with baked-in crops; migrate to Sanity/next image
7. Weak/missing page titles and no structured data

## Universal conventions (from global CLAUDE.md)

- Logo click returns to top of homepage, including when already on `/`
- Scroll resets to top on every client-side navigation (no global smooth-scroll)
- Human-readable slugs in URLs, never raw IDs
- UK English throughout

## Open confirmations needed from Matt during build

- Correct phone and WhatsApp numbers
- Sign-off to rebuild the three legal PDFs (Modern Slavery, Cookie, Privacy) as
  real HTML pages

## Build sequence

1. Scaffold + GitHub + Vercel (live URL early)
2. Sanity + Convex + Resend setup
3. Full content scrape + migration into Sanity
4. Build pages + SEO layer + redirects
5. QA (Playwright desktop/mobile + Lighthouse) + deploy
6. Domain cutover (Wix to Vercel) later, on Matt's signal
