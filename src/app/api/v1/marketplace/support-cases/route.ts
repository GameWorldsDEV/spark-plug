import "server-only";

import { NextResponse } from "next/server";
import { requestAccessToken } from "@/lib/auth-flow";
import { currentLaunch } from "@/lib/launch-stage";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import { authenticateSupabaseUser, supabaseServiceRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256 = /^[0-9a-f]{64}$/;
const NO_STORE = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  if (!currentLaunch.marketplaceSales) return NextResponse.json({ error: "marketplace support is not active" }, { status: 503, headers: NO_STORE });
  const token = requestAccessToken(request);
  if (!token) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  const body = await readJsonBodyWithLimit(request, 8 * 1024);
  const input = body.ok && body.value && typeof body.value === "object" && !Array.isArray(body.value) ? body.value as Record<string, unknown> : null;
  if (!input || Object.keys(input).some((key) => !["orderId", "compatibilityId", "preflightSha256", "summary"].includes(key)) ||
    typeof input.orderId !== "string" || !UUID.test(input.orderId) ||
    typeof input.compatibilityId !== "string" || !UUID.test(input.compatibilityId) ||
    typeof input.preflightSha256 !== "string" || !SHA256.test(input.preflightSha256) ||
    typeof input.summary !== "string" || input.summary.trim().length < 10 || input.summary.length > 4000) {
    return NextResponse.json({ error: "support case is invalid" }, { status: 400, headers: NO_STORE });
  }
  try {
    const user = await authenticateSupabaseUser(token);
    const id = await supabaseServiceRpc<unknown>("create_marketplace_support_case", {
      p_buyer_id: user.id, p_order_id: input.orderId, p_compatibility_id: input.compatibilityId,
      p_preflight_sha256: input.preflightSha256, p_summary: input.summary.trim(),
    });
    if (typeof id !== "string" || !UUID.test(id)) throw new Error("invalid case id");
    return NextResponse.json({ id, status: "creator_review" }, { status: 201, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "support case could not be opened" }, { status: 409, headers: NO_STORE });
  }
}
