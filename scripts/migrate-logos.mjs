// Uploads the client logo wall into Sanity `client` docs (upsert by slug).
// Run: node scripts/migrate-logos.mjs

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

const slugify = (s) =>
  s.toLowerCase().replace(/['’&]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const media = (id) => `https://static.wixstatic.com/media/${id}`;

// name, wix media id, display order
const logos = [
  ["Movember", "95830d_2562783c4cd94fc99a9d1bf1c90aedb9~mv2.png"],
  ["Tate & Lyle", "f508cb_d6a3e136382743e79a3ef09672fdafda~mv2.png"],
  ["Greater Anglia", "f508cb_9a843b981b1e49838e6b9fafae115809~mv2.png"],
  ["Royal British Legion", "f508cb_75c226c593b94c259750ad0d22972fdd~mv2.png"],
  ["IG", "f508cb_106cc596e361436e82f2a8cf9fa47d63~mv2.png"],
  ["MOJU", "f508cb_0bf3245baf064635b2e9a02f962b2720~mv2.png"],
  ["Verisure", "4308e2_5ec3290c3b2d47539a701abefa1638ab~mv2.png"],
  ["LiveScore", "f508cb_e87d834762df4399bdac12839ab2ef5f~mv2.png"],
  ["Virgin", "f508cb_8ce7b777c6604305ad8a8d1f6f82093b~mv2.png"],
  ["Estrid", "f508cb_324f2d841dcb41109e1f249fe84d074b~mv2.png"],
  ["OFX", "f508cb_6dd02b12cd2e487f9a1a00bb4e5c82bf~mv2.png"],
  ["CVH Spirit", "f508cb_c3ed9b56a1aa472698eecb4adada6270~mv2.png"],
  ["Kroo Bank", "f508cb_6820085a1b024b15a3e724192adb2b02~mv2.png"],
  ["Carwow", "f508cb_8c00525971574347b2731db67cc61540~mv2.png"],
  ["ANNA", "f508cb_4abf2be4855a4bdea6950480c8520ab3~mv2.png"],
  ["Stansted Express", "f508cb_3459a2fc7505488a8b6b7faf8636fbd1~mv2.png"],
  ["OpenTable", "f508cb_7f4a6c0c072d4c97aa51e5a68c4542bb~mv2.png"],
  ["Papa Johns", "95830d_8a1dff60a8c94ee38e68e983b6c62584~mv2.png"],
  ["Dutch Barn Orchard Vodka", "f508cb_36ace47a784247d58dd56c571f12baa2~mv2.png"],
  ["Penfolds", "f508cb_f20afcfaabba46aba048b1e3cfcdf11d~mv2.png"],
  ["Zooplus", "95830d_23b463249b314d6e969201dcf268a83f~mv2.png"],
  ["Warner", "4308e2_990b7d59a72847aebed2517cedd0bfb4~mv2.png"],
  ["Candy Kittens", "4308e2_cd43167fe55f4373a913262ff643edca~mv2.png"],
  ["Five Guys", "4308e2_fe246cc7bfce4df8bee920581c4e16d8~mv2.png"],
  ["Joe & The Juice", "4308e2_e7b389fc83b54e0b8742a9bace577b3f~mv2.png"],
];

async function run() {
  let order = 1;
  for (const [name, id] of logos) {
    const slug = slugify(name);
    try {
      const res = await fetch(media(id));
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const asset = await client.assets.upload("image", buf, { filename: `${slug}.png` });
      await client.createOrReplace({
        _id: `client-${slug}`,
        _type: "client",
        name,
        logo: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: `${name} logo`,
        },
        showOnLogoWall: true,
        order: order++,
      });
      console.log(`✓ ${name}`);
    } catch (e) {
      console.error(`✗ ${name}: ${e.message}`);
    }
  }
  console.log("Done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
