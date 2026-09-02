import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { currentLaunch } from "@/lib/launch-stage";
import { supabaseServiceSelect } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const REFRESH_SECONDS = 60 * 60;
const CACHE = `public, max-age=${REFRESH_SECONDS}, s-maxage=${REFRESH_SECONDS}, stale-while-revalidate=86400`;
const FIELDS = "id,slug,title,summary,access,price_cents,currency,published_at,creator_handle,creator_display_name,creator_class,risk_level,risk_labels,current_manifest_sha256";

export async function GET(request: Request) {
  if (!currentLaunch.marketplaceSales) return NextResponse.json({ error: "marketplace catalog is not active" }, { status: 503, headers: { "cache-control": "no-store" } });
  try {
    const profiles = await supabaseServiceSelect<unknown[]>(`public_profile_catalog?select=${FIELDS}&order=published_at.desc,id.desc&limit=200`);
    const serialized = JSON.stringify({ schemaVersion: 1, refreshAfterSeconds: REFRESH_SECONDS, profiles });
    const etag = `"${createHash("sha256").update(serialized).digest("base64url")}"`;
    if (request.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: { "cache-control": CACHE, etag } });
    return new NextResponse(serialized, { headers: { "cache-control": CACHE, "content-type": "application/json; charset=utf-8", etag } });
  } catch {
    return NextResponse.json({ error: "catalog temporarily unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
