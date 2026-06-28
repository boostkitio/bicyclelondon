import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Wix vs Next.js SEO comparison",
  description:
    "A practical comparison of Bicycle London's current Wix site and the new Next.js/Vercel rebuild, covering sitemap parity, redirects, metadata, structured data and AI-search readiness.",
};

const scores = [
  {
    label: "Current Wix site",
    score: "6.0",
    summary:
      "Indexable and broadly healthy, but limited by missing metadata, heading issues, platform bloat and less migration/control flexibility.",
  },
  {
    label: "New Next.js/Vercel site",
    score: "8.5",
    summary:
      "Stronger technical foundation with dynamic sitemaps, schema, controlled redirects, cleaner metadata and explicit AI-search support.",
  },
];

const sitemapRows = [
  ["Total live Wix URLs crawled", "51 URLs", "Matched through static routes, Sanity content or redirects"],
  ["Static pages", "13 URLs", "Core pages exist in the new site, plus this comparison page"],
  ["Slipstream articles", "25 URLs", "25 Sanity-backed article routes in the new site"],
  ["Work/case studies", "5 URLs", "5 Sanity-backed case study routes in the new site"],
  ["Career detail pages", "3 URLs", "3 active Sanity-backed job routes in the new site"],
  ["Legacy Wix /post issue pages", "5 URLs", "301 redirected to /slipstream because they are newsletter/archive pages"],
];

const comparisonRows = [
  {
    area: "Indexability",
    wix: "Wix sitemap is live and all crawled URLs returned 200.",
    next:
      "New sitemap is generated from static pages plus Sanity articles, case studies and jobs.",
    winner: "Tie / Next edge",
  },
  {
    area: "URL control and redirects",
    wix: "Several indexed URLs contain punctuation, encoded characters and legacy /post paths.",
    next:
      "Middleware normalises old Wix slugs and explicitly redirects legacy paths to the right new pages.",
    winner: "Next",
  },
  {
    area: "Metadata",
    wix: "Live crawl found 11 missing meta descriptions.",
    next:
      "Route-level metadata exists and Sanity records can supply article, case study and job descriptions.",
    winner: "Next",
  },
  {
    area: "Headings",
    wix: "Live crawl found 6 pages with non-1 H1 count, including old posts with no H1.",
    next:
      "Page templates use controlled hero/title components and predictable H1 structure.",
    winner: "Next",
  },
  {
    area: "Structured data",
    wix: "Not assessed as a strength in the crawl.",
    next:
      "Organisation, WebSite, breadcrumb, Article and JobPosting JSON-LD are present in the rebuild.",
    winner: "Next",
  },
  {
    area: "AI-search readiness",
    wix: "Robots is permissive for standard crawlers, but AI-search policy and context are not explicit.",
    next:
      "robots.txt explicitly allows major AI/search bots and /llms.txt provides agent-readable context.",
    winner: "Next",
  },
  {
    area: "Performance control",
    wix: "Served by Wix/Pepyaka with less control over rendering and payload.",
    next:
      "Next.js/Vercel gives tighter control over rendering, caching, image handling and Core Web Vitals.",
    winner: "Next",
  },
  {
    area: "Editorial workflow",
    wix: "Content sits inside Wix collections/pages.",
    next:
      "Sanity models separate Slipstream, work, jobs, authors, categories, clients and SEO fields.",
    winner: "Next",
  },
];

const completedWork = [
  "Crawled the current Wix sitemap and captured 51 live URLs.",
  "Mapped Wix URLs to new Next.js/Sanity routes.",
  "Added redirects for legacy Wix /post URLs and three changed Slipstream slugs.",
  "Made AI crawler access explicit in robots.txt while keeping /studio and /api blocked.",
  "Updated /llms.txt with agent-readable context and the canonical sitemap pointer.",
  "Added this /comparison page and included it in the generated sitemap.",
];

