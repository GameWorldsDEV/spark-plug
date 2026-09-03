import { createHash } from "node:crypto";

export const SETUP_PROFILE_SCHEMA_VERSION = 1 as const;
export const MAX_SETUP_PROFILE_BYTES = 64 * 1024;
export const MAX_MODELS_PER_PROFILE = 8;
export const MAX_FILES_PER_MODEL = 32;
export const MAX_DECLARED_PROFILE_BYTES = 2 * 1024 ** 4;

const REPO_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;
const IMMUTABLE_REVISION = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const ALIAS = /^[a-z][a-z0-9-]{1,39}$/;
const LICENSE_ID = /^[A-Za-z0-9][A-Za-z0-9.+-]{0,63}$/;
const FORBIDDEN_KEY = /(?:^|_)(?:api[_-]?key|authorization|bearer|command|credential|env|executable|hook|host[_-]?path|local[_-]?path|password|private[_-]?key|prompt|script|secret|session|shell|token)(?:$|_)/i;
const SECRET_VALUE = /(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:hf|sk)_[A-Za-z0-9_-]{16,}\b|\bBearer\s+[A-Za-z0-9._~-]{12,})/i;
const LOCAL_PATH = /^(?:\.{0,2}\/|\/|~\/|[A-Za-z]:[\\/]|file:\/\/)/;

const TOP_LEVEL_KEYS = new Set([
  "schemaVersion",
  "kind",
  "name",
  "summary",
  "models",
  "routing",
]);
const MODEL_KEYS = new Set([
  "repoId",
  "revision",
  "licenseId",
  "gated",
  "files",
  "runtime",
]);
const FILE_KEYS = new Set(["filename", "sha256", "sizeBytes"]);
const RUNTIME_KEYS = new Set([
  "alias",
  "engine",
  "quantization",
  "maxContextTokens",
  "settings",
]);
const ROUTING_KEYS = new Set(["defaultModelAlias", "capabilities"]);

export type SetupEngine = "vllm" | "colibri" | "mlx" | "ollama" | "llama.cpp" | "transformers" | "comfyui";
export type SetupCapability = "chat" | "code" | "tools" | "thinking" | "vision" | "streaming" | "embeddings" | "image" | "video" | "3d";

export type SetupProfileV1 = {
  schemaVersion: typeof SETUP_PROFILE_SCHEMA_VERSION;
  kind: "sparkplug.setup-profile";
  name: string;
  summary: string;
  models: Array<{
    repoId: string;
    revision: string;
    licenseId: string;
    gated: boolean;
    files: Array<{
      filename: string;
      sha256: string;
      sizeBytes?: number;
    }>;
    runtime: {
      alias: string;
      engine: SetupEngine;
      quantization?: "none" | "awq" | "gptq" | "gguf" | "bitsandbytes";
      maxContextTokens?: number;
      settings?:
        | { prefillStepTokens: number }
        | { batchTokens: number; gpuLayers: number; threadCount: number; keepAliveSeconds: number; flashAttention: boolean };
    };
  }>;
  routing?: {
    defaultModelAlias: string;
    capabilities: SetupCapability[];
  };
};

export type SetupProfileValidation =
  | {
      ok: true;
      manifest: SetupProfileV1;
      canonicalJson: string;
      sha256: string;
      riskLabels: string[];
      declaredBytes: number | null;
    }
  | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  path: string,
  errors: string[],
) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) errors.push(`${path}.${key} is not allowed`);
  }
}

function boundedString(
  value: unknown,
  path: string,
  min: number,
  max: number,
  errors: string[],
): value is string {
  if (typeof value !== "string" || value.length < min || value.length > max) {
    errors.push(`${path} must be a string between ${min} and ${max} characters`);
    return false;
  }
  return true;
}

function inspectForbidden(value: unknown, path: string, errors: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectForbidden(item, `${path}[${index}]`, errors));
    return;
  }
  if (!isRecord(value)) {
    if (typeof value === "string") {
      if (SECRET_VALUE.test(value)) errors.push(`${path} resembles a credential`);
      if (LOCAL_PATH.test(value)) errors.push(`${path} contains a local or absolute path`);
      if (/^https?:\/\//i.test(value)) errors.push(`${path} contains a URL; use repoId + immutable revision`);
      if (value.includes("\u0000")) errors.push(`${path} contains a NUL byte`);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEY.test(key)) errors.push(`${path}.${key} is a prohibited executable or secret-bearing field`);
    inspectForbidden(child, `${path}.${key}`, errors);
  }
}

