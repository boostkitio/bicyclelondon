import { NextRequest, NextResponse } from "next/server";

// The old Wix URLs had encoded punctuation and trailing dots
// (e.g. /slipstream/x%3B-bargain-reach%2C--but-at-what-cost%3F).
// New slugs are the slugified title, so re-slugifying any incoming slug and
// redirecting to the clean form covers every old URL with one rule.
function slugify(raw: string): string {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* keep raw */
  }
  return decoded
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

const LEGACY_REDIRECTS: Record<string, string> = {
  // Old Wix newsletter/post URLs were separate from the Sanity Slipstream model.
  // Preserve equity and avoid 404s by sending them to the Slipstream hub.
  "/post/issue-1-january-2024": "/slipstream",
  "/post/issue-2-february-2024": "/slipstream",
  "/post/issue-3-april-2024": "/slipstream",
  "/post/issue-4-may-2024": "/slipstream",
  "/post/issue-5-2024": "/slipstream",

  // Titles changed slightly during the rebuild; route old indexed Wix slugs
  // to the current Sanity article slugs instead of generic 404s.
  "/slipstream/the-gen-z-way-very-demure-very-mindful":
    "/slipstream/the-gen-z-way-very-demure-sometimes-mindful",
  "/slipstream/celebrity-endorsements-vs-fluent-devices-the-battle-for-brand-attention":
    "/slipstream/hired-vs-fluent-devices-the-battle-for-brand-attention",
  "/slipstream/slipstream-issue-6-article-1":
    "/slipstream/google-monopoly-the-search-for-a-solution",
};

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
}

export function middleware(req: NextRequest) {
  const directLegacy = LEGACY_REDIRECTS[req.nextUrl.pathname];
  if (directLegacy) return redirectTo(req, directLegacy);

  const match = req.nextUrl.pathname.match(
    /^\/(slipstream|work|careers)\/(.+)$/,
  );
  if (!match) return NextResponse.next();

  const [, section, rawSlug] = match;
  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    /* keep raw */
  }

  const clean = slugify(rawSlug);
  const cleanPath = `/${section}/${clean}`;
  const canonicalLegacy = LEGACY_REDIRECTS[cleanPath];
  if (canonicalLegacy) return redirectTo(req, canonicalLegacy);

  if (clean && clean !== decoded) {
    return redirectTo(req, cleanPath);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/post/:slug+", "/slipstream/:slug+", "/work/:slug+", "/careers/:slug+"],
};
