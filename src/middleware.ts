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

export function middleware(req: NextRequest) {
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
  if (clean && clean !== decoded) {
    const url = req.nextUrl.clone();
    url.pathname = `/${section}/${clean}`;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/slipstream/:slug+", "/work/:slug+", "/careers/:slug+"],
};
