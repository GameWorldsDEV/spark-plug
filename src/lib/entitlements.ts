import {
  createPrivateKey,
  createPublicKey,
  sign as cryptoSign,
  verify as cryptoVerify,
  type KeyObject,
} from "node:crypto";

export const ENTITLEMENT_VERSION = 1 as const;
export const ENTITLEMENT_AUDIENCE = "sparkplug-local";
export const MAX_ENTITLEMENT_TTL_SECONDS = 7 * 24 * 60 * 60;
export const DEFAULT_REFRESH_WINDOW_SECONDS = 12 * 60 * 60;

export type CreatorClass =
  | "community"
  | "verified_creator"
  | "verified_business"
  | "gameworlds_official";

export type ProCapability =
  | "premium_themes"
  | "premium_motion"
  | "private_profile_sync"
  | "profile_publish_free"
  | "profile_publish_paid"
  | "profile_analytics";

export type EntitlementClaimsV1 = {
  ver: typeof ENTITLEMENT_VERSION;
  iss: string;
  aud: typeof ENTITLEMENT_AUDIENCE;
  sub: string;
  plan: "pro";
  creatorClass: CreatorClass;
  capabilities: ProCapability[];
  profileLimit: 10;
  iat: number;
  exp: number;
  jti: string;
};

export type LocalAccessState =
  | {
      plan: "community";
      signedEntitlementRequired: false;
      capabilities: readonly ["core", "public_profiles"];
      hostedProfileLimit: 0;
    }
  | {
      plan: "pro";
      signedEntitlementRequired: true;
      capabilities: readonly ProCapability[];
      hostedProfileLimit: 10;
      creatorClass: CreatorClass;
      expiresAt: number;
    };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const JTI = /^[A-Za-z0-9_-]{16,96}$/;
const CREATOR_CLASSES = new Set<CreatorClass>([
  "community",
  "verified_creator",
  "verified_business",
  "gameworlds_official",
]);
const CAPABILITIES = new Set<ProCapability>([
  "premium_themes",
  "premium_motion",
  "private_profile_sync",
  "profile_publish_free",
  "profile_publish_paid",
  "profile_analytics",
]);

const COMMUNITY_ACCESS: LocalAccessState = Object.freeze({
  plan: "community",
  signedEntitlementRequired: false,
  capabilities: ["core", "public_profiles"] as const,
  hostedProfileLimit: 0,
});

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function parseJsonSegment(value: string): unknown {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("invalid compact encoding");
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function asPrivateKey(key: string | KeyObject): KeyObject {
  return typeof key === "string" ? createPrivateKey(key) : key;
}

function asPublicKey(key: string | KeyObject): KeyObject {
  return typeof key === "string" ? createPublicKey(key) : key;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateClaims(
  value: unknown,
  expectedIssuer: string,
  nowSeconds: number,
): EntitlementClaimsV1 {
  if (!isRecord(value)) throw new Error("entitlement payload must be an object");
  const claimKeys = [
    "aud", "capabilities", "creatorClass", "exp", "iat", "iss",
    "jti", "plan", "profileLimit", "sub", "ver",
  ];
  if (
    Object.keys(value).length !== claimKeys.length ||
    Object.keys(value).some((key) => !claimKeys.includes(key))
  ) {
    throw new Error("entitlement claims contain unsupported fields");
  }
  const capabilities = value.capabilities;
  if (
    value.ver !== ENTITLEMENT_VERSION ||
    value.iss !== expectedIssuer ||
    value.aud !== ENTITLEMENT_AUDIENCE ||
    typeof value.sub !== "string" ||
    !UUID.test(value.sub) ||
    value.plan !== "pro" ||
    typeof value.creatorClass !== "string" ||
    !CREATOR_CLASSES.has(value.creatorClass as CreatorClass) ||
    !Array.isArray(capabilities) ||
    capabilities.length === 0 ||
    capabilities.some((item) => typeof item !== "string" || !CAPABILITIES.has(item as ProCapability)) ||
    new Set(capabilities).size !== capabilities.length ||
    value.profileLimit !== 10 ||
    typeof value.iat !== "number" ||
    !Number.isInteger(value.iat) ||
    typeof value.exp !== "number" ||
    !Number.isInteger(value.exp) ||
    typeof value.jti !== "string" ||
    !JTI.test(value.jti)
  ) {
    throw new Error("entitlement claims are invalid");
  }
  if (value.exp <= nowSeconds) throw new Error("entitlement expired");
  if (value.iat > nowSeconds + 60) throw new Error("entitlement issued in the future");
  if (value.exp - value.iat > MAX_ENTITLEMENT_TTL_SECONDS) throw new Error("entitlement lifetime is too long");
  return value as EntitlementClaimsV1;
}

export function signEntitlement(
  claims: EntitlementClaimsV1,
  privateKey: string | KeyObject,
  keyId: string,
): string {
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(keyId)) throw new Error("invalid entitlement key id");
  validateClaims(claims, claims.iss, claims.iat);
  const header = base64UrlEncode(JSON.stringify({ alg: "EdDSA", kid: keyId, typ: "JWT" }));
  const payload = base64UrlEncode(JSON.stringify(claims));
  const signingInput = `${header}.${payload}`;
  const signature = cryptoSign(null, Buffer.from(signingInput), asPrivateKey(privateKey));
  return `${signingInput}.${base64UrlEncode(signature)}`;
}

export function verifyEntitlement(
  token: string,
  publicKeys: Readonly<Record<string, string | KeyObject>>,
  expectedIssuer: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): EntitlementClaimsV1 {
  if (token.length > 8_192) throw new Error("entitlement is too large");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("entitlement must use compact JWS form");
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJsonSegment(encodedHeader);
  if (
    !isRecord(header) ||
    header.alg !== "EdDSA" ||
    header.typ !== "JWT" ||
    typeof header.kid !== "string" ||
    Object.keys(header).some((key) => !["alg", "kid", "typ"].includes(key))
  ) {
    throw new Error("entitlement header is invalid");
  }
  const publicKey = publicKeys[header.kid];
  if (!publicKey) throw new Error("entitlement signing key is unknown");
  const signature = Buffer.from(encodedSignature, "base64url");
  if (signature.length !== 64) throw new Error("entitlement signature is invalid");
  const valid = cryptoVerify(
    null,
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    asPublicKey(publicKey),
    signature,
  );
  if (!valid) throw new Error("entitlement signature is invalid");
  return validateClaims(parseJsonSegment(encodedPayload), expectedIssuer, nowSeconds);
}

export function localAccessFromEntitlement(
  claims: EntitlementClaimsV1 | null,
): LocalAccessState {
  if (!claims) return COMMUNITY_ACCESS;
  return {
    plan: "pro",
    signedEntitlementRequired: true,
    capabilities: claims.capabilities,
    hostedProfileLimit: claims.profileLimit,
    creatorClass: claims.creatorClass,
    expiresAt: claims.exp,
  };
}

export function shouldRefreshEntitlement(
  claims: EntitlementClaimsV1 | null,
  nowSeconds = Math.floor(Date.now() / 1000),
  refreshWindowSeconds = DEFAULT_REFRESH_WINDOW_SECONDS,
): boolean {
  // Community is built into the local program. It never calls the public
  // account service merely to prove that free functionality is free.
  if (!claims) return false;
  return claims.exp - nowSeconds <= Math.max(0, refreshWindowSeconds);
}
