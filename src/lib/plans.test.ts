import { describe, expect, it } from "vitest";
import {
  displayPrice,
  entitlementsForPlan,
  planGrants,
  PLANS,
} from "./plans";

describe("plan entitlements", () => {
  it("keeps core routing and outputs in every plan", () => {
    for (const plan of PLANS) {
      const entitlements = entitlementsForPlan(plan.id);
      expect(entitlements.has("core.local_routes")).toBe(true);
      expect(entitlements.has("core.outputs")).toBe(true);
    }
  });

  it("does not leak premium or creator permissions into Community", () => {
    expect(planGrants("community", "pro.premium_themes")).toBe(false);
    expect(planGrants("community", "creator.paid_listings")).toBe(false);
  });

  it("grants paid listings to Pro without conflating plan and verification", () => {
    expect(planGrants("pro", "creator.paid_listings")).toBe(true);
    expect(planGrants("pro", "creator.verified_badge")).toBe(false);
  });

  it("displays the approved Pro billing math", () => {
    const pro = PLANS.find((plan) => plan.id === "pro");
    expect(pro).toBeDefined();
    expect(displayPrice(pro!, false)).toBe("$5");
    expect(displayPrice(pro!, true)).toBe("$4");
  });
});
