import { validateSetupProfile, type SetupEngine, type SetupProfileV1 } from "./setup-profile";

export const PROFILE_PACKAGE_SCHEMA_VERSION = 1 as const;
export const MAX_PROFILE_PACKAGE_BYTES = 96 * 1024;

const SHA256 = /^[a-f0-9]{64}$/;
const REVISION = /^[a-f0-9]{40}$/;
const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+){1,9}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[0-9A-Za-z.-]+)?$/;
const SIGNATURE = /^[A-Za-z0-9_-]{86}$/;
const SECRET = /(?:-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:hf|sk)_[A-Za-z0-9_-]{16,}\b|\bBearer\s+[A-Za-z0-9._~-]{12,})/i;
const ENGINES = new Set(["vllm", "colibri", "mlx", "ollama", "llama.cpp", "transformers", "comfyui"]);
const DECISIONS = new Set(["allowed", "noncommercial", "review-required", "blocked"]);

const ROOT = new Set(["schemaVersion", "kind", "packageId", "version", "createdAt", "creator", "origin", "profile", "licenseEvidence", "integrity", "signature"]);
const CREATOR = new Set(["id", "displayName", "profileUrl"]);
const ORIGIN = new Set(["source", "marketplaceOrigin", "listingSlug", "listingVersionId"]);
const EVIDENCE = new Set(["modelAlias", "engine", "repoId", "revision", "licenseId", "licenseUrl", "gated", "requiresAcceptance", "commercialUse", "reviewedAt", "decisionId"]);
const INTEGRITY = new Set(["canonicalization", "hashAlgorithm", "profileSha256"]);
const SIGNATURE_KEYS = new Set(["algorithm", "keyId", "value", "signedAt"]);

type ObjectValue = Record<string, unknown>;

export type ProfilePackageV1 = {
  schemaVersion: 1;
  kind: "sparkplug.profile-package";
  packageId: string;
  version: string;
  createdAt: string;
  creator: { id: string; displayName: string; profileUrl?: string };
  origin: { source: "sparkplug-marketplace"; marketplaceOrigin: string; listingSlug: string; listingVersionId: string };
  profile: SetupProfileV1;
  licenseEvidence: Array<{
    modelAlias: string; engine: SetupEngine; repoId: string; revision: string;
    licenseId: string; licenseUrl: string; gated: boolean; requiresAcceptance: boolean;
    commercialUse: "allowed" | "noncommercial" | "review-required" | "blocked";
    reviewedAt: string; decisionId: string;
  }>;
  integrity: { canonicalization: "sparkplug-json-v1"; hashAlgorithm: "sha256"; profileSha256: string };
  signature: { algorithm: "Ed25519"; keyId: string; value: string; signedAt: string };
};

export type ProfilePackageValidation =
  | { ok: true; package: ProfilePackageV1; profileSha256: string; signingKeyId: string }
  | { ok: false; errors: string[] };

function isObject(value: unknown): value is ObjectValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function keys(value: ObjectValue, allowed: ReadonlySet<string>, path: string, errors: string[]) {
  Object.keys(value).forEach((key) => { if (!allowed.has(key)) errors.push(`${path}.${key} is not allowed`); });
}

function iso(value: unknown) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && /(?:Z|[+-][0-9]{2}:[0-9]{2})$/.test(value);
}

function https(value: unknown, exactOrigin = false) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && (!exactOrigin || (url.pathname === "/" && !url.search && !url.hash));
  } catch { return false; }
}

function secrets(value: unknown, path: string, errors: string[]) {
  if (Array.isArray(value)) return value.forEach((item, index) => secrets(item, `${path}[${index}]`, errors));
  if (isObject(value)) return Object.entries(value).forEach(([key, item]) => secrets(item, `${path}.${key}`, errors));
  if (typeof value === "string" && SECRET.test(value)) errors.push(`${path} resembles a credential`);
}

