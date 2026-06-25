import type { QueryParams } from "next-sanity";
import { client } from "./client";

type FetchArgs = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: FetchArgs): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
