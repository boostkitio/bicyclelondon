# Bicycle London — AI search & LLM visibility: findings and remediation roadmap

_Prepared by Matt West (Boostkit) · 28 June 2026_

## The question

When you ask an AI assistant "who are the top independent media agencies in the UK?", Bicycle does not appear, despite being a sizeable independent. This document explains exactly why, with evidence, and sets out a prioritised plan to fix it. It separates the work into three tracks: on-site (entity recognition), off-site (the citations that actually win these answers), and measurement (a dashboard to track progress).

---

## 1. What the AI engines actually say (evidence)

I ran the live query "top independent media agencies in the UK" through ChatGPT with web search on. It returned a ranked table naming: the7stars, Talon Outdoor, The Kite Factory, Brainlabs, Open Partners, Tug, Goodstuff, Total Media, Medialab Group and WYK Digital. Bicycle is not mentioned anywhere in the answer.

The decisive detail is **what it cited**. The entire answer is built from just two third-party sources:

1. **open.partners** — a competitor's own blog post, "Top UK Marketing Agencies for £5m+ Budgets" (published November 2025)
2. **thedrum.com** — The Drum's Independent Agency Census (media agencies list)

The lesson: for "who are the best X" questions, the models do not read agency websites and rank them. They lift the answer from third-party rosters, directories and listicles, then cite those. If Bicycle is not in those sources, there is nothing for the model to pull, regardless of how good bicyclelondon.com is.

**Second query, even sharper.** I then ran the exact phrasing a prospective client uses: "give me a list of 10 independent media agencies in the UK I should consider running my business with." ChatGPT returned ten agencies — the7stars, Total Media, Bountiful Cow, Crossmedia, Republic of Media, Mostly Media, The Specialist Works, December19, AMS Media Group, Pashn — and cited almost every one of them to a **single source**: a December19 press release, "December19 joins Alliance of Media Independents." In other words, the list is essentially the **AMI roster**, assembled from the press coverage of membership. Each agency's own homepage appears only as the link destination once it has already been selected. This is the clearest possible evidence that AMI membership plus its press coverage is the dominant lever for this exact question.

**What this means for the rebuild.** A better site has two distinct jobs. Getting *selected* for the list is won off-site, in these rosters and the press around them — a great site outside those sources is not picked, which is exactly why Bicycle's homepage did not appear. Being the *destination* once selected is where the new site matters: the models link to and cite the chosen agency's site, and a fast, crawlable, schema-rich site with a clean `Organization` + `sameAs` entity is a far stronger destination than the live Wix site. So the rebuild is necessary and a real multiplier, but it is the foundation, not the trigger. It earns recognition and gives you a citable home and a publishing platform; the roster and press work is what gets Bicycle named.

---

## 2. Why Bicycle is invisible — two stacked layers

Both of these are real, and they compound.

### Layer 1 — On-site (entity recognition)

What an AI crawler sees today is the **live Wix site**, not the Next.js rebuild (the domain has not cut over yet). I audited the live site:

**Working fine:**
- robots.txt is `* Allow: /`; AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot) are not blocked.
- A real `/llms.txt` exists and serves genuine content.
- Proper 404s, OG tags, title and meta description all present.

**Weak, and this is the on-site problem:**
- The structured data is thin and mis-typed. The site ships three JSON-LD blocks: `WebSite`, a duplicate `WebSite`, and a **`LocalBusiness`**. `LocalBusiness` is the schema type for a shop or restaurant, not a professional-services agency.
- **No `sameAs`.** The schema does not link Bicycle to its LinkedIn, X or Instagram profiles (or a Wikidata entry). `sameAs` is the single most important signal for tying scattered web mentions into one authoritative entity. Without it, Google's Knowledge Graph and the LLMs cannot confidently "know" who Bicycle London is.
- No logo, description, founding date or awards in the schema; homepage renders ~485 words; no awards or recognition surfaced; heavy Wix client-side JavaScript.

