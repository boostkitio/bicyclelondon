import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumb, faqPageSchema, webPageSchema } from "@/lib/schema";
import { TrendChart, CompareBars, SplitBar } from "@/components/charts/audit-charts";

export const metadata: Metadata = {
  title: "Search and AI visibility: where Bicycle stands and the plan",
  description:
    "Live evidence of where Bicycle London sits in Google and in AI assistants today, why competitors are recommended and Bicycle is not, and a phased plan to fix it. Built from DataForSEO, Semrush and direct ChatGPT, Perplexity and Gemini queries.",
};

// All figures below are from live pulls run on 30 June 2026:
// DataForSEO (UK index), Semrush (uk database), an Apify crawl of the live
// site, and direct queries to ChatGPT, Perplexity and Gemini with web search on.

const llmTest = [
  {
    engine: "ChatGPT",
    model: "web search on",
    named:
      "the7stars, Mostly Media, Republic of Media, Medialab, Goodstuff, Total Media, Brainlabs, Croud and more",
    bicycle: "Not mentioned",
  },
  {
    engine: "Perplexity",
    model: "sonar-pro",
    named:
      "Medialab, Mostly Media, The Kite Factory, plus the main independent-agency directories",
    bicycle: "Not mentioned",
  },
  {
    engine: "Gemini",
    model: "2.5 Pro",
    named:
      "Medialab, Republic of Media, ROAST, VCCP Media, JACK RYAN and others",
    bicycle: "Not mentioned",
  },
];

const citationSources = [
  "Land of Independents",
  "Alliance of Independent Agencies",
  "The Drum Indie Agency 100",
  "Campaign",
  "Marketing Agency Index",
  "Clutch",
  "PMLive",
  "Prolific North",
  "GoodFirms",
  "Reddit r/advertising",
];

const today = [
  {
    metric: "~30",
    label: "ranking keywords (UK)",
    detail:
      "The current site ranks for roughly 30 keywords in the UK index. Every independent below ranks for 71 to 113. That is the gap in plain numbers.",
    source: "DataForSEO",
  },
  {
    metric: "85%",
    label: "of organic value is one branded term",
    detail:
      "About 85% of the site's estimated organic value comes from the single search 'bicycle london'. Strip the brand name out and very little is left.",
    source: "DataForSEO, top keywords",
  },
  {
    metric: "-28%",
    label: "organic visibility since January",
    detail:
      "Estimated organic value has fallen from about 1,445 to 1,038 in six months, while competitors have been adding keywords every month.",
    source: "DataForSEO, 6-month history",
  },
  {
    metric: "0",
    label: "mentions across 3 AI assistants",
    detail:
      "Asked to recommend an independent UK media agency, ChatGPT, Perplexity and Gemini named a combined two dozen agencies. Bicycle was in none of them.",
    source: "Live LLM queries",
  },
  {
    metric: "166",
    label: "referring domains",
    detail:
      "The link profile that signals authority. Competitors carry between 215 and 827 referring domains pointing at them.",
    source: "Semrush",
  },
  {
    metric: "0.33",
    label: "AI-agent readability",
    detail:
      "Lighthouse's 'agentic browsing' score, how cleanly an AI assistant can read the site. Thin content and broken metadata leave little to quote.",
    source: "Lighthouse",
  },
];

const trendData = [
  { label: "Jan", value: 1445 },
  { label: "Feb", value: 1165 },
  { label: "Mar", value: 1051 },
  { label: "Apr", value: 1078 },
  { label: "May", value: 1037 },
  { label: "Jun", value: 1038 },
];

const keywordBars = [
  { label: "the7stars", value: 88 },
  { label: "The Kite Factory", value: 76 },
  { label: "Medialab", value: 73 },
  { label: "Republic of Media", value: 72 },
  { label: "Mostly Media", value: 71 },
  { label: "Bicycle London", value: 30, highlight: true },
];

const refDomainBars = [
  { label: "Republic of Media", value: 827 },
  { label: "The Kite Factory", value: 644 },
  { label: "the7stars", value: 635 },
  { label: "Medialab", value: 416 },
  { label: "Mostly Media", value: 215 },
  { label: "Bicycle London", value: 166, highlight: true },
];

