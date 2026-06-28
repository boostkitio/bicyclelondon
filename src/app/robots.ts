import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/studio", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // Make the AI-search/access policy explicit. These are allowed so
      // assistants and answer engines can read/cite the public site while
      // the CMS studio and API routes stay closed.
      ...[
        "GPTBot",
        "ChatGPT-User",
        "PerplexityBot",
        "ClaudeBot",
        "anthropic-ai",
        "Google-Extended",
        "Bingbot",
      ].map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
