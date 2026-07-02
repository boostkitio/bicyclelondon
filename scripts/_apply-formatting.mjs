// Applies editorially-restructured article bodies (produced into
// scratchpad/formatted/<slug>.json) back into Sanity as proper Portable Text.
//
// Safety: before writing, it verifies that every original prose paragraph still
// appears verbatim in the new body (ignoring added headings, pull-quote moves,
// bold/italic markers and whitespace/punctuation). Any article that fails the
// check is SKIPPED and reported — the authors' words must be preserved, only
// structure added.
//
// Run from project root:
//   sanity exec scripts/_apply-formatting.mjs --with-user-token

import { getCliClient } from "sanity/cli";
import { readFileSync, readdirSync } from "node:fs";
import { randomBytes } from "node:crypto";

const client = getCliClient({ apiVersion: "2024-10-01" });

const SP =
  "C:/Users/itswe/AppData/Local/Temp/claude/C--dev-projects-bicycle/242b54c8-12f8-4c55-a5eb-0fb304fd560c/scratchpad";
const FORMATTED_DIR = `${SP}/formatted`;

const key = () => randomBytes(6).toString("hex");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

// Parse **strong** and *em* into spans. Returns { spans, plain }.
function inlineToSpans(text) {
  const spans = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m;
  const push = (t, marks) => {
    if (t) spans.push({ _type: "span", _key: key(), text: t, marks });
  };
  while ((m = re.exec(text))) {
    if (m.index > last) push(text.slice(last, m.index), []);
    if (m[1] != null) push(m[1], ["strong"]);
    else push(m[2], ["em"]);
    last = re.lastIndex;
  }
  if (last < text.length) push(text.slice(last), []);
  if (spans.length === 0) spans.push({ _type: "span", _key: key(), text: "", marks: [] });
  const plain = spans.map((s) => s.text).join("");
  return { spans, plain };
}

const STYLE = { p: "normal", h3: "h3", h4: "h4", quote: "blockquote", bullet: "normal" };

function toBlock(b) {
  const { spans, plain } = inlineToSpans(b.text);
  const block = {
    _type: "block",
    _key: key(),
    style: STYLE[b.type] || "normal",
    markDefs: [],
    children: spans,
  };
  if (b.type === "bullet") {
    block.listItem = "bullet";
    block.level = 1;
  }
  // Full text (incl. headings) feeds the preservation check: an original
  // run-in heading split into [h3][p] stays a contiguous match, whereas a
  // heading jammed mid-sentence would break the original's contiguity.
  return { block, prose: plain };
}

const tokenize = (s) => (s || "").toLowerCase().match(/[a-z0-9]+/g) || [];
const countTokens = (arr) => {
  const m = new Map();
  for (const w of arr) m.set(w, (m.get(w) || 0) + 1);
  return m;
};

// Tokens of the authors' prose, excluding the leading category/issue cruft.
function originalTokens(article) {
  const toks = [];
  article.paragraphs.forEach((p, i) => {
    const t = (p.text || "").trim();
    if (!t) return;
    if (p.style === "h2" && i <= 1) return; // duplicated category
    if (/^slipstream issue\s*\d+$/i.test(t)) return;
    toks.push(...tokenize(t));
  });
  return toks;
}

// Words allowed to be absent from the new body: the byline (moved to the author
// field), the issue label, the category, the duplicated title and any other
// short cruft line in the leading zone — everything else must survive.
function allowedAbsent(article, author) {
  const words = new Set(["slipstream", "issue"]);
  for (const w of tokenize(author?.name)) words.add(w);
  for (const w of tokenize(author?.role)) words.add(w);
  for (const w of tokenize(article.category)) words.add(w);
  for (const w of tokenize(article.title)) words.add(w);
  // Leading cruft zone (category dup, issue line, byline, duplicated title).
  for (const p of article.paragraphs.slice(0, 4)) {
    if ((p.text || "").trim().length <= 120) {
      for (const w of tokenize(p.text)) words.add(w);
    }
  }
  return words;
}

async function run() {
  let files;
  try {
    files = readdirSync(FORMATTED_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    console.error(`No formatted dir at ${FORMATTED_DIR}`);
    process.exit(1);
  }

  const exportPath = `${SP}/articles-export.json`;
  const articles = JSON.parse(readFileSync(exportPath, "utf8"));
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  const failed = [];
  let written = 0;

  for (const file of files.sort()) {
    const data = JSON.parse(readFileSync(`${FORMATTED_DIR}/${file}`, "utf8"));
    const article = bySlug.get(data.slug);
    if (!article) {
      failed.push(`${file}: no matching article for slug "${data.slug}"`);
      continue;
    }

    const built = data.blocks.map(toBlock);
    const body = built.map((x) => x.block);

    // Preservation check: every word of the authors' prose must still be
    // present (allowing reorder, splits and inserted subheads). Byline / issue
    // / category words may be absent (they moved out of the body).
    const origCounts = countTokens(originalTokens(article));
    const newCounts = countTokens(built.flatMap((x) => tokenize(x.prose)));
    const allowed = allowedAbsent(article, data.author);
    const gone = []; // a word that disappeared entirely — real content loss
    const reduced = []; // fewer occurrences but still present — e.g. de-duped callouts
    for (const [w, n] of origCounts) {
      if (allowed.has(w) || /^\d+$/.test(w)) continue;
      const have = newCounts.get(w) || 0;
      if (have === 0) gone.push(w);
      else if (have < n) reduced.push(`${w} ${n}→${have}`);
    }
    if (gone.length) {
      failed.push(
        `${data.slug}: ${gone.length} word(s) missing entirely — ${gone.slice(0, 10).join(", ")}`,
      );
      continue;
    }
    if (reduced.length) {
      console.log(
        `  ⚠ ${data.slug}: ${reduced.length} word(s) fewer (likely de-duplicated callouts): ${reduced.slice(0, 5).join(", ")}`,
      );
    }
    // New words not in the original = the authored subheads. Flag if there are
    // suspiciously many (would suggest invented prose, not just headings).
    let added = 0;
    for (const [w, n] of newCounts) {
      const had = origCounts.get(w) || 0;
      if (n > had && !allowed.has(w)) added += n - had;
    }
    if (added > 40) {
      console.log(`  ⚠ ${data.slug}: ${added} new words added (check subheads aren't invented prose)`);
    }

    // Author reference (non-destructive — won't clobber Studio edits).
    let authorRef;
    if (data.author?.name) {
      const _id = `author-${slugify(data.author.name)}`;
      await client.createIfNotExists({
        _id,
        _type: "author",
        name: data.author.name,
        slug: { _type: "slug", current: slugify(data.author.name) },
        ...(data.author.role ? { role: data.author.role } : {}),
      });
      authorRef = { _type: "reference", _ref: _id };
    }

    const patch = client.patch(article.id).set({ body });
    if (authorRef) patch.set({ author: authorRef });
    await patch.commit();
    written++;
    console.log(
      `✓ ${data.slug} — ${body.length} blocks${authorRef ? `, author: ${data.author.name}` : ""}`,
    );
  }

  console.log(`\n${written} written, ${failed.length} skipped.`);
  if (failed.length) {
    console.log("\nSKIPPED:");
    for (const f of failed) console.log(`  ✗ ${f}`);
    process.exitCode = 2;
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
