import "server-only";
import { NextResponse } from "next/server";
import { authCookie, createPkce, PKCE_COOKIE, publicAuthConfig } from "@/lib/auth-flow";

export const dynamic = "force-dynamic";

export function GET() {
  const config = publicAuthConfig();
  if (!config) return NextResponse.json({ error: "accounts are not active" }, { status: 503 });
  const { verifier, challenge } = createPkce();
  const url = new URL(`${config.url}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", `${config.origin}/account/callback`);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "s256");
  const response = NextResponse.redirect(url);
  response.cookies.set(PKCE_COOKIE, verifier, { ...authCookie, maxAge: 600 });
  return response;
}
