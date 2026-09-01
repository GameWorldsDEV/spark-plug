import "server-only";

import { NextResponse } from "next/server";
import { decodeCatalogCursor, encodeCatalogCursor } from "@/lib/catalog-cursor";
import { supabaseServiceSelect } from "@/lib/supabase-rest";
import { currentLaunch } from "@/lib/launch-stage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE = "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

type CatalogProfile = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  access: "free";
  price_cents: number;
  currency: string;
  published_at: string;
  creator_handle: string;
  creator_display_name: string;
  creator_class: string;
  risk_level: string;
  risk_labels: string[];
  current_manifest_sha256: string;
};

function boundedLimit(url: URL): number {
  const parsed = Number(url.searchParams.get("limit") || "24");
  return Number.isInteger(parsed) ? Math.min(50, Math.max(1, parsed)) : 24;
}

export async function GET(request: Request) {
  if (!currentLaunch.accounts) {
    return NextResponse.json({ error: "marketplace catalog is not active" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
  const url = new URL(request.url);
  const limit = boundedLimit(url);
  const cursor = url.searchParams.get("before");
  const filters = new URLSearchParams({
    select:
      "id,slug,title,summary,access,price_cents,currency,published_at,creator_handle,creator_display_name,creator_class,risk_level,risk_labels,current_manifest_sha256",
    order: "published_at.desc,id.desc",
    limit: String(limit + 1),
  });
  if (cursor) {
    const decoded = decodeCatalogCursor(cursor);
    if (!decoded) {
      return NextResponse.json({ error: "invalid cursor" }, { status: 400, headers: { "cache-control": "no-store" } });
    }
    filters.set(
      "or",
      `(published_at.lt.${decoded.publishedAt},and(published_at.eq.${decoded.publishedAt},id.lt.${decoded.id}))`,
    );
  }
  try {
    const rows = await supabaseServiceSelect<CatalogProfile[]>(`public_profile_catalog?${filters}`);
    const hasMore = rows.length > limit;
    const profiles = rows.slice(0, limit);
    return NextResponse.json(
      {
        profiles,
        next: hasMore && profiles.length
          ? encodeCatalogCursor({
            publishedAt: profiles.at(-1)!.published_at,
            id: profiles.at(-1)!.id,
          })
          : null,
        manifestDelivery: "separate-authorized-route",
      },
      { headers: { "cache-control": CACHE } },
    );
  } catch {
    return NextResponse.json(
      { error: "catalog temporarily unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