const benchmarkRows = [
  { agency: "the7stars", keywords: "88", authority: "32", refs: "635", llm: "Yes" },
  { agency: "The Kite Factory", keywords: "76", authority: "25", refs: "644", llm: "Yes" },
  { agency: "Medialab", keywords: "73", authority: "26", refs: "416", llm: "Yes, all three" },
  { agency: "Republic of Media", keywords: "72", authority: "24", refs: "827", llm: "Yes" },
  { agency: "Mostly Media", keywords: "71", authority: "18", refs: "215", llm: "Yes" },
  {
    agency: "Bicycle London",
    keywords: "30",
    authority: "21",
    refs: "166",
    llm: "No",
    highlight: true,
  },
];

const whyInvisible = [
  "AI assistants do not read the whole web in real time. They assemble these answers from a small set of trusted sources: independent-agency directories, award lists and trade press.",
  "Competitors appear because they are listed and ranked in those sources. Bicycle is largely absent from them, so there is nothing for the model to pull in.",
  "When the models do reach the site, there is little to quote: around 13 pages, a 268-word homepage, case studies with broken metadata, and an agent-readability score of 0.33.",
  "The brand name adds friction. The site also surfaces for 'cycling jobs' and 'bike advertising', so part of its footprint is filed under cycling rather than advertising.",
];

const gap = [
  {
    title: "They are in the directories AI reads",
    detail:
      "Land of Independents, the Alliance of Independent Agencies, Clutch and Marketing Agency Index were all cited in the AI answers. Competitors hold profiles there. Bicycle does not.",
  },
  {
    title: "They enter and win awards",
    detail:
      "The Drum Indie Agency 100, Campaign's independent rankings and the Alliance Awards become citations the models trust. Bicycle has very little of this footprint.",
  },
  {
    title: "They earn trade-press coverage",
    detail:
      "Campaign, The Drum and Prolific North write about them, and AI assistants quote those articles. Bicycle generates little ongoing press to be quoted from.",
  },
  {
    title: "They publish deep, quotable content",
    detail:
      "Effectiveness points of view, data and case studies with real results give models and journalists something to cite. The current 13-page site offers almost none.",
  },
  {
    title: "They are readable by machines",
    detail:
      "Clean structured data, clear agency facts and consistent metadata let an AI extract who they are and what they do. Bicycle's metadata is broken in places and its facts are buried.",
  },
  {
    title: "They concentrate their authority",
    detail:
      "Hundreds of referring domains pointing at one site. Bicycle has 166, split further by a separate careers subdomain, so the signal is weaker and divided.",
  },
];

const workstreams = [
  {
    n: "01",
    title: "Get into the sources AI cites",
    detail:
      "Claim and optimise listings on Land of Independents, the Alliance of Independent Agencies, Clutch, Marketing Agency Index and The Drum, plus Crunchbase and a credible Wikipedia footprint. Enter the awards that feed those lists.",
  },
  {
    n: "02",
    title: "Build quotable, machine-readable content",
    detail:
      "A steady Slipstream cadence of data-led, answer-first points of view, five topic hubs, deeper case studies with results, and a clear agency-facts structure with full Organization schema an AI can extract.",
  },
  {
    n: "03",
    title: "Earn citations and coverage",
    detail:
      "Proactive PR and commentary into Campaign, The Drum and Prolific North around results, new business, hires and B Corp status, so there is a stream of third-party articles for the models to quote.",
  },
  {
    n: "04",
    title: "Fix the technical foundation",
    detail:
      "Ship the Next.js rebuild, consolidate the careers subdomain, repair metadata, add structured data and llms.txt, and protect the existing branded equity with mapped redirects.",
  },
  {
    n: "05",
    title: "Measure what matters",
    detail:
      "Re-run this exact LLM-mention test every month across ChatGPT, Perplexity and Gemini, alongside Search Console, GA4, rank tracking and referring-domain growth, so progress is visible and tied to enquiries.",
  },
];

const timeline = [
  {
    window: "Days 0 to 30",
    focus: "Foundations",
    detail:
      "Launch the rebuild, fix metadata, schema and llms.txt, baseline today's rankings and AI mentions, and claim the priority directory listings.",
  },
  {
    window: "Days 30 to 90",
    focus: "Authority",
    detail:
      "Publish the first topic hubs and answer-first articles, submit award entries, begin PR outreach, and consolidate the careers subdomain.",
  },
  {
    window: "Days 90 to 180",
    focus: "Compounding",
    detail:
      "Hold a steady content and PR cadence, watch AI mentions and non-branded rankings rise, and double down on the topics that turn into enquiries.",
  },
];

