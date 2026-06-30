import type { Metadata } from "next";
import { PageHero } from "@/components/page/page-hero";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumb, webPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Workstream 1: get listed where AI looks",
  description:
    "The month-one checklist for Bicycle London. The directories, registers, knowledge bases and awards that ChatGPT, Perplexity and Gemini cite, with verified links, priority, effort and the action for each.",
};

type Item = {
  n: string;
  title: string;
  url: string;
  kind: string;
  cost: string;
  effort: string;
  why: string;
  action: string;
  note?: string;
};

const tier1: Item[] = [
  {
    n: "01",
    title: "Land of Independents",
    url: "https://landofindependents.com",
    kind: "Independent-agency directory",
    cost: "Free to request",
    effort: "Low",
    why: "Cited directly by both ChatGPT and Perplexity, and it exists solely to list independent media agencies. Competitors like Republic of Media already have a profile here.",
    action:
      "Request a Bicycle London listing with the full agency description, the five service units, the Clerkenwell address and a link back to the site.",
    note: "Highest-priority single listing. It is specific to the exact query the client cares about.",
  },
  {
    n: "02",
    title: "Alliance of Independent Agencies",
    url: "https://allindependentagencies.org",
    kind: "Trade body and member directory",
    cost: "Paid membership",
    effort: "Medium",
    why: "Cited by Perplexity and Gemini. Members appear in the public directory, and membership is the gateway to the Alliance Awards used in workstream 3.",
    action:
      "Apply for membership, then complete the member-directory profile at /member-agencies-directory/.",
    note: "One step unlocks both a cited directory listing and a route into the awards.",
  },
  {
    n: "03",
    title: "Clutch",
    url: "https://clutch.co",
    kind: "B2B reviews directory",
    cost: "Free profile",
    effort: "Medium",
    why: "Referenced by Gemini and ranks well in Google for agency queries. Profiles are ranked by verified client reviews.",
    action:
      "Create and verify the company profile, then ask three to five clients to leave a short review.",
    note: "Bicycle has no profile yet. The reviews are the real work and the thing that makes the listing count.",
  },
  {
    n: "04",
    title: "The Drum Recommends",
    url: "https://www.thedrum.com/profile",
    kind: "Ratings and reviews register",
    cost: "Free to start",
    effort: "Medium",
    why: "The Drum was cited across the assistants, including its Indie Agency 100. A Recommends profile builds a rated presence on a source the models already trust.",
    action:
      "Create the agency profile and collect client ratings.",
    note: "Pairs with the Indie Agency 100 entry in workstream 3.",
  },
  {
    n: "05",
    title: "Marketing Agency Index",
    url: "https://www.marketingagencyindex.com/uk/ownership-model/independent",
    kind: "Curated independent index",
    cost: "Free to request",
    effort: "Low",
    why: "Cited by ChatGPT as a source of independent UK agencies. Bicycle is not in the independent list today.",
    action: "Request inclusion in the independent UK agencies index.",
  },
];

const tier2: Item[] = [
  {
    n: "06",
    title: "Crunchbase",
    url: "https://www.crunchbase.com",
    kind: "Company knowledge base",
    cost: "Free",
    effort: "Low",
    why: "A core structured source the models read for company facts: founding, location, leadership and category. Bicycle has no profile.",
    action:
      "Create the organisation profile: founded 2021, HQ in Clerkenwell, the service units, B Corp status and the leadership team.",
  },
  {
    n: "07",
    title: "B Corp directory",
    url: "https://bcorporation.eu/find-a-b-corp/",
    kind: "Certification directory",
    cost: "Free (with certification)",
    effort: "Low",
    why: "The site states Bicycle is a B Corp, and the directory is a trusted source the models and journalists draw on.",
    action:
      "Confirm the certification is current and the public directory listing is complete, on-message and links back to the site.",
    note: "Verify the certification status first, then optimise the entry.",
  },
  {
    n: "08",
    title: "Google Business Profile",
    url: "https://www.google.com/business/",
    kind: "Entity and local presence",
    cost: "Free",
    effort: "Low",
    why: "Feeds Google's knowledge panel and AI Overviews, and confirms the agency as a real, located entity.",
    action:
      "Claim and complete the profile: category Advertising agency, the Clerkenwell address, hours, services and photos.",
  },
  {
    n: "09",
    title: "LinkedIn company page",
    url: "https://www.linkedin.com/company/bicyclelondon/",
    kind: "Company knowledge source",
    cost: "Free",
    effort: "Low",
    why: "A primary source the assistants read for who a company is. The page already exists, so this is optimisation, not creation.",
    action:
      "Complete the About, specialties, website, location and tagline so they match the site word for word.",
  },
  {
    n: "10",
    title: "Wikidata",
    url: "https://www.wikidata.org",
    kind: "Open knowledge graph",
    cost: "Free",
    effort: "Medium",
    why: "Feeds the knowledge graphs behind search and the assistants. A clean, sourced entry helps the models recognise Bicycle as a defined entity.",
    action:
      "Create a Wikidata item with verified facts. Consider Wikipedia only once there is enough independent press to support notability.",
    note: "Wikipedia depends on the coverage earned in workstream 3, so treat it as a later step.",
  },
];

