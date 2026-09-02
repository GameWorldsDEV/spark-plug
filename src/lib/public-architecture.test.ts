import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const source = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("public service architecture", () => {
  it("ships open import schemas and local creator boilerplates", () => {
    for (const path of [
      "schemas/setup-profile.v1.schema.json",
      "schemas/theme-package.v1.schema.json",
      "schemas/motion-pack.v1.schema.json",
      "schemas/marketplace-listing.v1.schema.json",
      "public/templates/profile-boilerplate.sparkplug-profile",
      "public/templates/theme-boilerplate.sparkplug-theme",
      "public/templates/motion-boilerplate.sparkplug-motion",
    ]) expect(() => JSON.parse(source(path))).not.toThrow();
  });

  it("keeps hosted marketplace implementation out of the public repository", () => {
    for (const path of [
      "src/app/api/stripe/webhook/route.ts",
      "src/app/api/v1/billing/checkout/route.ts",
      "src/app/api/v1/marketplace/checkout/route.ts",
      "src/app/api/v1/marketplace/seller-onboarding/route.ts",
      "src/lib/supabase-rest.ts",
      "supabase/migrations/202609020001_creator_commerce.sql",
    ]) expect(existsSync(resolve(ROOT, path))).toBe(false);
    expect(source(".env.example")).not.toMatch(/STRIPE_SECRET|SUPABASE_SERVICE|PRIVATE_KEY/);
    expect(source(".env.example")).toContain("NEXT_PUBLIC_MARKETPLACE_ORIGIN");
  });

  it("keeps the app catalog static, monthly, and checksummed", () => {
    const pointer = JSON.parse(source("public/catalog/app/current.json"));
    const snapshotBytes = readFileSync(resolve(ROOT, `public/catalog/app/${pointer.currentVersion}.json`));
    const snapshot = JSON.parse(snapshotBytes.toString("utf8"));
    expect(pointer.refreshPolicy).toBe("not-before-valid-until");
    expect(pointer.sha256).toBe(createHash("sha256").update(snapshotBytes).digest("hex"));
    expect(pointer.itemCount).toBe(snapshot.profiles.length);
    expect(pointer.validUntil).toBe(snapshot.validUntil);
    expect(source("docs/MARKETPLACE-DISTRIBUTION.md")).toContain("zero database queries");
  });

  it("documents the public/private marketplace boundary", () => {
    expect(source("docs/CREATOR-KIT.md")).toMatch(/private marketplace service/i);
    expect(source("docs/CREATOR-KIT.md")).toMatch(/Profiles reference model files; they do not include or resell them/i);
    expect(source("src/app/marketplace/create/page.tsx")).toMatch(/entirely in your browser/i);
    expect(source("src/app/marketplace/models/page.tsx")).toMatch(/GameWorlds does not resell model weights/i);
  });
});
