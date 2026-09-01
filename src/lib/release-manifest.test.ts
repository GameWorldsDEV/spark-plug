import { describe, expect, it } from "vitest";

import { currentRelease, releaseForStage, validateReleaseManifest } from "./release-manifest";

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

  it("requires every release proof before enabling an artifact", () => {
    const manifest = structuredClone(currentRelease);
    manifest.releaseStatus = "published";
    manifest.version = "1.0.0";
    manifest.publishedAt = "2026-09-01T00:00:00.000Z";
    Object.assign(manifest.platforms.linux, {
      status: "available",
      url: "https://github.com/GameWorldsDEV/spark-plug/releases/download/v1.0.0/sparkplug.run",
      sha256: "a".repeat(64),
      signatureUrl: "https://github.com/GameWorldsDEV/spark-plug/releases/download/v1.0.0/sparkplug.run.sig",
      releaseNotesUrl: "https://github.com/GameWorldsDEV/spark-plug/releases/tag/v1.0.0",
      compatibilityEvidenceUrl: "https://github.com/GameWorldsDEV/spark-plug/releases/download/v1.0.0/evidence.json",
    });
    expect(validateReleaseManifest(manifest)).toBe(true);
    const preview = releaseForStage(manifest, false);
    expect(preview.releaseStatus).toBe("preparing");
    expect(preview.platforms.linux.url).toBeNull();
    expect(preview.platforms.linux.status).toBe("coming-soon");
  });
});
