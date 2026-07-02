# Plan 012: Add security headers and a Content-Security-Policy (Studio-aware)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "Stop conditions" section occurs, stop and
> report back; do not improvise. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat e53e903..HEAD -- next.config.ts src/app/studio src/components/mux-bg.tsx src/instrumentation-client.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a stop condition.

## Status

- **Priority**: P2 (run late; after plans 006/007 so media/monitoring
  behaviour is settled before policy testing)
- **Effort**: M
- **Risk**: Med (an over-tight policy can break the Studio, Mux playback,
  or Sentry; every directive must be verified in the browser)
- **Depends on**: recommended after plans/006 and plans/007
- **Category**: security
- **Planned at**: commit `e53e903`, 2026-07-02

## Why this matters

The app sends no security headers at all: no Content-Security-Policy,
frame-ancestors, X-Content-Type-Options, Referrer-Policy, or
Permissions-Policy. The same deployment serves an embedded Sanity Studio
(an authenticated admin surface) at `/studio`. A CSP is the
defence-in-depth layer that blunts any content-injection that slips through
(the JSON-LD hardening in plan 003 closes the known sink; CSP covers the
unknown ones), and frame-ancestors stops the site and Studio being framed.

## Current state

- `next.config.ts` (entire config):
  ```ts
  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "cdn.sanity.io" },
        { protocol: "https", hostname: "static.wixstatic.com" },
      ],
    },
  };
  export default withSentryConfig(nextConfig, { ... });
  ```
  No `headers()` function exists anywhere (verified by grep).
- Third-party surfaces in use (the connect/media inventory for the policy):
  - Sanity: image CDN `cdn.sanity.io`; API `*.api.sanity.io` and
    `*.apicdn.sanity.io` (the Studio also uses websockets to
    `*.api.sanity.io`).
  - Mux: playback via `stream.mux.com` (HLS media + segments), poster/
    storyboard images via `image.mux.com`; Mux Data beacons go to litix.io
    hosts when `envKey` is set (`src/components/mux-bg.tsx:25` passes
    `NEXT_PUBLIC_MUX_ENV_KEY`).
  - Sentry: browser events to the DSN's ingest host (`*.ingest.sentry.io`
    or an EU/DE ingest host; only active when `NEXT_PUBLIC_SENTRY_DSN` is
    set, `src/instrumentation-client.ts:5`).
  - Wix images: `static.wixstatic.com` (transition period, in
    remotePatterns above).
  - Fonts are self-hosted via `next/font` (no external font origins).
- The Studio at `/studio` is a client-side React app that requires
  `'unsafe-eval'`-level script permissions and broad connect access to
  Sanity; the public site does not.
- Next.js renders inline scripts and styles by default; a nonce-based
  strict CSP requires middleware wiring. This plan deliberately ships a
  pragmatic allowlist policy instead (documented tradeoff; see Maintenance
  notes for the strict-CSP upgrade path).

## Commands you will need

| Purpose   | Command             | Expected on success |
|-----------|---------------------|---------------------|
| Build     | `npm run build`     | exit 0              |
| Serve     | `npm run start`     | serves on :3000     |
| Headers   | `curl -sI http://localhost:3000/ \| grep -i content-security` | policy present |

## Suggested executor toolkit

- If a Boostkit engineering-checks skill is available in your environment,
  read its CSP section before starting; it maintains the canonical
  third-party domain table for this portfolio.
- Read the headers section of the Next config docs in
  `node_modules/next/dist/docs/` (syntax for `async headers()` and per-path
  sources in this Next version).

## Scope

**In scope**:
- `next.config.ts` (add `async headers()`)

**Out of scope**:
- Middleware-based nonce CSP (deferred; see Maintenance notes)
- Any component change; if a component must change to satisfy the policy,
  loosen the policy instead and record it
- `vercel.json` / dashboard header config (keep headers in code)

## Git workflow

- Work on `main`; run `npm run build` before any push.
- Commit message style: short imperative sentence, e.g.
  `Add security headers and a Studio-aware Content-Security-Policy`.

## Steps

### Step 1: Static hardening headers for all routes

