// Uploads the extracted campaign videos to Mux and prints the playback IDs.
// Needs a Mux Access Token (Settings -> Access Tokens, Mux Video read+write):
//   MUX_TOKEN_ID=... MUX_TOKEN_SECRET=... node scripts/mux-upload.mjs
//
// Video files are remuxed to: %LOCALAPPDATA%\Temp\bike-videos\*.mp4

import { readFileSync } from "node:fs";

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

const TOKEN_ID = process.env.MUX_TOKEN_ID;
const TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;
if (!TOKEN_ID || !TOKEN_SECRET) {
  console.error("Set MUX_TOKEN_ID and MUX_TOKEN_SECRET.");
  process.exit(1);
}
const auth = "Basic " + Buffer.from(`${TOKEN_ID}:${TOKEN_SECRET}`).toString("base64");
const dir = "C:/Users/itswe/AppData/Local/Temp/bike-videos";

const videos = [
  { file: "about-brandfilm.mp4", title: "Bicycle brand film" },
  { file: "purpose-xo.mp4", title: "XO Bikes" },
  { file: "about-film.mp4", title: "Bicycle hero film" },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, opts = {}) {
  const res = await fetch(`https://api.mux.com${path}`, {
    ...opts,
    headers: { Authorization: auth, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json.data;
}

async function uploadOne(v) {
  const up = await api("/video/v1/uploads", {
    method: "POST",
    body: JSON.stringify({
      cors_origin: "*",
      new_asset_settings: { playback_policy: ["public"] },
    }),
  });

  const buf = readFileSync(`${dir}/${v.file}`);
  const put = await fetch(up.url, {
    method: "PUT",
    body: buf,
    headers: { "Content-Type": "video/mp4" },
  });
  if (!put.ok) throw new Error(`PUT failed ${put.status}`);

  let assetId;
  for (let i = 0; i < 60 && !assetId; i++) {
    const u = await api(`/video/v1/uploads/${up.id}`);
    assetId = u.asset_id;
    if (!assetId) await wait(3000);
  }
  if (!assetId) throw new Error("no asset_id after upload");

  let playbackId, status;
  for (let i = 0; i < 90; i++) {
    const a = await api(`/video/v1/assets/${assetId}`);
    playbackId = a.playback_ids?.[0]?.id || playbackId;
    status = a.status;
    if (playbackId && status === "ready") break;
    if (playbackId && i > 6) break; // have the id; encoding can finish async
    await wait(4000);
  }
  return { title: v.title, file: v.file, assetId, playbackId, status };
}

const results = [];
for (const v of videos) {
  console.log(`Uploading ${v.title} ...`);
  try {
    const r = await uploadOne(v);
    console.log(`  -> playbackId ${r.playbackId} (${r.status})`);
    results.push(r);
  } catch (e) {
    console.error(`  failed: ${e.message}`);
  }
}
console.log("\nRESULTS:\n" + JSON.stringify(results, null, 2));
