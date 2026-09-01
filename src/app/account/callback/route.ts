import "server-only";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, authCookie, PKCE_COOKIE, publicAuthConfig, REFRESH_COOKIE } from "@/lib/auth-flow";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const config = publicAuthConfig();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const verifier = request.headers.get("cookie")?.match(/(?:^|;\s*)sparkplug_pkce=([^;]+)/)?.[1];
  if (!config || !code || !verifier) return NextResponse.redirect(new URL("/account?error=signin", url));
  try {
    const upstream = await fetch(`${config.url}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: { apikey: config.anonKey!, "content-type": "application/json" },
      body: JSON.stringify({ auth_code: code, code_verifier: decodeURIComponent(verifier) }),
      cache: "no-store",
    });
    const tokens = await upstream.json() as { access_token?: unknown; refresh_token?: unknown; expires_in?: unknown };
    if (!upstream.ok || typeof tokens.access_token !== "string" || typeof tokens.refresh_token !== "string") throw new Error("invalid auth response");
    const response = NextResponse.redirect(new URL("/account?signin=success", url));
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, { ...authCookie, maxAge: Math.min(3600, Number(tokens.expires_in) || 3600) });
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, { ...authCookie, maxAge: 30 * 24 * 60 * 60 });
    response.cookies.delete(PKCE_COOKIE);
    return response;
  } catch {
    return NextResponse.redirect(new URL("/account?error=signin", url));
  }
}

