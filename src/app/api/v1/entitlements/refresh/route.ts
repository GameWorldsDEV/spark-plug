import "server-only";

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ENTITLEMENT_AUDIENCE,
  ENTITLEMENT_VERSION,
  MAX_ENTITLEMENT_TTL_SECONDS,
  signEntitlement,
  type CreatorClass,
  type EntitlementClaimsV1,
  type ProCapability,
} from "@/lib/entitlements";
import { supabaseUserRpc } from "@/lib/supabase-rest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store, private" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRO_CAPABILITIES: ProCapability[] = [
  "premium_themes",
  "premium_motion",
  "private_profile_sync",
  "profile_publish_free",
  "profile_publish_paid",
  "profile_analytics",
];
const CREATOR_CLASSES = new Set<CreatorClass>([
  "community",
  "verified_creator",
  "verified_business",
  "gameworlds_official",
]);

type EntitlementProjection = {
  user_id?: unknown;
  plan?: unknown;
  status?: unknown;
  creator_class?: unknown;
};

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;
  const token = authorization.slice(7).trim();
  return token.length >= 16 && token.length <= 8_192 ? token : null;
}

function signingConfig() {
  const encodedPrivateKey = process.env.ENTITLEMENT_PRIVATE_KEY_PEM_BASE64;
  const keyId = process.env.ENTITLEMENT_KEY_ID;
  const issuer = process.env.ENTITLEMENT_ISSUER;
  if (
    !encodedPrivateKey ||
    encodedPrivateKey.length > 16_384 ||
    encodedPrivateKey.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(encodedPrivateKey) ||
    !keyId ||
    !/^[A-Za-z0-9._-]{1,64}$/.test(keyId) ||
    !issuer
  ) return null;
  try {
    const parsedIssuer = new URL(issuer);
    if (
      parsedIssuer.protocol !== "https:" ||
      parsedIssuer.username ||
      parsedIssuer.password ||
      parsedIssuer.search ||
      parsedIssuer.hash
    ) return null;
    return {
      privateKey: Buffer.from(encodedPrivateKey, "base64").toString("utf8"),
      keyId,
      issuer: parsedIssuer.href.replace(/\/$/, ""),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const accessToken = bearerToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "authentication required" }, { status: 401, headers: NO_STORE });
  }
  const signing = signingConfig();
  if (!signing) {
    return NextResponse.json({ error: "entitlement signing is not configured" }, { status: 503, headers: NO_STORE });
  }

  try {
    const projection = await supabaseUserRpc<EntitlementProjection>(
      accessToken,
      "current_entitlement_claims",
    );
    if (typeof projection.user_id !== "string" || !UUID.test(projection.user_id)) {
      throw new Error("invalid authenticated user id");
    }

    // Community access is compiled into the local product. Returning no token
    // here prevents callers from turning a free tier into an online heartbeat.
    if (projection.plan !== "pro" || !["active", "trialing"].includes(String(projection.status))) {
      return NextResponse.json(
        { plan: "community", entitlement: null, refreshAfter: null },
        { headers: NO_STORE },
      );
    }

    const creatorClass = CREATOR_CLASSES.has(projection.creator_class as CreatorClass)
      ? (projection.creator_class as CreatorClass)
      : "community";
    const now = Math.floor(Date.now() / 1000);
    const claims: EntitlementClaimsV1 = {
      ver: ENTITLEMENT_VERSION,
      iss: signing.issuer,
      aud: ENTITLEMENT_AUDIENCE,
      sub: projection.user_id,
      plan: "pro",
      creatorClass,
      capabilities: PRO_CAPABILITIES,
      profileLimit: 10,
      iat: now,
      exp: now + MAX_ENTITLEMENT_TTL_SECONDS,
      jti: randomUUID(),
    };
    const entitlement = signEntitlement(claims, signing.privateKey, signing.keyId);
    return NextResponse.json(
      {
        plan: "pro",
        entitlement,
        expiresAt: claims.exp,
        refreshAfter: claims.exp - 12 * 60 * 60,
        keySetUrl: "/.well-known/sparkplug-entitlement-keys",
      },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "entitlement refresh failed" }, { status: 502, headers: NO_STORE });
  }
}
