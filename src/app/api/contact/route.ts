import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { contactSchema, sanitiseLine } from "@/lib/validation";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

// Basic in-memory rate limit (per warm instance). Honeypot is the main defence.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a minute." },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot tripped: pretend success, do nothing.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Store in Convex when configured (additive; never blocks the email).
  // The mutation requires the shared secret because the deployment URL is
  // public; without both values set, storage is skipped.
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convexSecret = process.env.CONTACT_FORM_SECRET;
  if (convexUrl && convexSecret) {
    try {
      const convex = new ConvexHttpClient(convexUrl);
      await convex.mutation(
        makeFunctionReference<"mutation">("submissions:create"),
        {
          secret: convexSecret,
          type: "contact",
          name: data.name,
          email: data.email,
          company: data.company || "",
          enquiryType: data.enquiryType,
          message: data.message,
        },
      );
    } catch (err) {
      console.error("Convex store failed:", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Sorry, the form isn’t live yet. Please email us directly." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  const from =
    process.env.RESEND_FROM || "Bicycle Website <website@bicyclelondon.com>";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `New ${sanitiseLine(data.enquiryType)} enquiry from ${sanitiseLine(
      data.name,
    )}`,
    text: [
      `Enquiry type: ${data.enquiryType}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.company ? `Company: ${data.company}` : null,
      "",
      data.message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  if (error) {
    console.error("Resend send failed:", error);
    return NextResponse.json(
      { error: "Could not send your message. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
