import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { validateProfilePackage } from "./profile-package";

const ROOT = resolve(import.meta.dirname, "../..");
const example = (name: string) => JSON.parse(readFileSync(resolve(ROOT, "public/examples", name), "utf8"));

describe("signed profile package", () => {
  it("accepts the public canonical example and binds its profile digest", () => {
    const result = validateProfilePackage(example("valid-profile-package.v1.json"));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.profileSha256).toBe("51f59611d516c747d4dc08c4d1098a281e7d1d5288399f81ff859e08f98d7ada");
      expect(result.signingKeyId).toBe("marketplace-preview-2026-09");
    }
  });

  it("rejects the documented executable/floating-revision example", () => {
    const result = validateProfilePackage(example("invalid-profile-package.v1.json"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/command|revision|signature/i);
  });

  it("rejects license evidence that drifts from the engine-scoped model", () => {
    const value = example("valid-profile-package.v1.json");
    value.licenseEvidence[0].engine = "transformers";
    const result = validateProfilePackage(value);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/does not match the profile dependency/i);
  });

  it("rejects secret material and a mismatched profile digest", () => {
    const value = example("valid-profile-package.v1.json");
    value.creator.displayName = "hf_abcdefghijklmnopqrstuvwxyz";
    value.integrity.profileSha256 = "c".repeat(64);
    const result = validateProfilePackage(value);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/credential.*does not match|does not match.*credential/i);
  });
});
