import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { readRawBodyWithLimit } from "@/lib/read-raw-body";
import { parseStripeEvent, verifyStripeSignature } from "@/lib/stripe-webhook";
import { supabaseServiceRpc } from "@/lib/supabase-rest";
import { currentLaunch } from "@/lib/launch-stage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_STRIPE_EVENT_BYTES = 256 * 1024;
const NO_STORE = { "cache-control": "no-store" };

type WebhookClaim = {
  state?: unknown;
  attempt?: unknown;
};

function paymentsEnabled(): boolean {
  return currentLaunch.billing && ["test", "live"].includes(process.env.PAYMENTS_MODE || "disabled");
}

export async function POST(request: Request) {
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: "payments are disabled" }, { status: 503, headers: NO_STORE });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature") || "";
  if (!webhookSecret) {
    return NextResponse.json({ error: "webhook is not configured" }, { status: 503, headers: NO_STORE });
  }

  const body = await readRawBodyWithLimit(request, MAX_STRIPE_EVENT_BYTES);
  if (!body.ok) {
    return NextResponse.json({ error: body.message }, { status: body.status, headers: NO_STORE });
  }

  try {
    verifyStripeSignature(body.value, signature, webhookSecret);
    const event = parseStripeEvent(body.value);
    const payloadHash = createHash("sha256").update(body.value).digest("hex");
    const claim = await supabaseServiceRpc<WebhookClaim>("claim_stripe_webhook_event", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_payload_sha256: payloadHash,
    });
    const attempt = Number(claim.attempt);
    if (!Number.isInteger(attempt) || attempt < 1 || attempt > 1_000) {
      throw new Error("webhook receipt refused");
    }
    if (claim.state === "duplicate") {
      return NextResponse.json({ received: true, duplicate: true }, { headers: NO_STORE });
    }
    if (claim.state === "in_progress") {
      return NextResponse.json(
        { received: false, retry: true },
        { status: 409, headers: NO_STORE },
      );
    }
    if (claim.state !== "claimed" && claim.state !== "retry") throw new Error("webhook receipt refused");

    await supabaseServiceRpc("apply_stripe_webhook_projection", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_projection: event.projection,
      p_attempt: attempt,
    });
    return NextResponse.json(
      { received: true, ignored: event.projection.kind === "ignored" },
      { headers: NO_STORE },
    );
  } catch (error) {
    const message = error instanceof Error && /signature|timestamp/.test(error.message)
      ? "invalid signature"
      : "webhook processing failed";
    return NextResponse.json({ error: message }, { status: message === "invalid signature" ? 400 : 502, headers: NO_STORE });
  }
}