const faqs = [
  {
    question: "Why don't AI assistants recommend Bicycle?",
    answer:
      "AI assistants build these answers from a small set of trusted third-party sources: independent-agency directories, award lists and trade press. Competitors are listed and ranked in those sources; Bicycle is largely absent. The site itself also gives the models very little quotable, machine-readable content to draw on.",
  },
  {
    question: "How was this measured?",
    answer:
      "By asking ChatGPT, Perplexity and Gemini directly, with web search enabled, to recommend an independent UK media agency, and recording who they named and which sources they cited. The search and authority figures come from live DataForSEO and Semrush pulls and an Apify crawl, all run on 30 June 2026.",
  },
  {
    question: "Is the current site penalised or broken?",
    answer:
      "No. It is indexable and technically healthy. The issue is reach and authority, not a penalty: it ranks for very few terms, almost all of them the brand name, and it is missing from the places that feed both Google and the AI engines.",
  },
  {
    question: "Can this realistically be fixed?",
    answer:
      "Yes, and the competitors are the proof. They are not bigger because of a secret. They are simply present in the directories, awards, press and content that visibility is built from. The plan is to do the same, deliberately, and to measure it monthly.",
  },
];

export default function VisibilityPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Search and AI visibility: where Bicycle stands and the plan",
          path: "/visibility",
          description:
            "Live evidence of where Bicycle London sits in Google and in AI assistants, why competitors are recommended and Bicycle is not, and a phased plan to fix it.",
        })}
      />
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Search and AI visibility", path: "/visibility" },
        ])}
      />

      <PageHero
        eyebrow="Search and AI visibility audit"
        title="Where Bicycle stands, and why"
        lead="Type 'recommend me a good independent media agency in the UK' into ChatGPT and Bicycle is nowhere, while the competitors are everywhere. Here is the live evidence of why, and the plan to change it."
      />

      <Section tone="navy">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The test
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            One question, three AI assistants
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            I asked the three assistants most people now use, with live web search
            switched on, to recommend a good independent media agency in the UK.
            Between them they named more than twenty agencies. Bicycle was not one
            of them.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {llmTest.map((row) => (
            <article
              key={row.engine}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl uppercase text-white">
                  {row.engine}
                </h3>
                <span className="text-xs uppercase tracking-widest text-white/40">
                  {row.model}
                </span>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                It recommended
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {row.named}
              </p>
              <p className="mt-5 rounded-xl bg-black/30 px-4 py-3 text-sm font-semibold text-brand">
                Bicycle London: {row.bicycle}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-[auto_1fr]">
          <span className="font-display text-7xl leading-none text-brand sm:text-8xl">
            0
          </span>
          <p className="text-lg leading-relaxed text-white/80">
            mentions of Bicycle London across all three assistants. The same
            agencies came up again and again, pulled from a handful of trusted
            sources. Those sources are listed further down, and Bicycle is missing
            from nearly all of them.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Where Bicycle sits today
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            A small footprint, drifting down
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            The site is not broken. It is simply under-built for search, and the
            little visibility it has is almost all the brand name. Every number
            here is from a live third-party pull.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {today.map((item) => (
            <article
              key={item.label}
              className="flex flex-col rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <span className="font-display text-6xl leading-none text-ink">
                {item.metric}
              </span>
              <p className="mt-3 text-base font-semibold text-ink">{item.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-black/65">
                {item.detail}
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest text-black/40">
                {item.source}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-paper p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">
              Estimated organic value, last 6 months
            </h3>
            <div className="mt-6 text-ink">
              <TrendChart
                data={trendData}
                caption="Down about 28% since January, while competitors added keywords month on month. Source: DataForSEO, UK."
              />
            </div>
          </div>
          <div className="rounded-3xl bg-paper p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">
              What that traffic is actually made of
            </h3>
            <p className="mt-4 text-black/65">
              Strip out the brand name and the commercial footprint is tiny.
            </p>
            <div className="mt-8">
              <SplitBar
                segments={[
                  {
                    label: "Brand-name searches ('bicycle london')",
                    value: 85,
                    color: "#08124d",
                  },
                  {
                    label: "Everything else",
                    value: 15,
                    color: "#00d400",
                    textOnLight: true,
                  },
                ]}
                caption="Around 85% of estimated organic value comes from one branded term. New business rarely starts by searching the brand by name."
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            The competitive picture
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Bicycle vs the agencies it is up against
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These are the independents the AI assistants actually recommend. Even
            the smaller ones rank for more than twice as many keywords as Bicycle,
            and they carry more of the authority signals that search and AI rely
            on.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">Ranking keywords (UK)</h3>
            <p className="mt-2 text-sm text-black/55">
              How many searches each agency shows up for. Source: DataForSEO.
            </p>
            <div className="mt-6">
              <CompareBars items={keywordBars} />
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 ring-1 ring-black/5">
            <h3 className="font-display text-2xl uppercase">Referring domains</h3>
            <p className="mt-2 text-sm text-black/55">
              Distinct sites linking in, a core authority signal. Source: Semrush.
            </p>
            <div className="mt-6">
              <CompareBars items={refDomainBars} />
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-black/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-navy text-white">
              <tr>
                <th className="px-5 py-4 font-semibold">Agency</th>
                <th className="px-5 py-4 font-semibold">Ranking keywords (UK)</th>
                <th className="px-5 py-4 font-semibold">Authority score</th>
                <th className="px-5 py-4 font-semibold">Referring domains</th>
                <th className="px-5 py-4 font-semibold">In AI answers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {benchmarkRows.map((row) => (
                <tr key={row.agency} className={row.highlight ? "bg-brand/10" : ""}>
                  <th className="px-5 py-4 font-semibold text-ink">{row.agency}</th>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.keywords}</td>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.authority}</td>
                  <td className="px-5 py-4 tabular-nums text-black/70">{row.refs}</td>
                  <td
                    className={
                      row.highlight
                        ? "px-5 py-4 font-bold text-ink"
                        : "px-5 py-4 text-black/70"
                    }
                  >
                    {row.llm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-black/55">
          Authority score is Semrush&apos;s 0 to 100 measure of a domain&apos;s
          backlink strength. Bicycle is mid-table on authority but bottom on
          keywords and referring domains, and the only agency here absent from the
          AI answers.
        </p>
      </Section>

      <Section tone="navy">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The mechanism
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Why the AI engines can&apos;t see Bicycle
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {whyInvisible.map((item) => (
            <p
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 leading-relaxed text-white/80"
            >
              {item}
            </p>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The sources the assistants cited
          </p>
          <p className="mt-3 max-w-3xl text-white/70">
            These are the directories, rankings and titles the answers were built
            from. Competitors appear across them. Bicycle appears on almost none.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {citationSources.map((src) => (
              <span
                key={src}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                {src}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            The gap
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            What the competitors do that Bicycle does not
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            None of this is a secret advantage. It is a set of deliberate habits
            that build visibility for both Google and the AI engines.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {gap.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl bg-paper p-7 ring-1 ring-black/5"
            >
              <h3 className="font-display text-2xl uppercase">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-black/70">{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            The plan
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Five workstreams to close the gap
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            The rebuild is the foundation, not the finish line. Visibility comes
            from running these five workstreams together and measuring them.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {workstreams.map((item) => (
            <article
              key={item.n}
              className="rounded-3xl bg-white p-7 ring-1 ring-black/5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-brand-ink">{item.n}</span>
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
            The first six months
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            How it phases
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {timeline.map((item) => (
            <article
              key={item.window}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                {item.window}
              </span>
              <h3 className="mt-3 font-display text-3xl uppercase">{item.focus}</h3>
              <p className="mt-4 leading-relaxed text-white/75">{item.detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            The goal
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Within six months, when someone asks an AI assistant for an
            independent UK media agency, Bicycle should be in the answer, sitting
            alongside the names it already competes with for real pitches. The
            monthly mention test is how that progress gets proven.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/comparison" variant="primary">
              See the rebuild comparison
            </ButtonLink>
            <ButtonLink href="/contact-us" variant="white">
              Talk through the plan
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Questions agents and search engines need answered
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Visibility FAQ
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
