// Scrapes each case-study page for its campaign images and sets them as the
// case study's gallery in Sanity (skipping the hero, logos and decorative blurs).
// Run: node scripts/migrate-galleries.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

function loadEnv(path) {
  try {
    const txt = readFileSync(path, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv("C:/dev/projects/bicycle/.env.local");
loadEnv("C:/dev/projects/.env.boostkit-shared");

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const key = () => randomBytes(6).toString("hex");

const cases = [
  { id: "caseStudy-stansted-express", url: "https://www.bicyclelondon.com/work/stansted-express" },
  { id: "caseStudy-papa-johns", url: "https://www.bicyclelondon.com/work/papa-johns" },
  { id: "caseStudy-sarsons", url: "https://www.bicyclelondon.com/work/sarson's" },
  { id: "caseStudy-moju", url: "https://www.bicyclelondon.com/work/moju" },
  { id: "caseStudy-livescore", url: "https://www.bicyclelondon.com/work/livescore" },
];

const SKIP =
  /logo|whitehires|bicycle%20logos|b-corp|asset%20\d|google-partner|maxresdefault|amazon_ads|\.webp|blur_2/i;

async function scrape(url) {
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${FIRECRAWL_API_KEY}` },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
  const json = await res.json();
  return json.data.markdown || "";
}

async function uploadFromId(id, alt) {
  const res = await fetch(`https://static.wixstatic.com/media/${id}/v1/fill/w_1400,h_1000,al_c,q_85/photo.jpg`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`img ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buf, { filename: `${id.split("~")[0]}.jpg` });
  return { _type: "image", _key: key(), asset: { _type: "reference", _ref: asset._id }, alt: alt || "" };
}

async function run() {
  for (const cs of cases) {
    try {
      const md = await scrape(cs.url);
      const matches = [...md.matchAll(/!\[([^\]]*)\]\((https:\/\/static\.wixstatic\.com\/media\/[^)\s]+)\)/g)];
      const seen = new Set();
      const candidates = [];
      for (const [, alt, url] of matches) {
        if (SKIP.test(url)) continue;
        const idm = url.match(/\/media\/([^/]+)\//);
        if (!idm) continue;
        const id = idm[1];
        if (seen.has(id)) continue;
        seen.add(id);
        candidates.push({ id, alt });
      }
      // first valid image is the hero (already set); rest become the gallery
      const galleryItems = candidates.slice(1, 9);
      const gallery = [];
      for (const c of galleryItems) {
        try {
          gallery.push(await uploadFromId(c.id, c.alt));
        } catch (e) {
          console.warn(`  skip image: ${e.message}`);
        }
      }
      await client.patch(cs.id).set({ gallery }).commit();
      console.log(`✓ ${cs.id}: ${gallery.length} gallery images`);
    } catch (e) {
      console.error(`✗ ${cs.id}: ${e.message}`);
    }
  }
  console.log("Done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
