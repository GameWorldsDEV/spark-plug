import { MARKETPLACE_PLATFORM_FEE_BPS, marketplacePlatformFeeCents } from "./plans";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRICE_ID = /^price_[A-Za-z0-9_]{8,128}$/;
const CONNECT_ID = /^acct_[A-Za-z0-9_]{8,128}$/;

export type MarketplaceCheckoutProjection = {
  orderId: string;
  listingId: string;
  priceId: string;
  connectedAccountId: string;
  amountCents: number;
  currency: "usd";
};

export function marketplaceCheckoutReady(): boolean {
  return process.env.MARKETPLACE_CHECKOUT_READY === "true";
}

export function parseMarketplaceCheckoutProjection(value: unknown): MarketplaceCheckoutProjection | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.orderId !== "string" || !UUID.test(row.orderId) ||
    typeof row.listingId !== "string" || !UUID.test(row.listingId) ||
    typeof row.priceId !== "string" || !PRICE_ID.test(row.priceId) ||
    typeof row.connectedAccountId !== "string" || !CONNECT_ID.test(row.connectedAccountId) ||
    !Number.isSafeInteger(row.amountCents) || Number(row.amountCents) < 100 || Number(row.amountCents) > 100_000 ||
    row.currency !== "usd"
  ) return null;
  return row as MarketplaceCheckoutProjection;
}

export function marketplaceFeeForCheckout(projection: MarketplaceCheckoutProjection): number {
  return marketplacePlatformFeeCents(projection.amountCents);
}

export const MARKETPLACE_FEE_METADATA = String(MARKETPLACE_PLATFORM_FEE_BPS);