Net effect: the live site barely defines Bicycle as a notable entity, which suppresses recognition everywhere downstream.

### Layer 2 — Off-site (presence)

As section 1 shows, the list answers are assembled from third-party rosters and listicles. Bicycle is in none of the ones that matter (The Drum Indie Census, the Alliance of Media Independents roster, the listicles competitors publish). This is the dominant reason for the specific "top independent agencies" gap.

**The honest summary: on-site is necessary but not sufficient.** Fixing the site earns entity recognition; the presence work earns the citations. You need both.

---

## 3. Track A — On-site fixes (you control these)

### A1. Fix the live-site entity schema (quick win, do this week)

This is the highest-leverage on-site change you can make before the cutover. Add a proper `Organization` JSON-LD with `sameAs`, via Wix custom code (Wix dashboard → Settings → Custom Code → add to `<head>`, all pages). Use this as the basis:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bicycle London",
  "alternateName": "Bicycle",
  "url": "https://www.bicyclelondon.com",
  "logo": "https://www.bicyclelondon.com/your-logo.png",
  "description": "Bicycle is an independent, integrated media and creative agency founded in 2021, built on the power of 'and' — combining media, creative, digital, data and influencers under one roof.",
  "foundingDate": "2021",
  "email": "info@bicyclelondon.com",
  "telephone": "+442081527716",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "300 St John Street",
    "addressLocality": "Clerkenwell, London",
    "postalCode": "EC1V 4PA",
    "addressCountry": "GB"
  },
  "sameAs": [
    "https://www.linkedin.com/company/bicyclelondon/",
    "https://twitter.com/BicycleLDN",
    "https://www.instagram.com/bic.yclelondon/"
  ]
}
```

Notes:
- Add `"award"` entries (e.g. specific Thinkbox / Media Week / Campaign recognitions) once confirmed, and a `"sameAs"` Wikidata URL once it exists (see B2). Awards in schema are a strong authority signal.
- Wix auto-generates the `LocalBusiness` block from your Business Info settings. Correct the business category there if possible; the custom `Organization` block above supplements it. Long term, the cutover removes this conflict entirely.

### A2. Push the Wix → Vercel cutover

The rebuild already fixes the whole on-site layer: it ships correct `Organization` + `WebSite` schema with full `sameAs`, address and founding date, explicit AI-bot rules, an `llms.txt`, a structured comparison page, restructured article content and proper bylines. The cutover is itself an AI-readiness upgrade, not just a redesign. Prioritise it.

### A3. Strengthen on-page authority (E-E-A-T)

- A dedicated awards / recognition section with specific named awards, dates and the awarding body.
- Original data and stats on key pages (billings, growth, client results with numbers), each dated and sourced. Statistics lift AI citation by ~37%.
- Named author bios with credentials on Slipstream articles (now wired via the author records).
- A clear "what is an independent media agency / why independence matters" explainer page that defines the category in extractable, 40–60 word answer blocks.

---

## 4. Track B — Off-site presence (this is what wins the list answers)

Ordered by leverage.

### B1. Get into the rosters the models cite

- **The Drum Independent Agency Census** — the census ChatGPT cited directly. Make sure Bicycle is entered in the current edition. This is the most direct lever for this exact query.
- **Alliance of Media Independents (AMI) — the single highest-leverage move.** The second query above proved it: ChatGPT's "ten agencies to consider" list was the AMI roster, cited to a member's "we joined AMI" press release. Launched January 2025, founding members (the7stars, Total Media, Crossmedia, The Specialist Works, December19, Bountiful Cow, Republic of Media, Pashn, AMS Media Group and more) represent £800m+ in billings. On scale Bicycle would qualify. Joining, and announcing it on a citable page (the new site) plus trade press, is the most direct path to appearing in this exact answer.
- **Agency directories** — claim and fully complete profiles on Clutch, Sortlist, DesignRush and Agency Spotter. These rank for agency queries and feed AI answers.
- **Campaign** — get into Campaign's indie coverage, School Reports and agency rankings.

### B2. Create a Wikidata entry, then pursue Wikipedia

- **Wikidata** first (lower bar): create a structured entity for Bicycle London with the official site, socials, founding date and industry. This gives the Knowledge Graph and LLMs a canonical reference and a `sameAs` target.
- **Wikipedia** if notability can be supported by independent, third-party coverage (trade press, awards). Wikipedia is roughly 7.8% of all ChatGPT citations, so this is high value, but it requires genuine external coverage first (which B1 and B4 build toward).

### B3. Publish your own citable content

Open Partners ranks for this query because they wrote the listicle themselves. Copy the tactic, done well:

- A genuinely useful, well-structured guide such as "The UK's leading independent media agencies" or "How to choose an independent media agency", with a comparison table, clear criteria, dates and a named author. Comparison and listicle formats make up ~43% of all AI citations.
- A definitive "independent media agency" category explainer (see A3).

These assets can themselves be cited by the AI engines, and they earn links that strengthen the rosters in B1.

### B4. Earn third-party mentions (the engine behind everything above)

- Trade PR in The Drum, Campaign, Mediatel / The Media Leader (new business wins, hires, point-of-view pieces).
- Awards entries: Thinkbox, Media Week Awards, Campaign Media / Tech Awards, The Drum Awards. Wins become both schema `award` entries and third-party citations.
- Founder and leadership thought leadership: guest articles, podcasts, panels, LinkedIn.
- Authentic presence where relevant on Reddit, Quora and YouTube for agency-selection queries.

---

## 5. Track C — Measure it (the dashboard)

To know whether any of this is working, you need to watch the AI answers over time, not guess. The planned **AI Visibility dashboard** (Next.js + Convex) will:

- Run a fixed set of target prompts across ChatGPT, Perplexity, Gemini and Claude on a schedule.
- Record which agencies are mentioned and in what order (share of voice: Bicycle vs competitors, per engine, over time).
- Capture the cited sources for every answer and produce a ranked **source-gap list** — the exact pages and rosters to get into next.
- Run an **on-site AI-readiness audit** that scores schema, entity signals and crawlability, and compares the live Wix site against the rebuild (and re-checks after cutover).

**Target prompts to track** (starting set):
- top independent media agencies in the UK
- best independent media planning and buying agencies UK
- independent media agencies London
- alternatives to [holding-company] for media planning
- best media agency for [retail / FMCG / challenger brands]
- who are the UK's fastest-growing independent media agencies

**Brands to track:** Bicycle London vs the7stars, Goodstuff, Total Media, Brainlabs, Open Partners, Medialab, The Kite Factory, The Specialist Works, Bountiful Cow, Crossmedia.

---

## 6. Suggested sequence

| When | Action | Track |
|------|--------|-------|
| This week | A1 live-site `Organization` schema + `sameAs`; claim Clutch / Sortlist / Agency Spotter profiles; create Wikidata entry | A, B |
| Weeks 2–4 | Push the Wix → Vercel cutover; enter The Drum census; first citable guide published; awards entries in flight | A, B |
| Weeks 2–6 | Explore AMI membership; trade PR programme; stand up the dashboard to baseline share of voice | B, C |
| Ongoing | Refresh content quarterly; monitor share of voice and source gap; convert wins into schema awards + citations | All |

## 7. What success looks like

- Bicycle is listed in The Drum census and (ideally) the AMI roster, so the models have a source to cite.
- The entity is recognised: a Google knowledge panel resolves, `sameAs` links are consistent, Wikidata exists.
- The dashboard shows Bicycle's share of voice rising for the target prompts, quarter on quarter, with the source-gap list shrinking.

The single most important idea to hold onto: **for these questions, you are not optimising your website to rank, you are getting your name into the sources the models trust.** The site work earns recognition; the presence work earns the citations.
