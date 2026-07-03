// Adds Ed Turner (a recent joiner missed by the original roster migration) to
// the Peloton: uploads his headshot and creates his pelotonMember document.
// Order 9.5 slots him into the leadership group (after the Managing Partners,
// before the alphabetical roster) without renumbering everyone else.
//   node scripts/add-ed-turner.mjs
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

async function run() {
  const path = "C:/dev/projects/bicycle/public/team/ed-turner.jpg";
  const asset = await client.assets.upload("image", readFileSync(path), {
    filename: "ed-turner.jpg",
  });
  const doc = {
    _id: "peloton-ed-turner",
    _type: "pelotonMember",
    name: "Ed Turner",
    role: "Managing Director & Partner",
    slug: { _type: "slug", current: "ed-turner" },
    order: 9.5,
    isPet: false,
    linkedin: "https://www.linkedin.com/in/ACwAAAFaYogBlg1P5fvXxqx8MipUQNFzBDwum-w",
    photo: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
  };
  await client.createOrReplace(doc);
  console.log("Added Ed Turner (peloton-ed-turner) with photo", asset._id);
}
run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
