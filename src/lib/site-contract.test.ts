import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../..");
const source = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("open-source core and gated commercial-service contract", () => {
  it("uses one stage authority across indexing and downloads", () => {
    expect(source("src/app/layout.tsx")).toContain("currentLaunch.indexable");
    expect(source("src/app/download/page.tsx")).toContain("currentLaunch.downloads");
  });

  it("documents external support consistently", () => {
    for (const path of ["src/app/privacy/page.tsx", "src/app/terms/page.tsx", "src/app/security/page.tsx"]) {
      expect(source(path)).toMatch(/Stripe/);
    }
    expect(source("src/app/support/page.tsx")).toMatch(/not a software purchase/);
    expect(source("src/app/support/page.tsx")).toMatch(/not a tax-deductible charitable donation|charitable contribution/);
  });

  it("keeps free distribution while separating planned paid services", () => {
    expect(source("README.md")).toMatch(/free and open source/i);
    expect(source("src/app/marketplace/page.tsx")).toMatch(/accounts, publishing, sales, subscriptions.*not active/i);
    expect(source("src/app/download/page.tsx")).toMatch(/Every installer and executable is free/i);
    expect(source("src/app/pricing/page.tsx")).toMatch(/local Spark Plug core stays free and open source/i);
  });

  it("keeps the Vercel-host redirect gated until the custom domain resolves", () => {
    const proxy = source("src/proxy.ts");
    expect(proxy).toContain('NEXT_PUBLIC_CANONICAL_REDIRECT === "true"');
    expect(proxy).toContain("sparkplug-public-launch-site.vercel.app");
    expect(proxy).toContain("https://sparkplug.gameworlds.ai");
  });
});
