// One-off migration: pulls content from the live Wix site (via Firecrawl) and
// writes it into Sanity. Idempotent (deterministic _ids + createOrReplace).
//
// Run:  node scripts/migrate.mjs
// Needs: .env.local (Sanity) and ../.env.boostkit-shared (FIRECRAWL_API_KEY)

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

// ---- env loading -----------------------------------------------------------
function loadEnv(path) {
  try {
    const txt = readFileSync(path, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* ignore */
  }
}
loadEnv(new URL("../.env.local", import.meta.url).pathname.replace(/^\//, ""));
loadEnv("C:/dev/projects/bicycle/.env.local");
loadEnv("C:/dev/projects/.env.boostkit-shared");

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!FIRECRAWL_API_KEY || !projectId || !token) {
  console.error("Missing env. Need FIRECRAWL_API_KEY, NEXT_PUBLIC_SANITY_PROJECT_ID, SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

// ---- helpers ---------------------------------------------------------------
const key = () => randomBytes(6).toString("hex");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

const JUNK =
  /^(top of page|bottom of page|skip to main content|back to all|subscribe to our newsletter|email ?\*?|submit|chat to us!?|play video|all videos|watch full video|read more|see our work|contact us|make a donation|meet the peloton|thanks for reading bicycle slipstream.*)$/i;

// A line is junk even when it arrives as a heading/list item — strip the
// markdown markers before testing so "## Subscribe to our Newsletter" is caught.
function isJunkLine(line) {
  const bare = line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/\\(.)/g, "$1")
    .trim();
  return JUNK.test(bare);
}

function cleanInline(s) {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/\*\*/g, "")
    .replace(/(^|\s)_(\S)/g, "$1$2")
    .replace(/(\S)_(\s|$)/g, "$1$2")
    .trim();
}

function block(style, text, extra = {}) {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    ...extra,
  };
}

function mdToBlocks(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let para = [];
  const flush = () => {
    if (para.length) {
      const text = cleanInline(para.join(" "));
      if (text) blocks.push(block("normal", text));
      para = [];
    }
  };
  for (let raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (isJunkLine(line)) continue;
    if (/^!\[.*\]\(.*\)$/.test(line)) continue; // standalone image
    if (line.startsWith("#### ")) { flush(); blocks.push(block("h4", cleanInline(line.slice(5)))); continue; }
    if (line.startsWith("### ")) { flush(); blocks.push(block("h3", cleanInline(line.slice(4)))); continue; }
    if (line.startsWith("## ")) { flush(); blocks.push(block("h2", cleanInline(line.slice(3)))); continue; }
    if (line.startsWith("# ")) { flush(); continue; } // page title, skip
    if (line.startsWith("> ")) { flush(); blocks.push(block("blockquote", cleanInline(line.slice(2)))); continue; }
    if (/^[-*]\s+/.test(line)) {
      flush();
      blocks.push(block("normal", cleanInline(line.replace(/^[-*]\s+/, "")), { listItem: "bullet", level: 1 }));
      continue;
    }
    para.push(line);
  }
  flush();
  return blocks;
}

function dateForIssue(issue, idx) {
  const months = ((issue || 1) - 1) * 2;
  const day = Math.min(3 + idx * 4, 27);
  return new Date(Date.UTC(2024, months, day)).toISOString();
}

function summaryFromBlocks(blocks) {
  const para = blocks.find(
    (b) =>
      b.style === "normal" &&
      b.children?.[0]?.text &&
      b.children[0].text.trim().length >= 40,
  );
  if (!para) return undefined;
  const text = para.children[0].text.trim();
  return text.length <= 220
    ? text
    : text.slice(0, 220).replace(/\s+\S*$/, "").trim() + "…";
}

function firstContentImage(md) {
  const re = /!\[[^\]]*\]\((https:\/\/static\.wixstatic\.com\/media\/[^)]+)\)/g;
  let m;
  while ((m = re.exec(md))) {
    const url = m[1];
    if (/logo|whitehires|b-corp|bicycle%20logos|asset%202_4x|asset%203_4x/i.test(url)) continue;
    return url.split(" ")[0];
  }
  return null;
}

