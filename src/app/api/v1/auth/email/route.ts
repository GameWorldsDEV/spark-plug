import "server-only";
import { NextResponse } from "next/server";
import { authCookie, createPkce, PKCE_COOKIE, publicAuthConfig } from "@/lib/auth-flow";
import { readJsonBodyWithLimit } from "@/lib/read-json-body";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  const config = publicAuthConfig();
  if (!config) return NextResponse.json({ error: "accounts are not active" }, { status: 503, headers: NO_STORE });
  const body = await readJsonBodyWithLimit(request, 1024);
  const email = body.ok && body.value && typeof body.value === "object" ? (body.value as Record<string, unknown>).email : null;
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email is invalid" }, { status: 400, headers: NO_STORE });
  }
  const { verifier, challenge } = createPkce();
  try {
    const upstream = await fetch(`${config.url}/auth/v1/otp`, {
      method: "POST",
      headers: { apikey: config.anonKey!, "content-type": "application/json" },
      body: JSON.stringify({
        email,
        create_user: true,
        email_redirect_to: `${config.origin}/account/callback`,
        code_challenge: challenge,
        code_challenge_method: "s256",
      }),
      cache: "no-store",
    });
    if (!upstream.ok) throw new Error("auth provider rejected request");
    const response = NextResponse.json({ sent: true }, { status: 202, headers: NO_STORE });
    response.cookies.set(PKCE_COOKIE, verifier, { ...authCookie, maxAge: 600 });
    return response;
  } catch {
    return NextResponse.json({ error: "sign-in link could not be sent" }, { status: 502, headers: NO_STORE });
  }
}

