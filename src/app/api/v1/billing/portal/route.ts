import "server-only";

import { NextResponse } from "next/server";
import { billingConfig, stripeRequest } from "@/lib/billing";
import { requestAccessToken } from "@/lib/auth-flow";
import { supabaseUserRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "private, no-store" };
type BillingContext = { user_id?: unknown; stripe_customer_id?: unknown };

export async function POST(request: Request) {
  const config = billingConfig();
  if (!config) return NextResponse.json({ error: "billing is not active" }, { status: 503, headers: NO_STORE });
  const accessToken = requestAccessToken(request);
  if (!accessToken) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  try {
    const context = await supabaseUserRpc<BillingContext>(accessToken, "current_billing_context");
    if (typeof context.stripe_customer_id !== "string" || !/^cus_[A-Za-z0-9_]{8,128}$/.test(context.stripe_customer_id)) {
      return NextResponse.json({ error: "billing account is not available" }, { status: 409, headers: NO_STORE });
    }
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
    const session = await stripeRequest<{ url?: unknown }>(config, "billing_portal/sessions", new URLSearchParams({
      customer: context.stripe_customer_id,
      return_url: `${origin}/account`,
    }));
    if (typeof session.url !== "string" || !session.url.startsWith("https://billing.stripe.com/")) throw new Error("invalid portal URL");
    return NextResponse.json({ url: session.url }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "billing portal could not be created" }, { status: 502, headers: NO_STORE });
  }
}
