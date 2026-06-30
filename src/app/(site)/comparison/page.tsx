import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumb, faqPageSchema, webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Current site vs the rebuild: search, SEO and the plan",
  description:
    "A practical comparison of Bicycle London's current Wix site and the new Next.js/Vercel rebuild: live search-visibility evidence, the technical gaps the rebuild closes, what changes for the better, and the phased plan to build it out.",
};

const scores = [
  {
    label: "Current Wix site",
    score: "6.0",
    summary:
      "Indexable and broadly healthy, but built on a platform that limits metadata, headings, content depth and migration control, so very little of the agency's expertise reaches search.",
  },
  {
    label: "New Next.js/Vercel site",
    score: "9.2",
    summary:
      "A stronger technical base: dynamic sitemaps, richer schema, controlled redirects, cleaner metadata, AI-search support and agent-readable content, with room to publish and grow.",
  },
];

// Live search-visibility evidence (UK), from a DataForSEO / Semrush pull and an
// Apify crawl run on 30 June 2026. Numbers are third-party estimates, not
// Search Console truth, but they triangulate well across sources.
const findings = [
  {
    metric: "~30",
    label: "ranking keywords (UK)",
    detail:
      "The current site ranks for roughly 30 keywords in the UK index (86 across all regions). That is the search footprint of a small local business, not a national agency.",
    source: "DataForSEO",
  },
  {
    metric: "92%",
    label: "of visibility is the brand name",
    detail:
      "Almost all organic traffic comes from people already searching 'Bicycle London'. Generic, new-business terms like 'media agency London' bring in next to nothing.",
    source: "DataForSEO, top 25 keywords",
  },
  {
    metric: "-28%",
    label: "organic visibility since January",
    detail:
      "Estimated organic value has slipped from about 1,445 to 1,038 over six months, shedding 20 to 40 keywords every month. The trend is gently downward, not upward.",
    source: "DataForSEO, 6-month history",
  },
  {
    metric: "21/100",
    label: "domain authority",
    detail:
      "166 referring domains and 309 backlinks. Respectable for a young agency, but not yet enough to outrank established competitors on the terms that win pitches.",
    source: "Semrush",
  },
  {
    metric: "13",
    label: "indexable pages on the main domain",
    detail:
      "A full crawl found about 13 pages, a 268-word homepage and no insights hub. There is very little for search engines to index against industry topics.",
    source: "Live crawl (Apify)",
  },
  {
    metric: "0.33",
    label: "AI-agent readability",
    detail:
      "Lighthouse's 'agentic browsing' check, how readable the site is to AI assistants, scores 0.33. That matters more every month as buyers research through ChatGPT and AI Overviews.",
    source: "Lighthouse",
  },
];

