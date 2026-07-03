// Adds recent joiners found via the LinkedIn company scrape (company id
// 72102046, "Bicycle | B Corp") who were missing from the Peloton. Each was
// verified as a current Bicycle employee, not a shareholder/advisor/contractor.
// Uploads the LinkedIn headshot (where one exists) and creates the
// pelotonMember document. Fractional order values slot each person into the
// alphabetical roster without renumbering everyone else.
//   node scripts/add-peloton-joiners.mjs
import { readFileSync, existsSync } from "node:fs";
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

// slug, name, role, order, linkedin. Photo read from public/team/<slug>.jpg if present.
const JOINERS = [
  ["april-wardy", "April Wardy", "Business Director", 16.5, "https://www.linkedin.com/in/ACwAABCrugEBSJanpFw0yiPY8-ZWhO6aLwdyBdE"],
  ["megan-hulme", "Megan Hulme", "Senior Influencer & Social Account Manager", 49.5, "https://www.linkedin.com/in/ACwAACTbroQBEvntDk23KVMVLIS66GTeIJs7ZU0"],
  ["natasha-fenton", "Natasha Fenton", "Junior Designer", 50.3, "https://www.linkedin.com/in/ACwAADL66EoBF-KzM0G26K6uzBCycl3G8IjS80A"],
  ["neil-martin", "Neil Martin", "IT & Operations Manager", 50.5, "https://www.linkedin.com/in/ACwAAB1kL1gBxp_Heb_7ePHgrI_O-UnxyAo9qLs"],
  ["nerea-garcia", "Nerea García", "Paid Media Manager", 50.7, "https://www.linkedin.com/in/ACwAAFStZssBQaruZEoiWn7atbpwmjX5e2hkpV8"],
  ["yanina-stegniy", "Yanina Stegniy", "Data Analytics Expert", 62.5, "https://www.linkedin.com/in/ACwAACpzMykBkLhRkY-S_iQ1Hhv13Py9yt5SS80"],
];

async function run() {
  for (const [slug, name, role, order, linkedin] of JOINERS) {
    let photo;
    const path = `C:/dev/projects/bicycle/public/team/${slug}.jpg`;
    if (existsSync(path)) {
      const asset = await client.assets.upload("image", readFileSync(path), {
        filename: `${slug}.jpg`,
      });
      photo = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    }
    await client.createOrReplace({
      _id: `peloton-${slug}`,
      _type: "pelotonMember",
      name,
      role,
      slug: { _type: "slug", current: slug },
      order,
      isPet: false,
      linkedin,
      ...(photo ? { photo } : {}),
    });
    console.log(`  ${name} — ${role}${photo ? "" : " (no photo)"}`);
  }
  console.log("\nDone.");
}
run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
