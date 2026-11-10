import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SANITY_TAG } from "@/sanity/lib/fetch";

export const dynamic = "force-dynamic";

// Called by the Sanity "Instant publish" webhook so published changes appear
// straight away. Without it, content only refreshes on the daily backstop.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(
    request,
    secret,
  );
  if (!isValidSignature)
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  revalidateTag(SANITY_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
