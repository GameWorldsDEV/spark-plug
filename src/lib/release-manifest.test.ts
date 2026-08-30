import { describe, expect, it } from "vitest";

import { currentRelease, validateReleaseManifest } from "./release-manifest";

describe("public release manifest", () => {
  it("keeps unavailable artifacts non-clickable", () => {
    expect(validateReleaseManifest(currentRelease)).toBe(true);
    expect(Object.values(currentRelease.platforms).every((item) => item.url === null)).toBe(true);
  });

  it("rejects an available artifact without a checksum", () => {
    const manifest = structuredClone(currentRelease);
    manifest.platforms.linux.status = "available";
    manifest.platforms.linux.url = "https://github.com/GameWorldsDEV/spark-plug/releases/test";
    expect(validateReleaseManifest(manifest)).toBe(false);
  });
});
