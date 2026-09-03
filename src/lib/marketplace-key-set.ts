export const MARKETPLACE_ISSUER = "https://marketplace.sparkplug.gameworlds.ai" as const;
export const MARKETPLACE_KEY_SET_PATH = "/.well-known/sparkplug-marketplace-keys" as const;
export const MARKETPLACE_KEY_SET_URL = `${MARKETPLACE_ISSUER}${MARKETPLACE_KEY_SET_PATH}` as const;
export const MAX_MARKETPLACE_KEY_SET_BYTES = 32 * 1024;
export const MAX_MARKETPLACE_KEY_SET_VALIDITY_SECONDS = 35 * 24 * 60 * 60;
export const MAX_MARKETPLACE_KEY_SET_CACHE_SECONDS = 60 * 60;

const ROOT_KEYS = new Set(["schemaVersion", "kind", "issuer", "generatedAt", "expiresAt", "canonicalization", "keys"]);
const JWK_KEYS = new Set(["kid", "kty", "crv", "x", "alg", "use", "status", "notBefore", "notAfter"]);
const KID = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const PUBLIC_X = /^[A-Za-z0-9_-]{43}$/;
const STATUSES = new Set(["active", "retiring", "revoked"]);

type ObjectValue = Record<string, unknown>;

export type MarketplacePublicKey = {
  kid: string;
  kty: "OKP";
  crv: "Ed25519";
  x: string;
  alg: "EdDSA";
  use: "sig";
  status: "active" | "retiring" | "revoked";
  notBefore: string;
  notAfter: string;
};

export type MarketplaceKeySetV1 = {
  schemaVersion: 1;
  kind: "sparkplug.marketplace-key-set";
  issuer: typeof MARKETPLACE_ISSUER;
  generatedAt: string;
  expiresAt: string;
  canonicalization: "sparkplug-json-v1";
  keys: MarketplacePublicKey[];
};

export type MarketplaceKeySetValidation =
  | { ok: true; keySet: MarketplaceKeySetV1; cacheSeconds: number }
  | { ok: false; errors: string[] };

function object(value: unknown): value is ObjectValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value: ObjectValue, allowed: ReadonlySet<string>, path: string, errors: string[]) {
  Object.keys(value).forEach((key) => { if (!allowed.has(key)) errors.push(`${path}.${key} is not allowed`); });
}

function timestamp(value: unknown): number | null {
  if (typeof value !== "string" || !/(?:Z|[+-][0-9]{2}:[0-9]{2})$/.test(value)) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function validateMarketplaceKeySet(input: unknown, nowMs = Date.now()): MarketplaceKeySetValidation {
  const errors: string[] = [];
  try {
    const encoded = JSON.stringify(input);
    if (!encoded) throw new Error();
    if (Buffer.byteLength(encoded, "utf8") > MAX_MARKETPLACE_KEY_SET_BYTES) errors.push(`key set exceeds ${MAX_MARKETPLACE_KEY_SET_BYTES} bytes`);
    input = JSON.parse(encoded) as unknown;
  } catch { return { ok: false, errors: ["key set must be JSON-serializable"] }; }
  if (!object(input)) return { ok: false, errors: [...errors, "key set must be an object"] };
  exactKeys(input, ROOT_KEYS, "$", errors);
  if (input.schemaVersion !== 1) errors.push("$.schemaVersion must be 1");
  if (input.kind !== "sparkplug.marketplace-key-set") errors.push("$.kind is invalid");
  if (input.issuer !== MARKETPLACE_ISSUER) errors.push("$.issuer is not the pinned marketplace issuer");
  if (input.canonicalization !== "sparkplug-json-v1") errors.push("$.canonicalization is invalid");
  const generatedAt = timestamp(input.generatedAt);
  const expiresAt = timestamp(input.expiresAt);
  if (generatedAt === null) errors.push("$.generatedAt is invalid");
  if (expiresAt === null) errors.push("$.expiresAt is invalid");
  if (generatedAt !== null && expiresAt !== null) {
    const validity = (expiresAt - generatedAt) / 1000;
    if (validity <= 0 || validity > MAX_MARKETPLACE_KEY_SET_VALIDITY_SECONDS) errors.push("key set validity must be greater than zero and no more than 35 days");
    if (expiresAt <= nowMs) errors.push("key set is expired");
    if (generatedAt > nowMs + 5 * 60 * 1000) errors.push("key set generatedAt is too far in the future");
  }

  const kids = new Set<string>();
  const publicValues = new Set<string>();
  if (!Array.isArray(input.keys) || input.keys.length < 1 || input.keys.length > 8) errors.push("$.keys must contain 1 to 8 public keys");
  else input.keys.forEach((candidate, index) => {
    const path = `$.keys[${index}]`;
    if (!object(candidate)) { errors.push(`${path} must be an object`); return; }
    exactKeys(candidate, JWK_KEYS, path, errors);
    if (typeof candidate.kid !== "string" || !KID.test(candidate.kid) || candidate.kid.length > 120) errors.push(`${path}.kid is invalid`);
    else if (kids.has(candidate.kid)) errors.push(`${path}.kid is duplicated`);
    else kids.add(candidate.kid);
    if (candidate.kty !== "OKP" || candidate.crv !== "Ed25519" || candidate.alg !== "EdDSA" || candidate.use !== "sig") errors.push(`${path} must be an Ed25519 signing JWK`);
    if (typeof candidate.x !== "string" || !PUBLIC_X.test(candidate.x)) errors.push(`${path}.x must be an unpadded base64url 32-byte public key`);
    else if (publicValues.has(candidate.x)) errors.push(`${path}.x is duplicated under another kid`);
    else publicValues.add(candidate.x);
    if (!STATUSES.has(String(candidate.status))) errors.push(`${path}.status is invalid`);
    const notBefore = timestamp(candidate.notBefore);
    const notAfter = timestamp(candidate.notAfter);
    if (notBefore === null || notAfter === null || notAfter <= notBefore) errors.push(`${path} validity interval is invalid`);
  });
  if (errors.length) return { ok: false, errors: [...new Set(errors)] };
  const keySet = input as MarketplaceKeySetV1;
  const remainingSeconds = Math.max(0, Math.floor((Date.parse(keySet.expiresAt) - nowMs) / 1000));
  return { ok: true, keySet, cacheSeconds: Math.min(MAX_MARKETPLACE_KEY_SET_CACHE_SECONDS, remainingSeconds) };
}

export function keyMayVerify(key: MarketplacePublicKey, signedAt: string, keySetGeneratedAt: string): boolean {
  const signatureTime = timestamp(signedAt);
  const notBefore = timestamp(key.notBefore);
  const notAfter = timestamp(key.notAfter);
  const generatedAt = timestamp(keySetGeneratedAt);
  if (signatureTime === null || notBefore === null || notAfter === null || generatedAt === null) return false;
  if (key.status === "revoked" || signatureTime < notBefore || signatureTime > notAfter) return false;
  return key.status === "active" || signatureTime <= generatedAt;
}
