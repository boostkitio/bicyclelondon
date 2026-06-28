import { getCliClient } from "sanity/cli";
import { writeFileSync } from "node:fs";

const client = getCliClient({ apiVersion: "2024-10-01" });

const docs = await client.fetch(
  `*[_type=="slipstreamArticle"]| order(title asc){
     "id": _id, title, "slug": slug.current,
     "category": category->title, issue,
     "paragraphs": body[]{ "style": style, "text": pt::text(@) }
   }`,
  {},
  { perspective: "raw" },
);

const out =
  "C:/Users/itswe/AppData/Local/Temp/claude/C--dev-projects-bicycle/242b54c8-12f8-4c55-a5eb-0fb304fd560c/scratchpad/articles-export.json";
writeFileSync(out, JSON.stringify(docs, null, 2));
console.log(`exported ${docs.length} articles -> ${out}`);
