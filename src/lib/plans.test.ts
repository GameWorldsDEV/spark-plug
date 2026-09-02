import { describe, expect, it } from "vitest";
import { communityFeatures, creatorAssetTypes, PRO_ANNUAL_USD, PRO_MONTHLY_USD, proFeatures } from "./plans";

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