const holdingBack = [
  "The brand name pulls in the wrong intent. The site picks up searches like 'cycling jobs' and 'bike advertising', so part of its authority is filed by Google under cycling rather than advertising.",
  "Career content sits on a separate careers.bicyclelondon.com subdomain, which splits authority instead of concentrating it on one domain.",
  "Case study pages output a raw record ID where the meta description should be, so Google results and social previews have nothing useful to show.",
  "Forty-eight homepage images carry no alt text and the page ships around 14MB, which holds back both accessibility and AI parsing.",
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
    area: "Search footprint",
    wix: "Around 30 ranking keywords, almost entirely the brand name, with visibility drifting down since January.",
    next:
      "A publishing platform built to add non-branded, commercial pages over time so the site can rank for what the agency sells.",
    winner: "Next",
  },
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
    wix: "Live crawl found 11 missing meta descriptions, and case study pages output a raw ID in place of a description.",
    next:
      "Route-level metadata exists and Sanity records supply article, case study and job descriptions.",
    winner: "Next",
  },
  {
    area: "Headings",
    wix: "Live crawl found 6 pages with a non-1 H1 count, including old posts with no H1.",
    next:
      "Page templates use controlled hero/title components and a predictable H1 structure.",
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
    wix: "Robots is permissive for standard crawlers, but AI-search policy and context are not explicit, and agent readability scores 0.33.",
    next:
      "robots.txt explicitly allows major AI/search bots and /llms.txt provides agent-readable context.",
    winner: "Next",
  },
  {
    area: "Performance control",
    wix: "Served by Wix/Pepyaka with less control over rendering and a roughly 14MB payload.",
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

const doDifferently = [
  {
    title: "Build a content engine, not a brochure",
    detail:
      "Publish Slipstream on a steady cadence and group it into topic hubs (media planning, performance, creative effectiveness, retail media and measurement) so the site earns rankings for what the agency does, not just for its own name.",
  },
  {
    title: "Fix the fundamentals Wix left behind",
    detail:
      "Hand-written titles and descriptions, one clean H1 per page, image alt text and full structured data on every template, all server-rendered so search engines and AI assistants read them reliably.",
  },
  {
    title: "Concentrate authority on one domain",
    detail:
      "Map every live URL, 301-redirect legacy and archive paths, and resolve the careers subdomain so link equity compounds in one place instead of being split across two.",
  },
  {
    title: "Be genuinely readable to AI search",
    detail:
      "Explicit robots rules for AI crawlers, an llms.txt context file and answer-first blocks on key articles, so ChatGPT, Perplexity and Google's AI surfaces can quote the agency accurately.",
  },
  {
    title: "Protect what already works",
    detail:
      "Keep the branded search equity and the one thing Wix did well, speed, by shipping a lean Next.js build on Vercel and verifying every redirect at cutover.",
  },
  {
    title: "Measure everything from day one",
    detail:
      "Connect Search Console, GA4 and rank tracking immediately so every technical gain ties back to impressions, clicks, queries and new-business enquiries.",
  },
];

const plan = [
  {
    phase: "Phase 1",
    title: "Foundations",
    status: "Mostly complete",
    detail:
      "Rebuild on Next.js and Sanity, crawl and map the 51-URL Wix sitemap, add redirects, route-level metadata, structured data, robots rules and llms.txt.",
    outcome: "A launch-ready base that protects existing search equity.",
  },
  {
    phase: "Phase 2",
    title: "Cutover and verify",
    status: "Next",
    detail:
      "Move DNS from Wix to Vercel, submit the new sitemap, connect Search Console and GA4, then verify index coverage, redirects and a baseline of rankings.",
    outcome: "A clean switch with measurement live from the first day.",
  },
  {
    phase: "Phase 3",
    title: "Content and authority",
    status: "Weeks 2 to 12",
    detail:
      "Establish a Slipstream cadence, build the five topic hubs, add answer-first blocks, deepen the case studies, strengthen internal linking and consolidate careers.",
    outcome: "The site starts ranking for non-branded, commercial terms.",
  },
  {
    phase: "Phase 4",
    title: "Measure and compound",
    status: "Ongoing",
    detail:
      "Monthly Search Console and GA4 reporting, AI-visibility checks, rank tracking and iteration on the topics and pages that actually convert.",
    outcome: "Visibility that grows month on month, tied to enquiries.",
  },
];

const completedWork = [
  "Crawled the current Wix sitemap and captured 51 live URLs.",
  "Pulled live search data from DataForSEO and Semrush, plus a full Apify crawl, to evidence the current footprint.",
  "Mapped Wix URLs to new Next.js/Sanity routes.",
  "Added redirects for legacy Wix /post URLs and three changed Slipstream slugs.",
  "Made AI crawler access explicit in robots.txt while keeping /studio and /api blocked.",
  "Updated /llms.txt with agent-readable context and the canonical sitemap pointer.",
  "Built this comparison page and included it in the generated sitemap.",
  "Added richer schema for services, content collections, articles and this comparison page.",
];

const faqs = [
  {
    question: "Is the current site being penalised by Google?",
    answer:
      "No. The current site is indexable and technically healthy. The issue is reach, not a penalty: it ranks for very few terms, almost all of them the brand name, because the platform makes it hard to publish depth and control the SEO fundamentals.",
  },
  {
    question: "Has Bicycle's current Wix sitemap been mapped into the new site?",
    answer:
      "Yes. The current Wix sitemap was crawled, 51 live URLs were captured, and each URL has been mapped to a static Next.js route, a Sanity-powered content route, or a deliberate 301 redirect for legacy archive URLs.",
  },
  {
    question: "Will rankings drop when the site moves over?",
    answer:
      "The branded rankings are protected by a full URL map and explicit redirects, so the equity carries across. Non-branded rankings are expected to grow once the content engine in Phase 3 is publishing, rather than fall.",
  },
  {
    question: "Why does the new Next.js site score higher for SEO?",
    answer:
      "The new site gives Bicycle stronger control over metadata, generated sitemaps, redirects, structured data, robots policy, content modelling, page performance and AI-search readability than the current Wix implementation.",
  },
  {
    question: "Is the 9.2 score a ranking guarantee?",
    answer:
      "No. It is a technical SEO and AEO readiness score based on crawl and implementation evidence. Search Console, GA4 and ranking data are still needed to measure commercial search performance after launch.",
  },
];

export default function ComparisonPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Current site vs the rebuild: search, SEO and the plan",
          path: "/comparison",
          description:
            "A practical comparison of Bicycle London's current Wix site and the new Next.js/Vercel rebuild, with live search evidence and a phased build-out plan.",
        })}
      />
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "SEO/AEO comparison", path: "/comparison" },
        ])}
      />
      <PageHero
        eyebrow="Rebuild: search evidence and plan"
        title="Current site vs the rebuild"
        lead="Where the current Bicycle London site stands in search today, what the new build improves, what changes for the better, and the phased plan to build it all out properly."
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
          These two scores are a technical SEO/AEO readiness view, not a traffic
          or ranking score. The section below adds the commercial picture: how
          much the current site is actually found for, and why.
        </p>
      </Section>

      <Section tone="navy">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The evidence
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Why the current site is hard to find
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Everything here comes from live third-party data: a DataForSEO and
            Semrush pull and a full Apify crawl of the public site. The current
            site is not broken. It is simply built in a way that keeps most of
            the agency's expertise invisible to search engines and AI assistants.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {findings.map((item) => (
            <article
              key={item.label}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span className="font-display text-6xl leading-none text-brand">
                {item.metric}
              </span>
              <p className="mt-3 text-base font-semibold text-white">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {item.detail}
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-white/40">
                {item.source}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {holdingBack.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/75"
            >
              {item}
            </p>
          ))}
        </div>
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

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            The approach
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            What I&apos;ll do differently, and better
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            Six changes turn the site from a brochure that is only found by name
            into a platform that can win new business through search.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {doDifferently.map((item, index) => (
            <article
              key={item.title}
              className="rounded-3xl bg-white p-7 ring-1 ring-black/5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-brand-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              </div>
              <p className="mt-4 leading-relaxed text-black/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="navy">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The plan
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            How this gets built out
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Four phases, from a protected launch to a content engine that
            compounds. The first phase is largely done; the rest follow cutover.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {plan.map((item) => (
            <article
              key={item.phase}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                  {item.phase}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-4 font-display text-3xl uppercase">
                {item.title}
              </h3>
              <p className="mt-4 leading-relaxed text-white/75">{item.detail}</p>
              <p className="mt-5 border-t border-white/10 pt-4 text-sm text-white/60">
                <span className="font-semibold text-brand">Outcome: </span>
                {item.outcome}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
              Work completed
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
              Migration risk reduced before cutover
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-black/70">
              The job is not just making the new site look better. It is
              protecting the existing branded equity while creating a cleaner
              technical base for SEO, AEO and future reporting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/work" variant="primary">
                View work
              </ButtonLink>
              <ButtonLink href="/slipstream" variant="outline">
                Read Slipstream
              </ButtonLink>
            </div>
          </div>
          <ul className="space-y-3">
            {completedWork.map((item) => (
              <li
                key={item}
                className="rounded-2xl bg-paper px-5 py-4 text-black/75 ring-1 ring-black/5"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Questions agents and search engines need answered
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Migration FAQ
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
              <h3 className="font-display text-2xl uppercase">{item.question}</h3>
              <p className="mt-4 text-black/70">{item.answer}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
