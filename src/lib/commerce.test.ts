import { describe, expect, it } from "vitest";
import { marketplaceFeeForCheckout, parseMarketplaceCheckoutProjection } from "./commerce";

const valid = {
  orderId: "00000000-0000-4000-8000-000000000001",
  listingId: "00000000-0000-4000-8000-000000000002",
  priceId: "price_12345678",
  connectedAccountId: "acct_12345678",
  amountCents: 2500,
  currency: "usd" as const,
};

describe("marketplace checkout projection", () => {
  it("accepts a bounded server projection and calculates five percent", () => {
    expect(parseMarketplaceCheckoutProjection(valid)).toEqual(valid);
    expect(marketplaceFeeForCheckout(valid)).toBe(125);
  });

  it("rejects browser-shaped price or payout substitutions", () => {
    expect(parseMarketplaceCheckoutProjection({ ...valid, priceId: "custom" })).toBeNull();
    expect(parseMarketplaceCheckoutProjection({ ...valid, connectedAccountId: "acct_bad" })).toBeNull();
    expect(parseMarketplaceCheckoutProjection({ ...valid, amountCents: 99 })).toBeNull();
  });
});