export function validateProfilePackage(input: unknown): ProfilePackageValidation {
  const errors: string[] = [];
  try {
    const encoded = JSON.stringify(input);
    if (!encoded) throw new Error();
    if (Buffer.byteLength(encoded, "utf8") > MAX_PROFILE_PACKAGE_BYTES) errors.push(`package exceeds ${MAX_PROFILE_PACKAGE_BYTES} bytes`);
    input = JSON.parse(encoded) as unknown;
  } catch { return { ok: false, errors: ["package must be JSON-serializable"] }; }
  secrets(input, "$", errors);
  if (!isObject(input)) return { ok: false, errors: [...errors, "package must be an object"] };
  keys(input, ROOT, "$", errors);
  if (input.schemaVersion !== 1) errors.push("$.schemaVersion must be 1");
  if (input.kind !== "sparkplug.profile-package") errors.push("$.kind must be sparkplug.profile-package");
  if (typeof input.packageId !== "string" || !ID.test(input.packageId)) errors.push("$.packageId is invalid");
  if (typeof input.version !== "string" || !VERSION.test(input.version)) errors.push("$.version is invalid");
  if (!iso(input.createdAt)) errors.push("$.createdAt must be an ISO date-time");

  if (!isObject(input.creator)) errors.push("$.creator must be an object");
  else {
    keys(input.creator, CREATOR, "$.creator", errors);
    if (typeof input.creator.id !== "string" || !SLUG.test(input.creator.id) || input.creator.id.length > 80) errors.push("$.creator.id is invalid");
    if (typeof input.creator.displayName !== "string" || input.creator.displayName.length < 1 || input.creator.displayName.length > 120) errors.push("$.creator.displayName is invalid");
    if (input.creator.profileUrl !== undefined && !https(input.creator.profileUrl)) errors.push("$.creator.profileUrl must be HTTPS");
  }
  if (!isObject(input.origin)) errors.push("$.origin must be an object");
  else {
    keys(input.origin, ORIGIN, "$.origin", errors);
    if (input.origin.source !== "sparkplug-marketplace") errors.push("$.origin.source is invalid");
    if (!https(input.origin.marketplaceOrigin, true)) errors.push("$.origin.marketplaceOrigin must be an exact HTTPS origin");
    for (const field of ["listingSlug", "listingVersionId"] as const) {
      if (typeof input.origin[field] !== "string" || !SLUG.test(input.origin[field]) || input.origin[field].length > 120) errors.push(`$.origin.${field} is invalid`);
    }
  }

  const profile = validateSetupProfile(input.profile);
  if (!profile.ok) errors.push(...profile.errors.map((error) => `$.profile ${error}`));
  const evidenceByAlias = new Map<string, ObjectValue>();
  if (!Array.isArray(input.licenseEvidence) || input.licenseEvidence.length < 1 || input.licenseEvidence.length > 8) errors.push("$.licenseEvidence must contain 1 to 8 entries");
  else input.licenseEvidence.forEach((item, index) => {
    const path = `$.licenseEvidence[${index}]`;
    if (!isObject(item)) { errors.push(`${path} must be an object`); return; }
    keys(item, EVIDENCE, path, errors);
    if (typeof item.modelAlias !== "string" || !/^[a-z][a-z0-9-]{1,39}$/.test(item.modelAlias)) errors.push(`${path}.modelAlias is invalid`);
    else if (evidenceByAlias.has(item.modelAlias)) errors.push(`${path}.modelAlias is duplicated`);
    else evidenceByAlias.set(item.modelAlias, item);
    if (!ENGINES.has(String(item.engine))) errors.push(`${path}.engine is invalid`);
    if (typeof item.repoId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}\/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(item.repoId)) errors.push(`${path}.repoId is invalid`);
    if (typeof item.revision !== "string" || !REVISION.test(item.revision)) errors.push(`${path}.revision is invalid`);
    if (typeof item.licenseId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9.+-]{0,63}$/.test(item.licenseId)) errors.push(`${path}.licenseId is invalid`);
    if (!https(item.licenseUrl) || !String(item.licenseUrl).startsWith("https://huggingface.co/")) errors.push(`${path}.licenseUrl must be on huggingface.co`);
    if (typeof item.gated !== "boolean" || typeof item.requiresAcceptance !== "boolean") errors.push(`${path} gating values must be boolean`);
    if (!DECISIONS.has(String(item.commercialUse))) errors.push(`${path}.commercialUse is invalid`);
    if (!iso(item.reviewedAt)) errors.push(`${path}.reviewedAt is invalid`);
    if (typeof item.decisionId !== "string" || !SLUG.test(item.decisionId)) errors.push(`${path}.decisionId is invalid`);
  });
  if (profile.ok) {
    for (const model of profile.manifest.models) {
      const evidence = evidenceByAlias.get(model.runtime.alias);
      if (!evidence) errors.push(`$.licenseEvidence is missing ${model.runtime.alias}`);
      else if (evidence.engine !== model.runtime.engine || evidence.repoId !== model.repoId || evidence.revision !== model.revision || evidence.licenseId !== model.licenseId || evidence.gated !== model.gated) errors.push(`$.licenseEvidence for ${model.runtime.alias} does not match the profile dependency`);
    }
    if (evidenceByAlias.size !== profile.manifest.models.length) errors.push("$.licenseEvidence must map exactly one entry to each profile model");
  }

  if (!isObject(input.integrity)) errors.push("$.integrity must be an object");
  else {
    keys(input.integrity, INTEGRITY, "$.integrity", errors);
    if (input.integrity.canonicalization !== "sparkplug-json-v1" || input.integrity.hashAlgorithm !== "sha256") errors.push("$.integrity algorithm is invalid");
    if (typeof input.integrity.profileSha256 !== "string" || !SHA256.test(input.integrity.profileSha256)) errors.push("$.integrity.profileSha256 is invalid");
    else if (profile.ok && input.integrity.profileSha256 !== profile.sha256) errors.push("$.integrity.profileSha256 does not match the canonical profile");
  }
  if (!isObject(input.signature)) errors.push("$.signature must be an object");
  else {
    keys(input.signature, SIGNATURE_KEYS, "$.signature", errors);
    if (input.signature.algorithm !== "Ed25519") errors.push("$.signature.algorithm must be Ed25519");
    if (typeof input.signature.keyId !== "string" || !/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(input.signature.keyId)) errors.push("$.signature.keyId is invalid");
    if (typeof input.signature.value !== "string" || !SIGNATURE.test(input.signature.value)) errors.push("$.signature.value is invalid");
    if (!iso(input.signature.signedAt)) errors.push("$.signature.signedAt is invalid");
  }
  if (errors.length) return { ok: false, errors: [...new Set(errors)] };
  const packageValue = input as ProfilePackageV1;
  return { ok: true, package: packageValue, profileSha256: packageValue.integrity.profileSha256, signingKeyId: packageValue.signature.keyId };
}
