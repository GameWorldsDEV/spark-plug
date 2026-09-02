import "server-only";

import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  authCookie,
  publicAuthConfig,
  REFRESH_COOKIE,
  requestRefreshToken,
} from "@/lib/auth-flow";

export const dynamic = "force-dynamic";
const NO_STORE = { "cache-control": "private, no-store" };

export async function POST(request: Request) {
  const config = publicAuthConfig();
  const refreshToken = requestRefreshToken(request);
  if (!config || !refreshToken) {
    return NextResponse.json({ error: "session refresh is unavailable" }, { status: 401, headers: NO_STORE });
  }
  try {
    const upstream = await fetch(`${config.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: config.anonKey!, "content-type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
    const tokens = await upstream.json() as { access_token?: unknown; refresh_token?: unknown; expires_in?: unknown };
    if (!upstream.ok || typeof tokens.access_token !== "string" || typeof tokens.refresh_token !== "string") {
      throw new Error("invalid refresh response");
    }
    const response = NextResponse.json({ refreshed: true }, { headers: NO_STORE });
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, { ...authCookie, maxAge: Math.min(3600, Number(tokens.expires_in) || 3600) });
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, { ...authCookie, maxAge: 30 * 24 * 60 * 60 });
    return response;
  } catch {
    const response = NextResponse.json({ error: "session refresh failed" }, { status: 401, headers: NO_STORE });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }
}
