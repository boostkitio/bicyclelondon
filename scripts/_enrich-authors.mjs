// Brings the Slipstream authors to life: uploads the real team headshots,
// fills missing roles from the peloton roster, merges a duplicate author,
// tidies the multi-author byline, and applies verified LinkedIn URLs (from
// scratchpad/linkedin.json, if present).
//
// Idempotent: skips a photo that's already set. Run from the project root:
//   sanity exec scripts/_enrich-authors.mjs --with-user-token

import { getCliClient } from "sanity/cli";
import { readFileSync, existsSync } from "node:fs";

const client = getCliClient({ apiVersion: "2024-10-01" });

const SP =
  "C:/Users/itswe/AppData/Local/Temp/claude/C--dev-projects-bicycle/242b54c8-12f8-4c55-a5eb-0fb304fd560c/scratchpad";

// author _id -> headshot file in public/team/
const PHOTO = {
  "author-abi-bateman": "abi-bateman",
  "author-aidan-mark": "aidan-mark",
  "author-alex-eyles": "alex-eyles",
  "author-andres-pico-vargas": "andres-pico",
  "author-becky-gwynne": "becky-gwynne",
  "author-bryan-hogg": "bryan-hogg",
  "author-mark-pavlika": "mark-pavlika",
  "author-poppy-pressland": "poppy-pressland",
  "author-quincy-boateng": "quincy-boateng",
  "author-reema-patel": "reema-patel",
  "author-simone-gayle": "simone-gayle",
  "author-yash-kaushik": "yash-kaushik",
};

// Fill role only where the author currently has none (authoritative from team).
const ROLE_IF_NULL = {
  "author-aidan-mark": "Media Science & Strategy Director",
  "author-andres-pico-vargas": "Senior Paid Social Executive",
  "author-poppy-pressland": "Paid Search Executive",
};

const norm = (s) => (s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();

async function mergeDuplicateMark() {
  const dup = "author-mark-pav-pavlika";
  const keep = "author-mark-pavlika";
  const exists = await client.fetch(`defined(*[_id==$id][0])`, { id: dup });
  if (!exists) return;
  const refs = await client.fetch(
    `*[_type=="slipstreamArticle" && author._ref==$dup]{_id}`,
    { dup },
  );
  for (const a of refs) {
    await client.patch(a._id).set({ author: { _type: "reference", _ref: keep } }).commit();
    console.log(`  repointed ${a._id} -> ${keep}`);
  }
  await client.delete(dup);
  console.log(`✓ merged duplicate Mark Pavlika (deleted ${dup})`);
}

async function loadLinkedIn() {
  const path = `${SP}/linkedin.json`;
  if (!existsSync(path)) {
    console.log("(no linkedin.json — skipping LinkedIn URLs)");
    return [];
  }
  const raw = JSON.parse(readFileSync(path, "utf8"));
  return Object.entries(raw).map(([name, v]) => ({
    name,
    norm: norm(name),
    url: typeof v === "string" ? v : v.url,
  })).filter((x) => x.url);
}

function findLinkedIn(authorName, list) {
  const a = norm(authorName);
  const hit = list.find((l) => l.norm && (a.includes(l.norm) || l.norm.includes(a)));
  return hit?.url;
}

async function run() {
  await mergeDuplicateMark();

  // Tidy the four-person power-of-AND byline.
  const multiId =
    "author-will-ridley-senior-account-manager-becky-gwynne-senior-search-executive-becky-gemmell-av-manager";
  if (await client.fetch(`defined(*[_id==$id][0])`, { id: multiId })) {
    await client
      .patch(multiId)
      .set({ name: "Will Ridley, Becky Gwynne, Becky Gemmell & Eric Berfela" })
      .commit();
    console.log("✓ tidied multi-author byline");
  }

  // A collective byline (several contributors) must never link to one person.
  const COLLECTIVE = new Set([
    "author-will-ridley-senior-account-manager-becky-gwynne-senior-search-executive-becky-gemmell-av-manager",
  ]);

  const linkedin = await loadLinkedIn();
  const authors = await client.fetch(
    `*[_type=="author"]{ _id, name, role, "hasImage": defined(image), linkedin }`,
  );

  for (const a of authors) {
    const set = {};
    const unset = [];

    // role
    if (!a.role && ROLE_IF_NULL[a._id]) set.role = ROLE_IF_NULL[a._id];

    // photo
    const slug = PHOTO[a._id];
    if (slug && !a.hasImage) {
      const file = `public/team/${slug}.jpg`;
      if (existsSync(file)) {
        const asset = await client.assets.upload("image", readFileSync(file), {
          filename: `${slug}.jpg`,
        });
        set.image = {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: a.name,
        };
      }
    }

    // linkedin
    if (COLLECTIVE.has(a._id)) {
      if (a.linkedin) unset.push("linkedin");
    } else if (!a.linkedin) {
      const url = findLinkedIn(a.name, linkedin);
      if (url) set.linkedin = url;
    }

    if (Object.keys(set).length || unset.length) {
      let p = client.patch(a._id);
      if (Object.keys(set).length) p = p.set(set);
      if (unset.length) p = p.unset(unset);
      await p.commit();
      const changes = [...Object.keys(set), ...unset.map((u) => `-${u}`)];
      console.log(`✓ ${a.name} — ${changes.join(", ")}${set.linkedin ? ` (${set.linkedin})` : ""}`);
    } else {
      console.log(`· ${a.name} — nothing to add`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
