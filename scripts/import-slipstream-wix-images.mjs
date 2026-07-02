/*
 * Import Slipstream hero images from the current Wix site into Sanity.
 *
 * Usage:
 *   npx sanity exec scripts/import-slipstream-wix-images.mjs --with-user-token
 *   npx sanity exec scripts/import-slipstream-wix-images.mjs --with-user-token -- --dry-run
 */

import { getCliClient } from "sanity/cli";

const WIX_SITEMAP = "https://www.bicyclelondon.com/sitemap.xml";
const dryRun = process.argv.includes("--dry-run");

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(parseInt(num, 10)));
}

function normalizeTitle(value) {
  return decodeEntities(value)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFirst(regex, source) {
  const match = source.match(regex);
  return match ? decodeEntities(match[1]).trim() : "";
}

function filenameFromUrl(url, fallback) {
  try {
    const clean = new URL(url).pathname.split("/").filter(Boolean).pop() || fallback;
    return decodeURIComponent(clean).replace(/[^a-zA-Z0-9._-]+/g, "-") || fallback;
  } catch {
    return fallback;
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; BicycleImageMigrator/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.text();
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; BicycleImageMigrator/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} while downloading image ${url}`);
  }
  const contentType = response.headers.get("content-type") || "application/octet-stream";
  const arrayBuffer = await response.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

async function sitemapUrls(url) {
  const xml = await fetchText(url);
  const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) =>
    decodeEntities(match[1]),
  );
  const childSitemaps = urls.filter((item) => item.endsWith("-sitemap.xml"));
  if (childSitemaps.length === 0) return urls;

  const nested = await Promise.all(childSitemaps.map((child) => sitemapUrls(child)));
  return nested.flat();
}

async function scrapeSlipstreamPages() {
  const urls = (await sitemapUrls(WIX_SITEMAP)).filter((url) =>
    url.includes("/slipstream/"),
  );

  const pages = [];
  for (const url of urls) {
    const html = await fetchText(url);
    const title = extractFirst(/<title>(.*?)<\/title>/is, html).replace(/\s*\|\s*Bicycle London\s*$/i, "");
    const imageUrl =
      extractFirst(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i, html) ||
      extractFirst(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/i, html);
    pages.push({ url, title, normalizedTitle: normalizeTitle(title), imageUrl });
  }
  return pages;
}

async function main() {
  const client = getCliClient({ apiVersion: "2024-10-01" });
  const articles = await client.fetch(`
    *[_type == "slipstreamArticle"]{
      _id,
      title,
      "slug": slug.current,
      "hasHero": defined(heroImage.asset),
      "assetRef": heroImage.asset._ref
    } | order(title asc)
  `);

  const pages = await scrapeSlipstreamPages();
  const pagesByTitle = new Map(pages.map((page) => [page.normalizedTitle, page]));
  const results = [];

  for (const article of articles) {
    const page = pagesByTitle.get(normalizeTitle(article.title));
    if (!page) {
      results.push({ title: article.title, slug: article.slug, status: "no-wix-title-match" });
      continue;
    }
    if (!page.imageUrl) {
      results.push({ title: article.title, slug: article.slug, wixUrl: page.url, status: "no-wix-image" });
      continue;
    }
    if (article.hasHero) {
      results.push({ title: article.title, slug: article.slug, wixUrl: page.url, imageUrl: page.imageUrl, status: "already-has-hero", assetRef: article.assetRef });
      continue;
    }

    if (dryRun) {
      results.push({ title: article.title, slug: article.slug, wixUrl: page.url, imageUrl: page.imageUrl, status: "would-upload" });
      continue;
    }

    const fallbackName = `${article.slug || article._id}.jpg`;
    const filename = filenameFromUrl(page.imageUrl, fallbackName);
    const { buffer, contentType } = await fetchBuffer(page.imageUrl);
    const asset = await client.assets.upload("image", buffer, {
      filename,
      contentType,
      source: {
        name: "Bicycle London Wix Slipstream migration",
        id: page.url,
        url: page.imageUrl,
      },
    });

    await client
      .patch(article._id)
      .set({
        heroImage: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: article.title,
        },
      })
      .commit();

    results.push({
      title: article.title,
      slug: article.slug,
      wixUrl: page.url,
      imageUrl: page.imageUrl,
      assetId: asset._id,
      status: "uploaded-and-patched",
    });
    console.log(`Uploaded ${article.slug}: ${asset._id}`);
  }

  const summary = {
    dryRun,
    wixPages: pages.length,
    sanityArticles: articles.length,
    counts: results.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {}),
    results,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
