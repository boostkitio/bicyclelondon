// Gives each Slipstream article a sensible publishedAt derived from its Issue
// number (issues ~2 months apart, staggered within an issue) so they're no
// longer all 1 Jan 2024. Run: node scripts/fix-dates.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(path) {
  try {
    const t = readFileSync(path, "utf8");
    for (const line of t.split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv("C:/dev/projects/bicycle/.env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

export function dateForIssue(issue, idx) {
  const months = ((issue || 1) - 1) * 2; // issues roughly two months apart
  const day = Math.min(3 + idx * 4, 27); // stagger articles within an issue
  return new Date(Date.UTC(2024, months, day)).toISOString();
}

async function run() {
  const arts = await client.fetch(
    `*[_type=="slipstreamArticle"]{_id, issue, title} | order(issue asc, title asc)`,
  );
  const counters = {};
  for (const a of arts) {
    const issue = a.issue || 1;
    const idx = counters[issue] ?? 0;
    counters[issue] = idx + 1;
    const publishedAt = dateForIssue(issue, idx);
    await client.patch(a._id).set({ publishedAt }).commit();
    console.log(`issue ${issue}  ${publishedAt.slice(0, 10)}  ${a.title.slice(0, 44)}`);
  }
  console.log(`\nUpdated ${arts.length} articles.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
