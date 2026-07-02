import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Content-Security-Policy for the public site. Next injects inline bootstrap
// scripts and Tailwind emits inline styles, so 'unsafe-inline' is required
// without a nonce pipeline; the connect/media/img/frame boundaries are where
// the practical wins are. Third-party surfaces: Sanity (image CDN + API),
// Mux (playback, poster images, Data beacons), Sentry ingest, and Wix images
// during the pre-cutover transition.
const publicCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://cdn.sanity.io https://*.mux.com https://static.wixstatic.com",
  // Mux serves HLS renditions and storyboards from CDN subdomains, not just
  // stream.mux.com, so allow the whole mux.com space for media + connect.
  "media-src 'self' blob: https://*.mux.com",
  "connect-src 'self' https://*.mux.com https://*.litix.io https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://*.api.sanity.io https://*.apicdn.sanity.io",
  "font-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// The embedded Sanity Studio is a client-side React app that needs eval and
// websockets to Sanity; scope those to /studio only.
const studioCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://core.sanity-cdn.com https://*.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity-cdn.com",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://api.sanity.io https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io https://cdn.sanity.io https://*.sanity-cdn.com",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
].join("; ");

const staticHardening = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
  async headers() {
    const studioHeaders = [
      ...staticHardening,
      { key: "Content-Security-Policy", value: studioCsp },
    ];
    return [
      // /studio and everything under it get the looser Studio policy. Bare
      // /studio needs its own entry: "/studio/:path*" does not match it.
      { source: "/studio", headers: studioHeaders },
      { source: "/studio/:path*", headers: studioHeaders },
      // Everything except /studio* gets the strict public policy. The
      // negative lookahead keeps the two policies from stacking (stacked CSP
      // headers are intersected by the browser, which would break Studio).
      {
        source: "/((?!studio).*)",
        headers: [
          ...staticHardening,
          { key: "Content-Security-Policy", value: publicCsp },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
});
