// Replaces junk standfirsts (Wix UUIDs / "Slipstream Issue X") with a real
// summary taken from the first substantive paragraph of the body.
// Run: node scripts/fix-standfirst.mjs

import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-10-01",
  useCdn: false,
});

function pickSummary(paras) {
  const candidate = (paras || [])
    .map((p) => (p || "").trim())
    .find((p) => p.length >= 40 && /[a-z]/.test(p));
  if (!candidate) return undefined;
  if (candidate.length <= 220) return candidate;
  return candidate.slice(0, 220).replace(/\s+\S*$/, "").trim() + "…";
}

async function run() {
  const docs = await client.fetch(
    `*[_type in ["caseStudy","slipstreamArticle"]]{
       _id, _type, standfirst,
       "paras": body[_type=="block" && style=="normal"].children[0].text
     }`,
  );

  let fixed = 0;
  for (const d of docs) {
    const summary = pickSummary(d.paras);
    const patch = client.patch(d._id);
    if (summary) patch.set({ standfirst: summary });
    else patch.unset(["standfirst"]);
    await patch.commit();
    fixed++;
    console.log(`✓ ${d._type}: ${summary ? summary.slice(0, 60) + "…" : "(cleared)"}`);
  }
  console.log(`\nUpdated ${fixed} documents.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
