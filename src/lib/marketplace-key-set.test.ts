import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { keyMayVerify, MARKETPLACE_KEY_SET_URL, validateMarketplaceKeySet } from "./marketplace-key-set";

const ROOT = resolve(import.meta.dirname, "../..");
const fixture = () => JSON.parse(readFileSync(resolve(ROOT, "public/examples/marketplace-key-set.v1.json"), "utf8"));
const NOW = Date.parse("2026-09-04T00:00:00Z");

describe("marketplace public key set", () => {
  it("accepts the pinned, bounded public-only key set", () => {
    const result = validateMarketplaceKeySet(fixture(), NOW);
    expect(result.ok).toBe(true);
    expect(MARKETPLACE_KEY_SET_URL).toBe("https://marketplace.sparkplug.gameworlds.ai/.well-known/sparkplug-marketplace-keys");
    if (result.ok) expect(result.cacheSeconds).toBe(3600);
  });

  it.each([
    ["wrong issuer", (value: Record<string, unknown>) => { value.issuer = "https://example.test"; }],
    ["private JWK", (value: Record<string, unknown>) => { (value.keys as Record<string, unknown>[])[0].d = "secret"; }],
    ["wrong curve", (value: Record<string, unknown>) => { (value.keys as Record<string, unknown>[])[0].crv = "X25519"; }],
    ["too long", (value: Record<string, unknown>) => { value.expiresAt = "2027-09-03T12:00:00Z"; }],
    ["duplicate kid", (value: Record<string, unknown>) => { const keys = value.keys as Record<string, unknown>[]; keys[1].kid = keys[0].kid; }],
  ])("rejects %s", (_label, mutate) => {
    const value = fixture();
    mutate(value);
    expect(validateMarketplaceKeySet(value, NOW).ok).toBe(false);
  });

  it("enforces active, retiring, and revoked verification semantics", () => {
    const [active, retiring] = fixture().keys;
    expect(keyMayVerify(active, "2026-09-10T00:00:00Z", "2026-09-03T12:00:00Z")).toBe(true);
    expect(keyMayVerify(retiring, "2026-08-20T00:00:00Z", "2026-09-03T12:00:00Z")).toBe(true);
    expect(keyMayVerify(retiring, "2026-09-04T00:00:00Z", "2026-09-03T12:00:00Z")).toBe(false);
    expect(keyMayVerify({ ...active, status: "revoked" }, "2026-09-10T00:00:00Z", "2026-09-03T12:00:00Z")).toBe(false);
  });
});
