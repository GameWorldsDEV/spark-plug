import "server-only";

import { NextResponse } from "next/server";
import { billingConfig, parseBillingCadence, stripeRequest } from "@/lib/billing";
import { requestAccessToken } from "@/lib/auth-flow";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";
import { authenticateSupabaseUser } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  const config = billingConfig();
  if (!config) return NextResponse.json({ error: "billing is not active" }, { status: 503, headers: NO_STORE });
  const accessToken = requestAccessToken(request);
  if (!accessToken) return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  const body = await readJsonBodyWithLimit(request, 1024);
  const cadence = body.ok && body.value && typeof body.value === "object"
    ? parseBillingCadence((body.value as Record<string, unknown>).cadence)
    : null;
  if (!cadence || !body.ok || Object.keys(body.value as Record<string, unknown>).some((key) => key !== "cadence")) {
    return NextResponse.json({ error: "billing cadence is invalid" }, { status: 400, headers: NO_STORE });
  }
  try {
    const user = await authenticateSupabaseUser(accessToken);
    const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
    const params = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": cadence === "monthly" ? config.monthlyPriceId : config.annualPriceId,
      "line_items[0][quantity]": "1",
      client_reference_id: user.id,
      "metadata[sparkplug_purpose]": "pro",
      "metadata[sparkplug_user_id]": user.id,
      "subscription_data[metadata][sparkplug_user_id]": user.id,
      allow_promotion_codes: "false",
      success_url: `${origin}/account?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
    });
    const session = await stripeRequest<{ url?: unknown }>(config, "checkout/sessions", params);
    if (typeof session.url !== "string" || !session.url.startsWith("https://checkout.stripe.com/")) throw new Error("invalid checkout URL");
    return NextResponse.json({ url: session.url }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "checkout could not be created" }, { status: 502, headers: NO_STORE });
  }
}
