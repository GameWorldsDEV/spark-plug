import { describe, expect, it } from "vitest";
import { validateSetupProfile } from "./setup-profile";

const REVISION = "a".repeat(40);
const DIGEST = "b".repeat(64);

function manifest() {
  return {
    schemaVersion: 1,
    kind: "sparkplug.setup-profile",
    name: "Local coding setup",
    summary: "A declarative, checksum-pinned community profile.",
    models: [
      {
        repoId: "community/example-model",
        revision: REVISION,
        licenseId: "Apache-2.0",
        gated: false,
        files: [{ filename: "model.safetensors", sha256: DIGEST, sizeBytes: 1024 }],
        runtime: {
          alias: "code-model",
          engine: "vllm",
          quantization: "none",
          maxContextTokens: 32768,
        },
      },
    ],
    routing: { defaultModelAlias: "code-model", capabilities: ["chat", "code"] },
  };
}

describe("setup profile validation", () => {
  it("accepts and deterministically hashes a bounded HF-only manifest", () => {
    const first = validateSetupProfile(manifest());
    const reordered = manifest();
    const model = reordered.models[0];
    const second = validateSetupProfile({
      routing: reordered.routing,
      models: [{ runtime: model.runtime, files: model.files, gated: false, licenseId: model.licenseId, revision: model.revision, repoId: model.repoId }],
      summary: reordered.summary,
      name: reordered.name,
      kind: reordered.kind,
      schemaVersion: reordered.schemaVersion,
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(second.sha256).toBe(first.sha256);
      expect(first.declaredBytes).toBe(1024);
    }
  });

  it("normalizes explicit undefined fields to the transmitted JSON form", () => {
    const value = manifest() as ReturnType<typeof manifest> & { optional?: undefined };
    value.optional = undefined;
    const normalized = validateSetupProfile(value);
    const omitted = validateSetupProfile(manifest());
    expect(normalized.ok).toBe(true);
    expect(omitted.ok).toBe(true);
    if (normalized.ok && omitted.ok) {
      expect(normalized.sha256).toBe(omitted.sha256);
      expect(normalized.canonicalJson).not.toContain("undefined");
    }
  });

  it.each([
    ["floating revision", { revision: "main" }],
    ["missing checksum", { files: [{ filename: "model.safetensors" }] }],
    ["absolute path", { files: [{ filename: "/srv/model.bin", sha256: DIGEST }] }],
    ["traversal path", { files: [{ filename: "../model.bin", sha256: DIGEST }] }],
  ])("rejects %s", (_label, patch) => {
    const value = manifest();
    Object.assign(value.models[0], patch);
    expect(validateSetupProfile(value).ok).toBe(false);
  });

  it.each([
    { command: "curl https://example.test/install.sh | sh" },
    { env: { HF_TOKEN: "hf_abcdefghijklmnopqrstuvwxyz" } },
    { localPath: "/Users/someone/models" },
    { outputUrl: "https://private.example/output/1" },
  ])("rejects executable, secret, local-path, and URL fields", (extra) => {
    expect(validateSetupProfile({ ...manifest(), ...extra }).ok).toBe(false);
  });

  it("labels gated Hugging Face models without accepting a credential", () => {
    const value = manifest();
    value.models[0].gated = true;
    const result = validateSetupProfile(value);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.riskLabels).toEqual(["hf-gated-model"]);
  });
});