function validFilename(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 1 &&
    value.length <= 240 &&
    !value.startsWith("/") &&
    !value.includes("\\") &&
    !value.split("/").some((part) => part === "" || part === "." || part === "..") &&
    !/[\u0000-\u001f]/.test(value)
  );
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(",")}}`;
}

export function validateSetupProfile(input: unknown): SetupProfileValidation {
  const errors: string[] = [];
  let encodedBytes = Number.POSITIVE_INFINITY;
  try {
    const encoded = JSON.stringify(input);
    if (typeof encoded !== "string") throw new Error("not JSON data");
    encodedBytes = Buffer.byteLength(encoded, "utf8");
    // Validate and hash the exact JSON form that crosses the API boundary.
    // This removes prototypes/toJSON wrappers and prevents explicit undefined
    // values from producing a non-JSON canonical representation.
    input = JSON.parse(encoded) as unknown;
  } catch {
    return { ok: false, errors: ["manifest must be JSON-serializable"] };
  }
  if (encodedBytes > MAX_SETUP_PROFILE_BYTES) {
    errors.push(`manifest exceeds ${MAX_SETUP_PROFILE_BYTES} bytes`);
  }
  inspectForbidden(input, "$", errors);

  if (!isRecord(input)) return { ok: false, errors: [...errors, "manifest must be an object"] };
  exactKeys(input, TOP_LEVEL_KEYS, "$", errors);
  if (input.schemaVersion !== SETUP_PROFILE_SCHEMA_VERSION) errors.push("$.schemaVersion must be 1");
  if (input.kind !== "sparkplug.setup-profile") errors.push("$.kind must be sparkplug.setup-profile");
  boundedString(input.name, "$.name", 1, 80, errors);
  boundedString(input.summary, "$.summary", 1, 500, errors);

  const models = input.models;
  if (!Array.isArray(models) || models.length < 1 || models.length > MAX_MODELS_PER_PROFILE) {
    errors.push(`$.models must contain 1 to ${MAX_MODELS_PER_PROFILE} models`);
  }

  const aliases = new Set<string>();
  let declaredBytes = 0;
  let allSizesDeclared = true;
  const riskLabels = new Set<string>();

  if (Array.isArray(models)) {
    models.forEach((rawModel, modelIndex) => {
      const modelPath = `$.models[${modelIndex}]`;
      if (!isRecord(rawModel)) {
        errors.push(`${modelPath} must be an object`);
        return;
      }
      exactKeys(rawModel, MODEL_KEYS, modelPath, errors);
      if (typeof rawModel.repoId !== "string" || !REPO_ID.test(rawModel.repoId)) {
        errors.push(`${modelPath}.repoId must be a Hugging Face owner/repository id`);
      }
      if (typeof rawModel.revision !== "string" || !IMMUTABLE_REVISION.test(rawModel.revision)) {
        errors.push(`${modelPath}.revision must be a 40-character immutable Git commit`);
      }
      if (typeof rawModel.licenseId !== "string" || !LICENSE_ID.test(rawModel.licenseId)) {
        errors.push(`${modelPath}.licenseId must be an SPDX-style license identifier`);
      }
      if (typeof rawModel.gated !== "boolean") errors.push(`${modelPath}.gated must be boolean`);
      if (rawModel.gated === true) riskLabels.add("hf-gated-model");

      const files = rawModel.files;
      if (!Array.isArray(files) || files.length < 1 || files.length > MAX_FILES_PER_MODEL) {
        errors.push(`${modelPath}.files must contain 1 to ${MAX_FILES_PER_MODEL} files`);
      }
      const filenames = new Set<string>();
      if (Array.isArray(files)) {
        files.forEach((rawFile, fileIndex) => {
          const filePath = `${modelPath}.files[${fileIndex}]`;
          if (!isRecord(rawFile)) {
            errors.push(`${filePath} must be an object`);
            return;
          }
          exactKeys(rawFile, FILE_KEYS, filePath, errors);
          if (!validFilename(rawFile.filename)) errors.push(`${filePath}.filename must be a safe relative Hugging Face filename`);
          else if (filenames.has(rawFile.filename)) errors.push(`${filePath}.filename is duplicated`);
          else filenames.add(rawFile.filename);
          if (typeof rawFile.sha256 !== "string" || !SHA256.test(rawFile.sha256)) {
            errors.push(`${filePath}.sha256 must be a lowercase SHA-256 digest`);
          }
          if (rawFile.sizeBytes === undefined) {
            allSizesDeclared = false;
          } else if (
            typeof rawFile.sizeBytes !== "number" ||
            !Number.isSafeInteger(rawFile.sizeBytes) ||
            rawFile.sizeBytes < 1
          ) {
            errors.push(`${filePath}.sizeBytes must be a positive safe integer`);
          } else {
            declaredBytes += rawFile.sizeBytes;
          }
        });
      }

      const runtime = rawModel.runtime;
      if (!isRecord(runtime)) {
        errors.push(`${modelPath}.runtime must be an object`);
      } else {
        exactKeys(runtime, RUNTIME_KEYS, `${modelPath}.runtime`, errors);
        if (typeof runtime.alias !== "string" || !ALIAS.test(runtime.alias)) {
          errors.push(`${modelPath}.runtime.alias must match ${ALIAS}`);
        } else if (aliases.has(runtime.alias)) {
          errors.push(`${modelPath}.runtime.alias is duplicated`);
        } else {
          aliases.add(runtime.alias);
        }
        if (!["vllm", "colibri", "mlx", "ollama", "llama.cpp", "transformers", "comfyui"].includes(String(runtime.engine))) {
          errors.push(`${modelPath}.runtime.engine is unsupported`);
        }
        if (
          runtime.quantization !== undefined &&
          !["none", "awq", "gptq", "gguf", "bitsandbytes"].includes(String(runtime.quantization))
        ) {
          errors.push(`${modelPath}.runtime.quantization is unsupported`);
        }
        if (
          runtime.maxContextTokens !== undefined &&
          (typeof runtime.maxContextTokens !== "number" ||
            !Number.isInteger(runtime.maxContextTokens) ||
            runtime.maxContextTokens < 1024 ||
            runtime.maxContextTokens > 1_048_576)
        ) {
          errors.push(`${modelPath}.runtime.maxContextTokens must be an integer from 1024 to 1048576`);
        }
        const settings = runtime.settings;
        if (runtime.engine === "mlx") {
          if (!isRecord(settings)) errors.push(`${modelPath}.runtime.settings must contain closed MLX settings`);
          else {
            exactKeys(settings, new Set(["prefillStepTokens"]), `${modelPath}.runtime.settings`, errors);
            if (typeof settings.prefillStepTokens !== "number" || !Number.isInteger(settings.prefillStepTokens) || settings.prefillStepTokens < 128 || settings.prefillStepTokens > 8192 || settings.prefillStepTokens % 128 !== 0) errors.push(`${modelPath}.runtime.settings.prefillStepTokens is invalid`);
          }
        } else if (runtime.engine === "ollama") {
          if (!isRecord(settings)) errors.push(`${modelPath}.runtime.settings must contain closed Ollama settings`);
          else {
            exactKeys(settings, new Set(["batchTokens", "gpuLayers", "threadCount", "keepAliveSeconds", "flashAttention"]), `${modelPath}.runtime.settings`, errors);
            const integer = (key: string, min: number, max: number) => typeof settings[key] === "number" && Number.isInteger(settings[key]) && Number(settings[key]) >= min && Number(settings[key]) <= max;
            if (!integer("batchTokens", 1, 4096)) errors.push(`${modelPath}.runtime.settings.batchTokens is invalid`);
            if (!integer("gpuLayers", 0, 999)) errors.push(`${modelPath}.runtime.settings.gpuLayers is invalid`);
            if (!integer("threadCount", 1, 1024)) errors.push(`${modelPath}.runtime.settings.threadCount is invalid`);
            if (!integer("keepAliveSeconds", 0, 86400)) errors.push(`${modelPath}.runtime.settings.keepAliveSeconds is invalid`);
            if (typeof settings.flashAttention !== "boolean") errors.push(`${modelPath}.runtime.settings.flashAttention must be boolean`);
          }
        } else if (settings !== undefined) {
          errors.push(`${modelPath}.runtime.settings is only available for MLX or Ollama`);
        }
      }
    });
  }

  if (declaredBytes > MAX_DECLARED_PROFILE_BYTES) {
    errors.push(`declared files exceed ${MAX_DECLARED_PROFILE_BYTES} bytes`);
  }

  if (input.routing !== undefined) {
    if (!isRecord(input.routing)) {
      errors.push("$.routing must be an object");
    } else {
      exactKeys(input.routing, ROUTING_KEYS, "$.routing", errors);
      if (
        typeof input.routing.defaultModelAlias !== "string" ||
        !aliases.has(input.routing.defaultModelAlias)
      ) {
        errors.push("$.routing.defaultModelAlias must name a declared model alias");
      }
      const capabilities = input.routing.capabilities;
      const allowedCapabilities = new Set(["chat", "code", "tools", "thinking", "vision", "streaming", "embeddings", "image", "video", "3d"]);
      if (
        !Array.isArray(capabilities) ||
        capabilities.length < 1 ||
        capabilities.length > allowedCapabilities.size ||
        capabilities.some((item) => typeof item !== "string" || !allowedCapabilities.has(item)) ||
        new Set(capabilities).size !== capabilities.length
      ) {
        errors.push("$.routing.capabilities must contain unique supported capabilities");
      }
    }
  }

  if (errors.length) return { ok: false, errors: [...new Set(errors)] };
  const manifest = input as SetupProfileV1;
  const canonicalJson = canonicalize(manifest);
  const sha256 = createHash("sha256").update(canonicalJson).digest("hex");
  return {
    ok: true,
    manifest,
    canonicalJson,
    sha256,
    riskLabels: [...riskLabels].sort(),
    declaredBytes: allSizesDeclared ? declaredBytes : null,
  };
}