Add to `nextConfig` an `async headers()` returning, for source `/(.*)`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Verify**: `npm run build && npm run start`, then
`curl -sI http://localhost:3000/about` shows all three headers.

### Step 2: CSP for the public site

For the same `/(.*)` source, add a `Content-Security-Policy` starting from:

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data: https://cdn.sanity.io https://image.mux.com https://static.wixstatic.com;
media-src 'self' blob: https://stream.mux.com;
connect-src 'self' https://stream.mux.com https://*.litix.io https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://*.api.sanity.io https://*.apicdn.sanity.io;
font-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

(Join directives with `; ` into one header value.) Then verify empirically
and adjust: load `/`, a case study with a film, an article with images, and
submit the contact form (it posts to `/api/contact`, same-origin) with the
browser console open. Zero CSP violation reports is the bar. If a
violation names a host not in the inventory, add the narrowest matching
directive entry and record it in the commit message.

Note on `'unsafe-inline'` for scripts: Next injects inline bootstrap
scripts; without nonces this allowance is required. It weakens the policy
but the header still enforces the connect/media/img/frame boundaries,
which is where the practical wins are.

**Verify**: all four page types load with zero console CSP violations;
video plays; images render; form submits.

### Step 3: Looser CSP for /studio

Add a second headers entry for source `/studio/:path*` that overrides the
CSP with the Studio's needs, at minimum adding `'unsafe-eval'` to
script-src and websockets to connect-src:

```
script-src 'self' 'unsafe-inline' 'unsafe-eval';
connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io https://api.sanity.io;
img-src 'self' blob: data: https://cdn.sanity.io;
frame-ancestors 'none';
```

Keep the other directives from step 2. Confirm ordering: in Next headers
config, later/more-specific sources must actually take precedence for
`/studio`; check the docs from the toolkit note and verify empirically
with `curl -sI http://localhost:3000/studio`.

Then log into the Studio locally (`npm run dev`, open `/studio`) and check:
document list loads, a document opens and edits, image assets render,
Vision tool runs a query. Console: zero CSP violations.

**Verify**: as above; the Studio is fully functional under the policy.

### Step 4: Confirm nothing else regressed

Full pass: `npm run build`, `npm test` (if plan 001 landed), then with
`npm run start`: homepage, one service page, one article, one case study,
one job page, `/contact-us` submit (expect the 503 "not live" path if
Resend is unconfigured locally: that is the correct current behaviour),
`/studio` login screen.

**Verify**: zero CSP violations across the pass.

## Test plan

- The empirical checks in steps 2-4 are the test plan; header presence is
  machine-checkable via the curl commands. After deploy, re-run the same
  console checks against the production URL, including Sentry (set a DSN
  in a preview first if possible) and Mux Data beacons, which only fire
  with `NEXT_PUBLIC_MUX_ENV_KEY` set.

## Done criteria

- [ ] `curl -sI` shows CSP + the three static headers on `/` and a
      Studio-specific CSP on `/studio`
- [ ] Zero CSP violations across the step 4 pass
- [ ] `npm run build` exits 0; only `next.config.ts` modified (`git status`)
- [ ] `plans/README.md` status row updated

## Stop conditions

Stop and report back if:

- The Studio cannot be made to work without directives broader than step
  3's set (for example a host not in the inventory): report the exact
  violation strings rather than shipping `default-src *`.
- Headers configured in `next.config.ts` do not apply on the deployed
  platform for some route class (verify one preview deploy before calling
  it done; if preview headers differ from local, report).
- Sentry's build-time wrapping (`withSentryConfig`) conflicts with the
  `headers()` addition in any way.

## Maintenance notes

- Every new third-party integration (analytics, embeds, chat widgets) now
  requires a CSP entry; the policy will fail loudly in the console when
  one is missed. Keep the domain inventory in this plan updated or move it
  to AGENTS.md.
- Upgrade path: nonce-based strict CSP via middleware (drops
  `'unsafe-inline'` from script-src on the public site). Worth doing if
  the site ever handles more than a contact form.
- After the Wix cutover completes and content no longer references
  `static.wixstatic.com`, remove it from both the CSP and
  `images.remotePatterns`.
