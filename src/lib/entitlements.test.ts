import { generateKeyPairSync, randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  ENTITLEMENT_AUDIENCE,
  ENTITLEMENT_VERSION,
  localAccessFromEntitlement,
  shouldRefreshEntitlement,
  signEntitlement,
  verifyEntitlement,
  type EntitlementClaimsV1,
} from "./entitlements";

const ISSUER = "https://accounts.sparkplug.example";
const NOW = 2_000_000_000;
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

function claims(): EntitlementClaimsV1 {
  return {
    ver: ENTITLEMENT_VERSION,
    iss: ISSUER,
    aud: ENTITLEMENT_AUDIENCE,
    sub: randomUUID(),
    plan: "pro",
    creatorClass: "community",
    capabilities: ["premium_themes", "profile_publish_free", "profile_publish_paid"],
    profileLimit: 10,
    iat: NOW,
    exp: NOW + 86_400,
    jti: "entitlement-version-0001",
  };
}

describe("signed entitlement contract", () => {
  it("keeps Community local with no token or refresh call", () => {
    expect(localAccessFromEntitlement(null)).toMatchObject({
      plan: "community",
      signedEntitlementRequired: false,
      hostedProfileLimit: 0,
    });
    expect(shouldRefreshEntitlement(null, NOW)).toBe(false);
  });

  it("signs and locally verifies a bounded Pro snapshot", () => {
    const token = signEntitlement(claims(), privateKey, "launch-2026-01");
    const verified = verifyEntitlement(
      token,
      { "launch-2026-01": publicKey },
      ISSUER,
      NOW + 1,
    );
    expect(verified.plan).toBe("pro");
    expect(verified.profileLimit).toBe(10);
    expect(localAccessFromEntitlement(verified)).toMatchObject({
      hostedProfileLimit: 10,
      capabilities: expect.arrayContaining(["profile_publish_paid"]),
    });
  });

  it("rejects tampering, unknown keys, and expiry", () => {
    const token = signEntitlement(claims(), privateKey, "launch-2026-01");
    const [head, payload, signature] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({ ...claims(), creatorClass: "gameworlds_official" }),
    ).toString("base64url");
    expect(() =>
      verifyEntitlement(`${head}.${tamperedPayload}.${signature}`, { "launch-2026-01": publicKey }, ISSUER, NOW),
    ).toThrow(/signature/);
    expect(() => verifyEntitlement(token, {}, ISSUER, NOW)).toThrow(/unknown/);
    expect(() => verifyEntitlement(token, { "launch-2026-01": publicKey }, ISSUER, NOW + 86_401)).toThrow(/expired/);
    expect(payload).toBeTruthy();
  });

  it("refreshes only near expiry", () => {
    const value = claims();
    expect(shouldRefreshEntitlement(value, NOW, 60)).toBe(false);
    expect(shouldRefreshEntitlement(value, value.exp - 60, 60)).toBe(true);
  });

  it("refuses extension fields before signing", () => {
    expect(() =>
      signEntitlement(
        { ...claims(), unexpected: "do-not-trust" } as EntitlementClaimsV1,
        privateKey,
        "launch-2026-01",
      ),
    ).toThrow(/unsupported fields/);
  });
});
