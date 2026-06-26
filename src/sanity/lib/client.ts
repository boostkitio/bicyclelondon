import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Off the CDN so builds and ISR revalidations always read fresh content
  // (the rendered pages are still cached via ISR, so this isn't a perf hit).
  useCdn: false,
  perspective: "published",
});