async function scrape(url) {
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status} for ${url}`);
  const json = await res.json();
  if (!json.success) throw new Error(`Firecrawl failed for ${url}`);
  return json.data; // { markdown, metadata }
}

async function uploadImage(url, label) {
  if (!url) return undefined;
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const buf = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buf, {
      filename: `${slugify(label)}.jpg`,
    });
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: label,
    };
  } catch (e) {
    console.warn(`  image upload failed: ${e.message}`);
    return undefined;
  }
}

async function ensureCategory(title) {
  if (!title) return undefined;
  const slug = slugify(title);
  const _id = `category-${slug}`;
  await client.createOrReplace({
    _id,
    _type: "category",
    title,
    slug: { _type: "slug", current: slug },
  });
  return { _type: "reference", _ref: _id };
}

async function ensureClient(name) {
  if (!name) return undefined;
  const slug = slugify(name);
  const _id = `client-${slug}`;
  await client.createOrReplace({
    _id,
    _type: "client",
    name,
    showOnLogoWall: true,
    order: 100,
  });
  return { _type: "reference", _ref: _id };
}

// ---- datasets --------------------------------------------------------------
const BASE = "https://www.bicyclelondon.com";

const caseStudies = [
  { slug: "stansted-express", title: "Stansted Express", client: "Stansted Express", url: `${BASE}/work/stansted-express` },
  { slug: "papa-johns", title: "Papa Johns", client: "Papa Johns", url: `${BASE}/work/papa-johns` },
  { slug: "sarsons", title: "Sarson’s", client: "Sarson’s", url: `${BASE}/work/sarson's` },
  { slug: "moju", title: "MOJU", client: "MOJU", url: `${BASE}/work/moju` },
  { slug: "livescore", title: "LiveScore", client: "LiveScore", url: `${BASE}/work/livescore` },
];

const jobs = [
  { slug: "business-director", title: "Business Director", team: "Client Services", url: `${BASE}/careers/business-director` },
  { slug: "av-account-executive", title: "AV Account Executive", team: "AV", url: `${BASE}/careers/av-account-executive` },
  { slug: "data-analyst", title: "Data Analyst", team: "Data & Analytics", url: `${BASE}/careers/data-analyst` },
];

const articles = [
  { title: "Your Click Matters", category: "Social Media", issue: 4, url: `${BASE}/slipstream/your-click-matters` },
  { title: "Looking beyond the short-term: using integrated reporting to unlock business value", category: "Reporting", issue: 9, url: `${BASE}/slipstream/looking-beyond-the-short-term%3A-using-integrated-reporting-to-unlock-business-value` },
  { title: "Data and measurement are starving brand investment", category: "Measurement", issue: 9, url: `${BASE}/slipstream/data-and-measurement-are-starving-brand-investment` },
  { title: "Beyond the Programmatic Wild West - The Bicycle Xchange", category: "Programmatic", issue: 10, url: `${BASE}/slipstream/beyond-the-programmatic-wild-west---the-bicycle-xchange` },
  { title: "We take forever to hire people – here’s why that’s brilliant", category: "People", issue: 10, url: `${BASE}/slipstream/we-take-forever-to-hire-people-%E2%80%93-here's-why-that's-brilliant` },
  { title: "The death of the long-term agency contract", category: "Agency Life", issue: 10, url: `${BASE}/slipstream/the-death-of-the-long-term-agency-contract` },
  { title: "Shape What Britain Buys 2025: The Future of Retail Media", category: "Retail Media", issue: 8, url: `${BASE}/slipstream/shape-what-britain-buys-2025%3A-the-future-of-retail-media` },
  { title: "Netflix Overtakes BBC1: A Watershed Moment in UK Television Viewing", category: "Future of TV Advertising", issue: 8, url: `${BASE}/slipstream/netflix-overtakes-bbc1%3A-a-watershed-moment-in-uk-television-viewing` },
  { title: "TV stays on Top", category: "TV", issue: 1, url: `${BASE}/slipstream/tv-stays-on-top.` },
  { title: "Is there More to Sell than Emotion at Christmastime?", category: "Future of TV Advertising", issue: 1, url: `${BASE}/slipstream/is-there-more-to-sell-than-emotion-at-christmastime%3F` },
  { title: "X; Bargain reach, but at what cost?", category: "Twitter / X", issue: 1, url: `${BASE}/slipstream/x%3B-bargain-reach%2C--but-at-what-cost%3F` },
  { title: "Laziness Undermines Digital Advertising", category: "Digital Advertising", issue: 1, url: `${BASE}/slipstream/laziness-undermines-digital-advertising.` },
  { title: "Augmented Out of this World Creativity", category: "AR", issue: 1, url: `${BASE}/slipstream/augmented-out-of-this-world-creativity` },
  { title: "Bigger, Better, BARBier", category: "TV", issue: 4, url: `${BASE}/slipstream/bigger%2C-better%2C-barbier` },
  { title: "The power of AND into 2025", category: "Looking ahead", issue: 7, url: `${BASE}/slipstream/the-power-of-and-into-2025` },
  { title: "Growth… Not at the expense of culture", category: "Culture", issue: 7, url: `${BASE}/slipstream/growth%E2%80%A6-not-at-the-expense-of-culture` },
  { title: "‘There’s you and there’s Royal Ascot you’", category: "Marketing", issue: 4, url: `${BASE}/slipstream/%E2%80%98there%E2%80%99s-you-and-there%E2%80%99s-royal-ascot-you%E2%80%99` },
  { title: "Advertising through Kafka’s Eyes", category: "Philosophy", issue: 5, url: `${BASE}/slipstream/advertising-through-kafka%E2%80%99s-eyes` },
  { title: "Briefing the Bicycle Way", category: "Planning", issue: 5, url: `${BASE}/slipstream/briefing-the-bicycle-way` },
  { title: "Green is the New Gold", category: "Sustainability", issue: 5, url: `${BASE}/slipstream/green-is-the-new-gold` },
  { title: "Measuring the Impact of Influencer Marketing: Beyond CPMs and CPEs", category: "Influencer Marketing", issue: 6, url: `${BASE}/slipstream/measuring-the-impact-of-influencer-marketing%3A-beyond-cpms-and-cpes` },
  { title: "The Gen Z Way - Very Demure, Sometimes Mindful", category: "Audiences", issue: 6, url: `${BASE}/slipstream/the-gen-z-way---very-demure%2C-very-mindful-` },
  { title: "Hired vs. Fluent Devices: The Battle for Brand Attention", category: "Brand Vehicles", issue: 6, url: `${BASE}/slipstream/celebrity-endorsements-vs.-fluent-devices%3A-the-battle-for-brand-attention` },
  { title: "Google Monopoly: The Search for a Solution", category: "Digital", issue: 6, url: `${BASE}/slipstream/slipstream-issue-6-article-1` },
  { title: "What’s in a Name?", category: "Branding", issue: 1, url: `${BASE}/slipstream/what%E2%80%99s-in-a-name%3F` },
];

