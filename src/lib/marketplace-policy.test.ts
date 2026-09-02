import { describe, expect, it } from "vitest";
import { assessMarketplaceRefund, parseCompatibilityDeclarations, REQUIRED_COMPATIBILITY_FIELDS } from "./marketplace-policy";

const base = {
  mandatoryLawApplies: false,
  configurationWasDeclaredCompatible: true,
  reproducibleDefect: true,
  creatorCureAttempted: true,
  creatorFixedIssue: false,
  creatorAbandonedListing: false,
  gameWorldsVerified: true,
};

describe("marketplace refund assessment", () => {
  it("requires detailed hardware and runtime compatibility", () => {
    expect(REQUIRED_COMPATIBILITY_FIELDS).toContain("deviceModel");
    expect(REQUIRED_COMPATIBILITY_FIELDS).toContain("modelRevision");
    expect(REQUIRED_COMPATIBILITY_FIELDS).toContain("testedAt");
  });

  it("accepts only bounded, specific compatibility evidence", () => {
    const valid = [{
      deviceMaker: "NVIDIA", deviceModel: "DGX Spark", operatingSystem: "Ubuntu 24.04",
      architecture: "arm64", memoryGb: 128, gpu: "GB10", vramGb: 128,
      engine: "vLLM", engineVersion: "1.0.0", modelRevision: "a".repeat(40),
      testedAt: "2026-09-02T12:00:00.000Z",
    }];
    expect(parseCompatibilityDeclarations(valid)).toEqual(valid);
    expect(parseCompatibilityDeclarations([{ ...valid[0], memoryGb: 0 }])).toBeNull();
    expect(parseCompatibilityDeclarations([{ ...valid[0], extra: "no" }])).toBeNull();
  });

  it("allows verified unfixable defects and abandoned listings", () => {
    expect(assessMarketplaceRefund(base)).toBe("eligible");
    expect(assessMarketplaceRefund({ ...base, creatorAbandonedListing: true, reproducibleDefect: false })).toBe("eligible");
  });

  it("sends unresolved defects through creator cure and admin review", () => {
    expect(assessMarketplaceRefund({ ...base, creatorCureAttempted: false })).toBe("needs-review");
    expect(assessMarketplaceRefund({ ...base, gameWorldsVerified: false })).toBe("needs-review");
    expect(assessMarketplaceRefund({ ...base, creatorFixedIssue: true })).toBe("not-eligible");
  });

  it("preserves mandatory legal rights", () => {
    expect(assessMarketplaceRefund({ ...base, mandatoryLawApplies: true, configurationWasDeclaredCompatible: false })).toBe("eligible");
  });
});
