import "server-only";

import { NextResponse } from "next/server";
import { requestAccessToken } from "@/lib/auth-flow";
import { currentLaunch } from "@/lib/launch-stage";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import { authenticateSupabaseUser, supabaseServiceRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NO_STORE = { "cache-control": "private, no-store" };
const EVENT_TYPES = new Set(["message", "revision", "creator_cure_started", "creator_cure_completed", "escalated"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!currentLaunch.marketplaceSales) return NextResponse.json({ error: "marketplace support is not active" }, { status: 503, headers: NO_STORE });
  const token = requestAccessToken(request);
  if (!token) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  const { id } = await context.params;
  const body = await readJsonBodyWithLimit(request, 12 * 1024);
  const input = body.ok && body.value && typeof body.value === "object" && !Array.isArray(body.value) ? body.value as Record<string, unknown> : null;
  if (!UUID.test(id) || !input || Object.keys(input).some((key) => !["type", "note", "evidence"].includes(key)) ||
    typeof input.type !== "string" || !EVENT_TYPES.has(input.type) ||
    typeof input.note !== "string" || input.note.trim().length < 1 || input.note.length > 4000 ||
    (input.evidence !== undefined && (!input.evidence || typeof input.evidence !== "object" || Array.isArray(input.evidence) || JSON.stringify(input.evidence).length > 6000))) {
    return NextResponse.json({ error: "case event is invalid" }, { status: 400, headers: NO_STORE });
  }
  try {
    const user = await authenticateSupabaseUser(token);
    await supabaseServiceRpc("append_marketplace_case_event", {
      p_actor_id: user.id, p_case_id: id, p_event_type: input.type,
      p_note: input.note.trim(), p_evidence: input.evidence || {},
    });
    return NextResponse.json({ accepted: true }, { status: 202, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "case event could not be accepted" }, { status: 409, headers: NO_STORE });
  }
}
