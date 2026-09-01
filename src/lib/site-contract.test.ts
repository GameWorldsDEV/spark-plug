import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const source = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("three-stage public contract", () => {
  it("uses one stage authority across indexing and protected routes", () => {
    expect(source("src/app/layout.tsx")).toContain("currentLaunch.indexable");
    expect(source("src/app/api/v1/profiles/route.ts")).toContain("currentLaunch.profilePublishing");
    expect(source("src/app/api/stripe/webhook/route.ts")).toContain("currentLaunch.billing");
  });

  it("documents external support consistently", () => {
    for (const path of ["src/app/privacy/page.tsx", "src/app/terms/page.tsx", "src/app/security/page.tsx"]) {
      expect(source(path)).toMatch(/Stripe/);
    }
    expect(source("src/app/support/page.tsx")).toMatch(/not a software purchase/);
    expect(source("src/app/support/page.tsx")).toMatch(/not a tax-deductible charitable donation|charitable contribution/);
  });

  it("keeps paid marketplace and hosted training out of the first Commercial stage", () => {
    expect(source("src/app/api/v1/profiles/route.ts")).not.toContain('"free" | "paid"');
    expect(source("src/lib/entitlements.ts")).not.toContain("profile_publish_paid");
    expect(source("src/lib/launch-stage.ts")).toContain("hostedTraining: false");
  });

  it("keeps the Vercel-host redirect gated until the custom domain resolves", () => {
    const proxy = source("src/proxy.ts");
    expect(proxy).toContain('NEXT_PUBLIC_CANONICAL_REDIRECT === "true"');
    expect(proxy).toContain("sparkplug-public-launch-site.vercel.app");
    expect(proxy).toContain("https://sparkplug.gameworlds.ai");
  });
});
