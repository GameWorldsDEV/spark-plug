import { describe, expect, it } from "vitest";
import { communityFeatures, creatorAssetTypes, marketplacePlatformFeeCents, MARKETPLACE_PLATFORM_FEE_BPS, MARKETPLACE_PLATFORM_FEE_PERCENT, PRO_ANNUAL_USD, PRO_MONTHLY_USD, proFeatures } from "./plans";

describe("commercial plan contract", () => {
  it("keeps the local product useful without Pro", () => {
    expect(communityFeatures.join(" ")).toMatch(/complete local control/i);
    expect(communityFeatures.join(" ")).toMatch(/Unsloth and LoRA/i);
  });

  it("uses the approved launch prices and creator asset boundary", () => {
    expect([PRO_MONTHLY_USD, PRO_ANNUAL_USD]).toEqual([5, 48]);
    expect(proFeatures.join(" ")).toMatch(/creator storefront/i);
    expect(creatorAssetTypes).toContain("Rights-cleared LoRA adapters");
  });
});

describe("marketplace fee", () => {
  it("is a server-owned five percent basis-point value", () => {
    expect(MARKETPLACE_PLATFORM_FEE_BPS).toBe(500);
    expect(MARKETPLACE_PLATFORM_FEE_PERCENT).toBe(5);
    expect(marketplacePlatformFeeCents(1000)).toBe(50);
    expect(marketplacePlatformFeeCents(1999)).toBe(100);
  });

  it("rejects invalid money values", () => {
    expect(() => marketplacePlatformFeeCents(-1)).toThrow(RangeError);
    expect(() => marketplacePlatformFeeCents(1.5)).toThrow(RangeError);
  });
});
