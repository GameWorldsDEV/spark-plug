import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseStripeEvent, verifyStripeSignature } from "./stripe-webhook";

const SECRET = "whsec_test_secret_at_least_16_bytes";
const NOW = 2_000_000_000;

function signed(body: Uint8Array, timestamp = NOW) {
  const digest = createHmac("sha256", SECRET)
    .update(Buffer.concat([Buffer.from(`${timestamp}.`), Buffer.from(body)]))
    .digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

describe("Stripe webhook boundary", () => {
  it("verifies the raw bytes and rejects replay outside tolerance", () => {
    const body = new TextEncoder().encode('{"id":"evt_12345678"}');
    expect(() => verifyStripeSignature(body, signed(body), SECRET, NOW)).not.toThrow();
    expect(() => verifyStripeSignature(body, signed(body), SECRET, NOW + 301)).toThrow(/stale/);
    const changed = new TextEncoder().encode('{"id":"evt_CHANGED"}');
    expect(() => verifyStripeSignature(changed, signed(body), SECRET, NOW)).toThrow(/mismatch/);
  });

  it("reduces a subscription event to a safe projection", () => {
    const body = new TextEncoder().encode(JSON.stringify({
      id: "evt_subscription_12345678",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_123",
          customer: "cus_123",
          status: "active",
          current_period_end: NOW + 86_400,
          metadata: { sparkplug_user_id: "123e4567-e89b-12d3-a456-426614174000", private_note: "discard" },
          items: { data: [{ price: { id: "price_pro_monthly" } }] },
        },
      },
    }));
    const event = parseStripeEvent(body);
    expect(event.projection).toEqual({
      kind: "subscription",
      userId: "123e4567-e89b-12d3-a456-426614174000",
      customerId: "cus_123",
      subscriptionId: "sub_123",
      status: "active",
      priceId: "price_pro_monthly",
      currentPeriodEnd: NOW + 86_400,
    });
    expect(JSON.stringify(event.projection)).not.toContain("private_note");
  });

  it("ignores unknown event types after signature verification", () => {
    const event = parseStripeEvent(new TextEncoder().encode(JSON.stringify({
      id: "evt_unknown_12345678",
      type: "radar.early_fraud_warning.created",
      data: { object: { id: "issfr_123", metadata: { secret: "discard" } } },
    })));
    expect(event.projection).toEqual({ kind: "ignored" });
  });

  it("projects the immutable order id for a marketplace checkout", () => {
    const event = parseStripeEvent(new TextEncoder().encode(JSON.stringify({
      id: "evt_checkout_12345678",
      type: "checkout.session.completed",
      data: { object: {
        id: "cs_test_12345678", payment_intent: "pi_12345678", amount_total: 2500, currency: "usd",
        metadata: {
          sparkplug_purpose: "profile",
          sparkplug_user_id: "123e4567-e89b-12d3-a456-426614174000",
          sparkplug_listing_id: "123e4567-e89b-12d3-a456-426614174001",
          sparkplug_order_id: "123e4567-e89b-12d3-a456-426614174002",
        },
      } },
    })));
    expect(event.projection).toMatchObject({ kind: "checkout", orderId: "123e4567-e89b-12d3-a456-426614174002" });
  });
});
