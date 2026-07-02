// Matches the LinkedIn scrape (scraped via Apify) to the Sanity Peloton
// roster by name and sets each member's linkedin URL.
//   node scripts/enrich-peloton-linkedin.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(path) {
  try {
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
loadEnv("C:/dev/projects/bicycle/.env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const norm = (s) =>
  (s || "")
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const scraped = JSON.parse(
  readFileSync(
    "C:/Users/itswe/AppData/Local/Temp/claude/C--dev-projects-bicycle/53973c72-b8db-49ae-a127-a1092d19c92e/scratchpad/li.json",
    "utf8",
  ),
);
const byName = new Map();
for (const p of scraped) {
  const name = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  if (!name) continue;
  byName.set(norm(name), {
    name,
    linkedin: p.linkedinUrl,
    title: p.currentPositions?.[0]?.title,
  });
}

// Roster name -> the (normalised) name LinkedIn returned it under.
const ALIASES = {
  "connor dimberline": "connor d",
  "daniela ochoa": "daniela olaya ochoa",
  "hana chowdhury": "hana c",
  "izzy nott": "isabel nott",
  "josh andrews": "joshua andrews",
  "ollie makin": "oliver makin",
  "matt sharkey": "matthew sharkey",
  "jim elliott": "james elliott",
  "reema patel": "reema qureshi patel fca",
  "ollie walker": "oliver walker",
  "georgie hobley": "georgina hobley",
  "sam staniforth": "samuel staniforth",
  "mark pavlika": "mark mario pavlika",
};

async function run() {
  const members = await client.fetch(
    `*[_type == "pelotonMember"]{_id, name, linkedin}`,
  );
  let matched = 0;
  const unmatchedRoster = [];
  const usedScrape = new Set();
  for (const m of members) {
    const hit = byName.get(norm(m.name)) || byName.get(ALIASES[norm(m.name)]);
    if (hit && hit.linkedin) {
      await client.patch(m._id).set({ linkedin: hit.linkedin }).commit();
      usedScrape.add(norm(hit.name));
      matched++;
    } else {
      unmatchedRoster.push(m.name);
    }
  }
  const unmatchedScrape = [...byName.values()]
    .filter((v) => !usedScrape.has(norm(v.name)))
    .map((v) => `${v.name} — ${v.title || ""}`);

  console.log(`Matched & set LinkedIn on ${matched}/${members.length} members.`);
  console.log(`\nRoster with NO LinkedIn match (${unmatchedRoster.length}):`);
  console.log(unmatchedRoster.join(", ") || "(none)");
  console.log(
    `\nOn LinkedIn but NOT in our roster (${unmatchedScrape.length}) — possible new joiners:`,
  );
  console.log(unmatchedScrape.join("\n") || "(none)");
}
run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