export default function ComparisonPage() {
  return (
    <>
      <PageHero
        eyebrow="SEO / AEO migration comparison"
        title="Wix vs Next.js"
        lead="A clear view of where the current Bicycle London site stands today, what the new build improves, and what still needs client-side search data to complete the picture."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {scores.map((item) => (
            <article
              key={item.label}
              className="rounded-3xl bg-paper p-8 ring-1 ring-black/5"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
                {item.label}
              </p>
              <div className="mt-5 flex items-end gap-3">
                <span className="font-display text-7xl leading-none">
                  {item.score}
                </span>
                <span className="pb-2 text-xl font-semibold text-black/50">
                  /10
                </span>
              </div>
              <p className="mt-5 text-lg leading-relaxed text-black/70">
                {item.summary}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-4xl text-sm leading-relaxed text-black/55">
          These scores are based on a crawl of the current public Wix site and an
          implementation audit of the local Next.js rebuild. They are technical
          SEO/AEO scores, not traffic or ranking scores. Google Search Console,
          GA4 and keyword/ranking data would make the scoring more commercially
          complete.
        </p>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Sitemap confirmation
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The current sitemap has been mapped into the new site
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            The current Wix sitemap was crawled and compared against the new
            Next.js/Sanity routes. The new site covers the live content via
            static routes, Sanity-driven pages and explicit redirects for legacy
            URLs that should not become standalone pages.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">Sitemap area</th>
                <th className="px-5 py-4 font-semibold">Current Wix site</th>
                <th className="px-5 py-4 font-semibold">New Next.js site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {sitemapRows.map(([area, wix, next]) => (
                <tr key={area}>
                  <th className="px-5 py-4 font-semibold text-ink">{area}</th>
                  <td className="px-5 py-4 text-black/70">{wix}</td>
                  <td className="px-5 py-4 text-black/70">{next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Technical comparison
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Where the new site wins
          </h2>
        </div>

        <div className="mt-10 grid gap-4">
          {comparisonRows.map((row) => (
            <article
              key={row.area}
              className="grid gap-5 rounded-3xl border border-black/10 p-6 md:grid-cols-[0.75fr_1fr_1fr_0.5fr]"
            >
              <h3 className="font-display text-2xl uppercase">{row.area}</h3>
              <p className="text-black/65">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-black/40">
                  Current Wix
                </span>
                {row.wix}
              </p>
              <p className="text-black/65">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-black/40">
                  New Next.js
                </span>
                {row.next}
              </p>
              <p className="self-start rounded-full bg-brand px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-black">
                {row.winner}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Work completed
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
              Migration risk reduced before cutover
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              The key job is not just making the new site look better. It is
              protecting existing search equity while creating a cleaner
              technical base for SEO, AEO and future reporting.
            </p>
          </div>
          <ul className="space-y-3">
            {completedWork.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl uppercase sm:text-5xl">
            What would move the new site closer to 10/10?
          </h2>
          <ol className="mt-8 space-y-4 text-lg leading-relaxed text-black/70">
            <li>
              <strong>1. Add GSC and GA4 data</strong> to connect technical
              improvements to impressions, clicks, queries and conversions.
            </li>
            <li>
              <strong>2. Fill every Sanity SEO field</strong> for priority pages,
              especially careers, case studies and high-value Slipstream articles.
            </li>
            <li>
              <strong>3. Add answer-first blocks</strong> to important Slipstream
              articles so AI answer engines can extract concise, citable points.
            </li>
            <li>
              <strong>4. Add topical hub pages</strong> for media planning,
              performance marketing, creative effectiveness, retail media and
              measurement.
            </li>
            <li>
              <strong>5. Monitor after cutover</strong> with redirect checks,
              sitemap submission, index coverage and ranking movement.
            </li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/work" variant="primary">
              View work
            </ButtonLink>
            <ButtonLink href="/slipstream" variant="outline">
              Read Slipstream
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
