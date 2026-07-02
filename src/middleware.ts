import { NextRequest, NextResponse } from "next/server";
import { slugify, LEGACY_REDIRECTS } from "@/lib/legacy-redirects";

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

  // Legacy Wix slugs were always a single path segment. A raw slug containing
  // its own slash (e.g. /careers/team/mark-pavlika) is a genuine modern
  // multi-segment route, not a legacy slug needing normalisation - slugify()
  // would otherwise collapse the slash into a hyphen and redirect it to a
  // page that doesn't exist.
  if (rawSlug.includes("/")) return NextResponse.next();

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
