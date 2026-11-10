import type { QueryParams } from "next-sanity";
import { client } from "./client";

type FetchArgs = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

// Content refreshes on publish: the Sanity webhook calls /api/revalidate,
// which expires the "sanity" tag every fetch carries. The timer is only a
// daily backstop, because Vercel bills each page regeneration. Nothing on the
// site changes with the clock alone, so nothing needs a shorter timer.
export const SANITY_TAG = "sanity";
const DAILY = 86400;

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = DAILY,
  tags = [],
}: FetchArgs): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags: [SANITY_TAG, ...tags],
    },
  });
}
