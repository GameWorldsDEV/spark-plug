import "server-only";

import { createPublicKey, type JsonWebKey } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const encoded = process.env.ENTITLEMENT_PUBLIC_KEY_PEM_BASE64;
  const keyId = process.env.ENTITLEMENT_KEY_ID;
  if (
    !encoded ||
    encoded.length > 16_384 ||
    encoded.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded) ||
    !keyId ||
    !/^[A-Za-z0-9._-]{1,64}$/.test(keyId)
  ) {
    return NextResponse.json(
      { error: "entitlement verification key is not configured" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
  try {
    const pem = Buffer.from(encoded, "base64").toString("utf8");
    const jwk = createPublicKey(pem).export({ format: "jwk" }) as JsonWebKey;
    return NextResponse.json(
      { keys: [{ ...jwk, alg: "EdDSA", kid: keyId, use: "sig" }] },
      {
        headers: {
          "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "entitlement verification key is invalid" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
