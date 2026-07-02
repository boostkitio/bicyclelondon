// Migrates the hard-coded Peloton roster into Sanity so the client can edit it.
// Uploads each existing headshot as an asset and creates one pelotonMember
// document per person (deterministic _id, idempotent createOrReplace).
//   node scripts/migrate-peloton.mjs
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

const ROSTER = [
  ["Henry Daglish", "CEO & Co-Founder"],
  ["Pedro Avery", "Chairman & Co-Founder"],
  ["Erika Mari", "CCO & Co-Founder"],
  ["Carol Middleton", "Chief Client & Growth Officer"],
  ["Mark Pavlika (Pav)", "Chief People & Purpose Officer"],
  ["Jim Elliott", "Commercial Director & Partner"],
  ["Reema Patel", "Finance Director & Partner"],
  ["Simone Gayle", "Managing Partner, Digital & Transformation"],
  ["Natalie Jackson", "Managing Partner, Bicycle Ripple"],
  ["Abi Bateman", "Paid Social Account Director"],
  ["Aidan Mark", "Media Science & Strategy Director"],
  ["Alastair Jones", "International AV Director"],
  ["Alex Eyles", "Account Director"],
  ["Alex Wood", "Business Director"],
  ["Alina de Villiers-Hill", "Senior Account Executive"],
  ["Andres Pico", "Senior Paid Social Executive"],
  ["Becky Gemmell", "Senior AV Account Manager"],
  ["Becky Gwynne", "Paid Search Account Manager"],
  ["Bryan Hogg", "Senior Strategy Director"],
  ["Charlotte Wheatley", "Business Director, Bicycle Studio"],
  ["Chris Ball", "Account Manager"],
  ["Christina Smith", "Head of Operations"],
  ["Connor Dimberline", "Designer"],
  ["Daisy Graham", "Director Domestique"],
  ["Daniela Ochoa", "Account Executive, Bicycle Studio"],
  ["Demi Cumming", "Senior Account Executive"],
  ["Dylan Edwards", "Senior Account Executive"],
  ["Dylan Pritchard", "Head of AV"],
  ["Eleanor Sibley", "Media Executive"],
  ["Evie Hutcheon", "Senior Account Executive"],
  ["Fred Scriven", "AV Director"],
  ["Frediano Iannelli", "Strategy & Digital Transformation Director"],
  ["George Lilley-Moncrieff", "Performance Director"],
  ["Georgie Hobley", "Business Director"],
  ["Hana Chowdhury", "Data Analyst"],
  ["Hannah Saunders", "Business Director"],
  ["Harrison Zhang", "Media Executive"],
  ["Hiten Shah", "Financial Controller"],
  ["Izzy Nott", "Account Manager, Bicycle Studio"],
  ["Jae Rich", "Paid Social Manager"],
  ["Joe Eaton", "Senior Management Accountant"],
  ["Josh Andrews", "Account Director"],
  ["Laura Jarvis", "Executive Assistant"],
  ["Lottie Thomas", "Account Director"],
  ["Louis Aidam", "Senior Research Executive"],
  ["Luca Wieynk", "Media Executive"],
  ["Lucas Miracca", "Senior Account Manager"],
  ["Matt Sharkey", "Head of Activation"],
  ["Mavina Bhatta", "Senior Account Manager"],
  ["Megan Hume", "Senior Paid Social Executive"],
  ["Ollie Makin", "Senior Account Executive"],
  ["Ollie Walker", "New Business & Marketing Director"],
  ["Poppy Pressland", "Paid Search Executive"],
  ["Quincy Boateng", "AV Account Manager"],
  ["Richard Cavill", "Head of Programmatic"],
  ["Rohan Patel", "Media Executive"],
  ["Sam Atkinson", "Finance Assistant"],
  ["Sam Staniforth", "Account Director"],
  ["Sarah Kong", "Business Director"],
  ["Shivani Patel", "Operations Manager"],
  ["Teo Borozan", "Senior Programmatic Account Manager"],
  ["Valeria Perticucci", "Peloton Success Manager"],
  ["Yash Kaushik", "Programmatic Account Manager"],
  ["Baxter", "Chief Barking Officer"],
  ["Luna", "Chief Cuddle Officer"],
  ["Nelly", "Head of Barketing"],
];
const PETS = new Set(["Baxter", "Luna", "Nelly"]);
const PNG = new Set(["mark-pavlika", "valeria-perticucci"]);

function slugify(name) {
  return name
    .replace(/\(.*?\)/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  let created = 0,
    missingPhoto = 0;
  for (let i = 0; i < ROSTER.length; i++) {
    const [name, role] = ROSTER[i];
    const slug = slugify(name);
    const ext = PNG.has(slug) ? "png" : "jpg";
    const path = `C:/dev/projects/bicycle/public/team/${slug}.${ext}`;
    let photo;
    if (existsSync(path)) {
      const asset = await client.assets.upload("image", readFileSync(path), {
        filename: `${slug}.${ext}`,
      });
      photo = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
    } else {
      missingPhoto++;
      console.warn(`  no photo for ${name} (${path})`);
    }
    const doc = {
      _id: `peloton-${slug}`,
      _type: "pelotonMember",
      name,
      role,
      slug: { _type: "slug", current: slug },
      order: i + 1,
      isPet: PETS.has(name),
      ...(photo ? { photo } : {}),
    };
    await client.createOrReplace(doc);
    created++;
    console.log(`  ${i + 1}. ${name}`);
  }
  console.log(`\nDone. ${created} members, ${missingPhoto} without a photo.`);
}
run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
