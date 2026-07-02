// Seeds a few SAMPLE testimonials so the carousel has content to show.
// These use generic sector descriptors (no real brand names) and are meant to
// be replaced with real client quotes in the Studio before go-live.
//   node scripts/seed-testimonials.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

for (const line of readFileSync("C:/dev/projects/bicycle/.env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const SAMPLES = [
  {
    quote:
      "Bicycle brought a level of ambition and rigour we hadn’t seen from an agency before. They challenged our thinking, and the results spoke for themselves.",
    authorName: "Sample testimonial",
    authorRole: "Marketing Director",
    company: "National retail brand",
  },
  {
    quote:
      "The team feels like an extension of ours. Genuinely independent thinking, and media planning that finally connects brand and performance properly.",
    authorName: "Sample testimonial",
    authorRole: "Head of Growth",
    company: "Consumer tech scale-up",
  },
  {
    quote:
      "Fast, sharp and refreshingly honest. Bicycle care about the work as much as we do, and it shows in everything they ship.",
    authorName: "Sample testimonial",
    authorRole: "Brand Lead",
    company: "Food & drink",
  },
  {
    quote:
      "From strategy through to activation, everything joined up. The best media partner we’ve worked with, full stop.",
    authorName: "Sample testimonial",
    authorRole: "Chief Marketing Officer",
    company: "Financial services",
  },
];

async function run() {
  for (let i = 0; i < SAMPLES.length; i++) {
    await client.createOrReplace({
      _id: `testimonial-sample-${i + 1}`,
      _type: "testimonial",
      order: i + 1,
      ...SAMPLES[i],
    });
    console.log(`  seeded sample ${i + 1}`);
  }
  console.log("Done. Replace these with real client quotes in the Studio.");
  process.exit(0);
}
run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
