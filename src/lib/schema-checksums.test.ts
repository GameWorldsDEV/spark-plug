import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

describe("canonical schema checksums", () => {
  it("publishes a complete checksum manifest for downstream parity gates", () => {
    const manifest = JSON.parse(readFileSync(resolve(ROOT, "contracts/schema-checksums.v1.json"), "utf8")) as {
      schemas: Record<string, string>;
    };
    for (const [filename, expected] of Object.entries(manifest.schemas)) {
      const bytes = readFileSync(resolve(ROOT, "schemas", filename));
      expect(createHash("sha256").update(bytes).digest("hex"), filename).toBe(expected);
    }
    expect(Object.keys(manifest.schemas)).toHaveLength(9);
  });
});