// ---- site settings ---------------------------------------------------------
async function migrateSiteSettings() {
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Bicycle London",
    description:
      "Bicycle is an independent, integrated media and creative agency built on the power of 'and'.",
    phone: "0208 152 7716",
    whatsapp: "442081527716",
    email: "info@bicyclelondon.com",
    jobsEmail: "jobs@bicyclelondon.com",
    address: { line1: "300 St John Street", line2: "Clerkenwell", city: "London", postcode: "EC1V 4PA" },
    linkedin: "https://www.linkedin.com/company/bicyclelondon/",
    x: "https://twitter.com/BicycleLDN",
    instagram: "https://www.instagram.com/bic.yclelondon/",
    substack: "https://bicyclelondon.substack.com/",
  });
  console.log("✓ siteSettings");
}

async function migrateCaseStudies() {
  let order = 1;
  for (const cs of caseStudies) {
    try {
      const { markdown } = await scrape(cs.url);
      const clientRef = await ensureClient(cs.client);
      const hero = await uploadImage(firstContentImage(markdown), cs.title);
      const blocks = mdToBlocks(markdown);
      await client.createOrReplace({
        _id: `caseStudy-${cs.slug}`,
        _type: "caseStudy",
        title: cs.title,
        slug: { _type: "slug", current: cs.slug },
        client: clientRef,
        standfirst: summaryFromBlocks(blocks),
        heroImage: hero,
        body: blocks,
        order: order++,
      });
      console.log(`✓ case study: ${cs.title}`);
    } catch (e) {
      console.error(`✗ case study ${cs.slug}: ${e.message}`);
    }
  }
}

async function migrateJobs() {
  for (const job of jobs) {
    try {
      const { markdown } = await scrape(job.url);
      const blocks = mdToBlocks(markdown);
      await client.createOrReplace({
        _id: `job-${job.slug}`,
        _type: "job",
        title: job.title,
        slug: { _type: "slug", current: job.slug },
        active: true,
        team: job.team,
        location: "London (Clerkenwell)",
        employmentType: "FULL_TIME",
        summary: summaryFromBlocks(blocks),
        body: blocks,
        applyEmail: "jobs@bicyclelondon.com",
        postedAt: new Date().toISOString(),
      });
      console.log(`✓ job: ${job.title}`);
    } catch (e) {
      console.error(`✗ job ${job.slug}: ${e.message}`);
    }
  }
}

async function migrateArticles() {
  const issueCounters = {};
  for (const a of articles) {
    const slug = slugify(a.title);
    try {
      const { markdown } = await scrape(a.url);
      const categoryRef = await ensureCategory(a.category);
      const blocks = mdToBlocks(markdown);
      const idx = (issueCounters[a.issue] = (issueCounters[a.issue] ?? -1) + 1);
      await client.createOrReplace({
        _id: `article-${slug}`,
        _type: "slipstreamArticle",
        title: a.title,
        slug: { _type: "slug", current: slug },
        standfirst: summaryFromBlocks(blocks),
        category: categoryRef,
        issue: a.issue,
        publishedAt: dateForIssue(a.issue, idx),
        body: blocks,
      });
      console.log(`✓ article: ${a.title}`);
    } catch (e) {
      console.error(`✗ article ${slug}: ${e.message}`);
    }
  }
}

async function main() {
  console.log(`Migrating into Sanity project ${projectId}/${dataset}…\n`);
  await migrateSiteSettings();
  await migrateCaseStudies();
  await migrateJobs();
  await migrateArticles();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
