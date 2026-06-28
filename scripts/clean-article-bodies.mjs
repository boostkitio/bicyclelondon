// One-off cleanup: strips scraped Wix UI cruft from migrated Slipstream article
// bodies — the dead "Subscribe to our Newsletter" form (Email* / Submit), the
// "Chat to us!" widget label, "BACK TO ALL", and the Substack embed remnant.
// The real subscribe + contact affordances live in the article template instead.
//
// Idempotent: re-running on already-clean content is a no-op.
//
// Run from the project root using the machine Sanity CLI session:
//   sanity exec scripts/clean-article-bodies.mjs --with-user-token

import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-10-01" });

// Plain text of a block, normalised for matching (drops markdown escapes such
// as the backslash in "Email\*", collapses whitespace).
function blockText(block) {
  if (block?._type !== "block" || !Array.isArray(block.children)) return null;
  return block.children
    .map((c) => (typeof c?.text === "string" ? c.text : ""))
    .join("")
    .replace(/\\(.)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const JUNK = new Set([
  "back to all",
  "subscribe to our newsletter",
  "email*",
  "email *",
  "submit",
  "chat to us!",
  "chat to us",
  "top of page",
  "bottom of page",
  "thanks for reading bicycle slipstream! subscribe for free to receive new posts and support my work.",
]);

function isJunk(block) {
  const t = blockText(block);
  return t != null && JUNK.has(t);
}

async function run() {
  // perspective: raw so any draft copies get cleaned too.
  const docs = await client.fetch(
    `*[_type == "slipstreamArticle"]{ _id, title, body }`,
    {},
    { perspective: "raw" },
  );

  let changed = 0;
  for (const doc of docs) {
    if (!Array.isArray(doc.body)) continue;
    const cleaned = doc.body.filter((b) => !isJunk(b));
    const removed = doc.body.length - cleaned.length;
    if (removed === 0) {
      console.log(`· ${doc.title} — already clean`);
      continue;
    }
    await client.patch(doc._id).set({ body: cleaned }).commit();
    console.log(`✓ ${doc.title} — removed ${removed} junk block(s)`);
    changed++;
  }

  console.log(
    `\nDone. ${changed} article(s) cleaned, ${docs.length - changed} already clean.`,
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
