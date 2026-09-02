import "server-only";

import { NextResponse } from "next/server";
import { requestAccessToken } from "@/lib/auth-flow";
import { billingConfig, stripeRequest } from "@/lib/billing";
import { marketplaceCheckoutReady, marketplaceFeeForCheckout, parseMarketplaceCheckoutProjection } from "@/lib/commerce";
import { currentLaunch } from "@/lib/launch-stage";
import { MARKETPLACE_PLATFORM_FEE_BPS } from "@/lib/plans";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import { authenticateSupabaseUser, supabaseServiceRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NO_STORE = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  const config = billingConfig();
  if (!currentLaunch.marketplaceSales || !marketplaceCheckoutReady() || !config) {
    return NextResponse.json({ error: "marketplace checkout is not active" }, { status: 503, headers: NO_STORE });
  }
  const token = requestAccessToken(request);
  if (!token) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  const body = await readJsonBodyWithLimit(request, 1024);
  const input = body.ok && body.value && typeof body.value === "object" && !Array.isArray(body.value)
    ? body.value as Record<string, unknown> : null;
  if (!input || Object.keys(input).some((key) => key !== "listingId") || typeof input.listingId !== "string" || !UUID.test(input.listingId)) {
    return NextResponse.json({ error: "listing is invalid" }, { status: 400, headers: NO_STORE });
  }
  try {
    const user = await authenticateSupabaseUser(token);
    const prepared = parseMarketplaceCheckoutProjection(await supabaseServiceRpc("prepare_marketplace_checkout", {
      p_buyer_id: user.id,
      p_listing_id: input.listingId,
    }));
    if (!prepared) throw new Error("invalid checkout projection");
    const feeCents = marketplaceFeeForCheckout(prepared);
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
    const session = await stripeRequest<{ url?: unknown }>(config, "checkout/sessions", new URLSearchParams({
      mode: "payment",
      "line_items[0][price]": prepared.priceId,
      "line_items[0][quantity]": "1",
      client_reference_id: user.id,
      "metadata[sparkplug_purpose]": "profile",
      "metadata[sparkplug_user_id]": user.id,
      "metadata[sparkplug_listing_id]": prepared.listingId,
      "metadata[sparkplug_order_id]": prepared.orderId,
      "metadata[sparkplug_platform_fee_bps]": String(MARKETPLACE_PLATFORM_FEE_BPS),
      "payment_intent_data[application_fee_amount]": String(feeCents),
      "payment_intent_data[transfer_data][destination]": prepared.connectedAccountId,
      success_url: `${origin}/marketplace?checkout=success`,
      cancel_url: `${origin}/marketplace?checkout=canceled`,
    }), `marketplace-checkout-${prepared.orderId}`);
    if (typeof session.url !== "string" || !session.url.startsWith("https://checkout.stripe.com/")) throw new Error("invalid checkout URL");
    return NextResponse.json({ url: session.url }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "checkout could not be created" }, { status: 409, headers: NO_STORE });
  }
}
