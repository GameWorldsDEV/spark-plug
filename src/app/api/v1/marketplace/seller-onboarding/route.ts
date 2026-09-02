import "server-only";

import { NextResponse } from "next/server";
import { requestAccessToken } from "@/lib/auth-flow";
import { billingConfig, stripeRequest } from "@/lib/billing";
import { currentLaunch } from "@/lib/launch-stage";
import { authenticateSupabaseUser, supabaseServiceRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const CONNECT_ID = /^acct_[A-Za-z0-9_]{8,128}$/;
const NO_STORE = { "cache-control": "private, no-store" };

type SellerContext = { connectedAccountId?: unknown; eligible?: unknown; sellerTermsAccepted?: unknown };

export async function POST(request: Request) {
  const config = billingConfig();
  if (!currentLaunch.marketplaceSales || process.env.MARKETPLACE_CONNECT_READY !== "true" || !config) {
    return NextResponse.json({ error: "seller onboarding is not active" }, { status: 503, headers: NO_STORE });
  }
  const token = requestAccessToken(request);
  if (!token) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  try {
    const user = await authenticateSupabaseUser(token);
    const seller = await supabaseServiceRpc<SellerContext>("creator_payout_context", { p_user_id: user.id });
    if (seller.eligible !== true || seller.sellerTermsAccepted !== true) {
      return NextResponse.json({ error: "Pro and accepted seller terms are required" }, { status: 403, headers: NO_STORE });
    }
    let accountId = typeof seller.connectedAccountId === "string" && CONNECT_ID.test(seller.connectedAccountId)
      ? seller.connectedAccountId : null;
    if (!accountId) {
      const country = process.env.MARKETPLACE_DEFAULT_SELLER_COUNTRY || "US";
      if (!/^[A-Z]{2}$/.test(country)) throw new Error("seller country is not configured");
      const created = await stripeRequest<{ id?: unknown }>(config, "accounts", new URLSearchParams({
        type: "express",
        country,
        "capabilities[transfers][requested]": "true",
        "metadata[sparkplug_user_id]": user.id,
      }), `creator-account-${user.id}`);
      if (typeof created.id !== "string" || !CONNECT_ID.test(created.id)) throw new Error("invalid Connect account");
      accountId = created.id;
      await supabaseServiceRpc("register_creator_payout_account", { p_user_id: user.id, p_account_id: accountId });
    }
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
    const link = await stripeRequest<{ url?: unknown }>(config, "account_links", new URLSearchParams({
      account: accountId,
      refresh_url: `${origin}/account?connect=refresh`,
      return_url: `${origin}/account?connect=return`,
      type: "account_onboarding",
    }));
    if (typeof link.url !== "string" || !link.url.startsWith("https://connect.stripe.com/")) throw new Error("invalid onboarding URL");
    return NextResponse.json({ url: link.url }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "seller onboarding could not be created" }, { status: 409, headers: NO_STORE });
  }
}