const tier3: Item[] = [
  {
    n: "11",
    title: "Alliance of Independent Agencies Awards",
    url: "https://allindependentagencies.org",
    kind: "Industry awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "The Indies are a citation source in their own right, and award wins are exactly what the assistants quoted for competitors.",
    action:
      "Plan entries for the next cycle once membership is in place.",
  },
  {
    n: "12",
    title: "The Drum Indie Agency 100 and Drum Awards",
    url: "https://www.thedrum.com/indie-agencies",
    kind: "Ranking and awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "The Indie Agency 100 was cited by Perplexity by name. Inclusion puts Bicycle on a list the models read.",
    action:
      "Submit for the Indie Agency 100 and the relevant Drum Awards categories.",
  },
  {
    n: "13",
    title: "Campaign and the Media Week Awards",
    url: "https://www.campaignlive.co.uk",
    kind: "Trade press and awards",
    cost: "Entry fee",
    effort: "Medium",
    why: "Campaign's independent rankings were cited by ChatGPT. Campaign coverage and award entries feed both Google and the assistants.",
    action:
      "Get on Campaign's radar with results-led stories and enter the relevant Media Week Awards categories.",
  },
];

const alsoWorth = [
  { label: "Sortlist", url: "https://www.sortlist.co.uk" },
  { label: "DesignRush", url: "https://www.designrush.com" },
  { label: "GoodFirms", url: "https://www.goodfirms.co" },
  { label: "The Manifest", url: "https://themanifest.com" },
];

function ItemCard({ item }: { item: Item }) {
  return (
    <article className="rounded-3xl bg-white p-7 ring-1 ring-black/5">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl text-brand-ink">{item.n}</span>
        <h3 className="font-display text-2xl uppercase">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-brand-ink decoration-2 underline-offset-4 hover:text-brand-ink"
          >
            {item.title}
          </a>
        </h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          {item.kind}
        </span>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          {item.cost}
        </span>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-black/60 ring-1 ring-black/5">
          Effort: {item.effort}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-black/65">
        <span className="font-semibold text-ink">Why it matters. </span>
        {item.why}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-black/65">
        <span className="font-semibold text-ink">Action. </span>
        {item.action}
      </p>
      {item.note && (
        <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm leading-relaxed text-black/60">
          {item.note}
        </p>
      )}
    </article>
  );
}

export default function GetListedPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: "Workstream 1: get listed where AI looks",
          path: "/visibility/get-listed",
          description:
            "The month-one checklist of directories, registers and awards that AI assistants cite, with verified links and the action for each.",
        })}
      />
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Search and AI visibility", path: "/visibility" },
          { name: "Get listed", path: "/visibility/get-listed" },
        ])}
      />

      <PageHero
        eyebrow="Workstream 1, month one"
        title="Get listed where AI looks"
        lead="AI assistants build their recommendations from a small set of trusted sources. This is the ordered checklist for getting Bicycle into them, with a verified link, the priority, the effort and the action for each."
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-black/70">
            The visibility audit showed that competitors get recommended because
            they are present in the directories, registers and award lists the
            assistants cite, and Bicycle is not. Most of these can be done in the
            first month, and most are free. I would work them in the order below.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl bg-navy p-8 text-white md:grid-cols-[auto_1fr]">
          <span className="font-display text-5xl leading-none text-brand sm:text-6xl">
            !
          </span>
          <p className="leading-relaxed text-white/80">
            One rule runs through all of this: keep the facts identical
            everywhere. Same agency name, founding year, Clerkenwell address,
            service units, B Corp status and one-line description on every listing.
            The assistants triangulate facts across sources, so consistency is what
            makes them trust the entry. A different address or description on each
            site quietly works against the whole effort.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Priority one
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The directories the assistants cited
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These five were named or cited directly in the live AI answers. They
            are the fastest route to appearing in the same recommendations as the
            competitors.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier1.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Priority two
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            The knowledge sources AI reads for facts
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These do not always show up as citations, but they are where the
            assistants learn who Bicycle is. Getting the facts right here improves
            every answer.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier2.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
            Priority three
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Awards and rankings to start now
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-black/70">
            These take longer to pay off because they run on entry cycles, so the
            work starts this month even though the wins land later.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {tier3.map((item) => (
            <ItemCard key={item.n} item={item} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-ink">
              Also worth a profile
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
              Quick wins to mop up
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-black/70">
              Lower priority than the cited sources, but each is a free, indexed
              profile that adds another consistent reference to the agency. Worth
              an afternoon once the priority listings are in.
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            {alsoWorth.map((d) => (
              <a
                key={d.label}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-navy px-5 py-3 font-display text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-navy hover:text-white"
              >
                {d.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="navy">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            How to know it is working
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase sm:text-5xl">
            Measure it the same way it was found
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">
            At the end of the month, I would re-run the exact test from the audit:
            ask ChatGPT, Perplexity and Gemini to recommend an independent UK media
            agency, and record whether Bicycle now appears and which of these new
            listings they cite. That turns the checklist into a tracked, repeatable
            measure rather than a one-off task.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/visibility" variant="primary">
              Back to the audit
            </ButtonLink>
            <ButtonLink href="/contact-us" variant="white">
              Talk through the plan
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
