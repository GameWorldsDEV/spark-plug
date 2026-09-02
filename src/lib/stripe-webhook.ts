import { createHmac, timingSafeEqual } from "node:crypto";

const EVENT_ID = /^evt_[A-Za-z0-9_]{8,128}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JsonRecord = Record<string, unknown>;

export type StripeProjection =
  | {
      kind: "subscription";
      userId: string | null;
      customerId: string | null;
      subscriptionId: string;
      status: string;
      priceId: string | null;
      currentPeriodEnd: number | null;
    }
  | {
      kind: "checkout";
      purpose: "pro" | "profile" | "unknown";
      userId: string | null;
      listingId: string | null;
      orderId: string | null;
      checkoutSessionId: string;
      customerId: string | null;
      subscriptionId: string | null;
      paymentIntentId: string | null;
      amountTotal: number | null;
      currency: string | null;
    }
  | {
      kind: "connect";
      accountId: string;
      chargesEnabled: boolean;
      payoutsEnabled: boolean;
    }
  | {
      kind: "order-status";
      paymentIntentId: string | null;
      status: "refunded" | "disputed";
    }
  | { kind: "ignored" };

export type VerifiedStripeEvent = {
  id: string;
  type: string;
  projection: StripeProjection;
};

function record(value: unknown): JsonRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function stringOrNull(value: unknown, max = 255): string | null {
  return typeof value === "string" && value.length > 0 && value.length <= max ? value : null;
}

function uuidOrNull(value: unknown): string | null {
  return typeof value === "string" && UUID.test(value) ? value : null;
}

function metadata(object: JsonRecord): JsonRecord {
  return record(object.metadata) || {};
}

function projectionFor(type: string, object: JsonRecord): StripeProjection {
  if (type.startsWith("customer.subscription.")) {
    const subscriptionId = stringOrNull(object.id);
    if (!subscriptionId) return { kind: "ignored" };
    const items = record(object.items);
    const data = Array.isArray(items?.data) ? items?.data : [];
    const firstItem = record(data[0]);
    const price = record(firstItem?.price);
    const meta = metadata(object);
    return {
      kind: "subscription",
      userId: uuidOrNull(meta.sparkplug_user_id),
      customerId: stringOrNull(object.customer),
      subscriptionId,
      status: stringOrNull(object.status, 40) || "inactive",
      priceId: stringOrNull(price?.id),
      currentPeriodEnd:
        typeof object.current_period_end === "number" && Number.isSafeInteger(object.current_period_end)
          ? object.current_period_end
          : null,
    };
  }

  if (type === "checkout.session.completed") {
    const checkoutSessionId = stringOrNull(object.id);
    if (!checkoutSessionId) return { kind: "ignored" };
    const meta = metadata(object);
    const purpose = ["pro", "profile"].includes(String(meta.sparkplug_purpose))
      ? (meta.sparkplug_purpose as "pro" | "profile")
      : "unknown";
    return {
      kind: "checkout",
      purpose,
      userId: uuidOrNull(meta.sparkplug_user_id),
      listingId: uuidOrNull(meta.sparkplug_listing_id),
      orderId: uuidOrNull(meta.sparkplug_order_id),
      checkoutSessionId,
      customerId: stringOrNull(object.customer),
      subscriptionId: stringOrNull(object.subscription),
      paymentIntentId: stringOrNull(object.payment_intent),
      amountTotal:
        typeof object.amount_total === "number" && Number.isSafeInteger(object.amount_total)
          ? object.amount_total
          : null,
      currency: typeof object.currency === "string" && /^[a-z]{3}$/.test(object.currency) ? object.currency : null,
    };
  }

  if (type === "account.updated") {
    const accountId = stringOrNull(object.id);
    if (!accountId) return { kind: "ignored" };
    return {
      kind: "connect",
      accountId,
      chargesEnabled: object.charges_enabled === true,
      payoutsEnabled: object.payouts_enabled === true,
    };
  }

  if (type === "charge.refunded" || type === "charge.dispute.created") {
    return {
      kind: "order-status",
      paymentIntentId: stringOrNull(object.payment_intent),
      status: type === "charge.refunded" ? "refunded" : "disputed",
    };
  }

  return { kind: "ignored" };
}

export function verifyStripeSignature(
  rawBody: Uint8Array,
  signatureHeader: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300,
): void {
  if (!signatureHeader || signatureHeader.length > 2_048 || secret.length < 16) {
    throw new Error("invalid Stripe signature configuration");
  }
  const parts = signatureHeader.split(",");
  const timestamp = Number(parts.find((part) => part.startsWith("t="))?.slice(2));
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
    .filter((value) => /^[a-f0-9]{64}$/.test(value));
  if (!Number.isSafeInteger(timestamp) || signatures.length === 0) throw new Error("invalid Stripe signature header");
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) throw new Error("Stripe signature timestamp is stale");

  const signedPayload = Buffer.concat([
    Buffer.from(`${timestamp}.`, "utf8"),
    Buffer.from(rawBody),
  ]);
  const expected = createHmac("sha256", secret).update(signedPayload).digest();
  const matched = signatures.some((candidate) => {
    const actual = Buffer.from(candidate, "hex");
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  });
  if (!matched) throw new Error("Stripe signature mismatch");
}

export function parseStripeEvent(rawBody: Uint8Array): VerifiedStripeEvent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(rawBody));
  } catch {
    throw new Error("Stripe event body is invalid JSON");
  }
  const event = record(parsed);
  const data = record(event?.data);
  const object = record(data?.object);
  if (
    !event ||
    typeof event.id !== "string" ||
    !EVENT_ID.test(event.id) ||
    typeof event.type !== "string" ||
    event.type.length < 1 ||
    event.type.length > 120 ||
    !object
  ) {
    throw new Error("Stripe event shape is invalid");
  }
  return { id: event.id, type: event.type, projection: projectionFor(event.type, object) };
}
