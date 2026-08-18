import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const migration = readFileSync(
  resolve(ROOT, "supabase/migrations/202608180002_public_marketplace_forum.sql"),
  "utf8",
);

function source(path: string): string {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("public service architecture", () => {
  it("ships machine-readable API and exact schema contracts", () => {
    const api = JSON.parse(source("contracts/public-api.v1.json"));
    const profile = JSON.parse(source("schemas/setup-profile.v1.schema.json"));
    const entitlement = JSON.parse(source("schemas/entitlement-claims.v1.schema.json"));

    expect(api.openapi).toBe("3.1.0");
    expect(api.paths["/api/v1/catalog/profiles/{slug}/manifest"]).toBeDefined();
    expect(profile.additionalProperties).toBe(false);
    expect(entitlement.additionalProperties).toBe(false);
  });

  it.each([
    "setup_profile_versions",
    "moderation_actions",
    "forum_posts",
    "forum_comments",
    "forum_votes",
    "billing_price_catalog",
    "stripe_webhook_receipts",
  ])("enables and forces RLS on %s", (table) => {
    expect(migration).toContain(`alter table public.${table} enable row level security;`);
    expect(migration).toContain(`alter table public.${table} force row level security;`);
  });

  it("keeps manifest bodies out of public listing grants and catalog queries", () => {
    const grant = migration.match(
      /grant select \([\s\S]*?\) on public\.setup_listings to anon, authenticated;/,
    )?.[0];
    expect(grant).toBeDefined();
    expect(grant).not.toMatch(/\bmanifest\b(?!_sha256)/);
    expect(source("src/app/api/v1/catalog/profiles/route.ts")).not.toMatch(
      /select:[\s\S]{0,500}\bmanifest\b/,
    );
  });

  it("never stores a raw Stripe event and reserves projections for service role", () => {
    expect(migration).not.toMatch(/raw_(payload|body)|event_payload|stripe_payload/i);
    expect(migration).toContain(
      "grant execute on function public.apply_stripe_webhook_projection(text, text, jsonb, integer) to service_role;",
    );
    expect(migration).toContain("if auth.role() <> 'service_role' then");
    expect(source("src/app/api/stripe/webhook/route.ts")).toContain(
      'process.env.PAYMENTS_MODE || "disabled"',
    );
  });

  it("keeps verification, moderation, publication, and immutable versions managed", () => {
    expect(migration).toContain("verification fields are managed by the service");
    expect(migration).toContain("publication is service managed");
    expect(migration).toContain("new forum content must be pending");
    expect(migration).not.toMatch(/grant insert[^;]*setup_profile_versions/i);
  });

  it("fails closed instead of deleting a legacy inline manifest", () => {
    expect(migration).toContain(
      "non-empty inline manifests require an explicit reviewed migration",
    );
    expect(migration).not.toMatch(/update public\.setup_listings\s+set manifest/);
  });

  it("documents gated external activation and owner decisions", () => {
    expect(source("docs/DEPLOYMENT.md")).toContain("Intentionally absent");
    expect(source("docs/OWNER_DECISIONS.md")).toContain("Activation sequence");
    expect(source(".env.example")).toContain("PAYMENTS_MODE=disabled");
  });
});
