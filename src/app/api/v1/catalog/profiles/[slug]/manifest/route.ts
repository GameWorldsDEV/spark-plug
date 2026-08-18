import "server-only";

import { NextResponse } from "next/server";
import {
  supabaseAnonRpc,
  supabaseUserRpc,
} from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SLUG = /^[a-z0-9][a-z0-9-]{2,79}$/;
const PRIVATE = { "cache-control": "private, no-store" };
const PUBLIC = { "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" };

type ManifestProjection = {
  access: "free" | "paid";
  schemaVersion: number;
  manifest: unknown;
  manifestSha256: string;
  riskLevel: string;
  riskLabels: string[];
};

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  const token = authorization.slice(7).trim();
  return token.length >= 16 && token.length <= 8_192 ? token : null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!SLUG.test(slug)) {
    return NextResponse.json({ error: "profile not found" }, { status: 404, headers: PRIVATE });
  }

  try {
    const accessToken = bearerToken(request);
    const projection = accessToken
      ? await supabaseUserRpc<ManifestProjection>(
        accessToken,
        "authorized_profile_manifest_by_slug",
        { p_slug: slug },
      )
      : await supabaseAnonRpc<ManifestProjection>(
        "authorized_profile_manifest_by_slug",
        { p_slug: slug },
      );
    const { access, ...manifestEnvelope } = projection;

    return NextResponse.json(manifestEnvelope, {
      headers: access === "free" ? PUBLIC : PRIVATE,
    });
  } catch {
    // Do not reveal whether a paid profile, purchase, or account exists.
    return NextResponse.json({ error: "profile unavailable" }, { status: 404, headers: PRIVATE });
  }
}
