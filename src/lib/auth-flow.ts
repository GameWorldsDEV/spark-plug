import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { currentLaunch } from "./launch-stage";
import { supabaseConfig } from "./supabase-rest";

export const PKCE_COOKIE = "sparkplug_pkce";
export const ACCESS_COOKIE = "sparkplug_access";
export const REFRESH_COOKIE = "sparkplug_refresh";

export function publicAuthConfig() {
  const config = supabaseConfig();
  if (!currentLaunch.accounts || !config?.anonKey) return null;
  const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
  return { ...config, origin };
}

export function createPkce() {
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

function cookieValue(request: Request, name: string): string | null {
  const raw = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

export function sameOriginRequest(request: Request): boolean {
  const configured = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparkplug.gameworlds.ai").origin;
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return origin === configured && (!fetchSite || fetchSite === "same-origin");
}

export function requestAccessToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || "";
  if (authorization.startsWith("Bearer ")) {
    const token = authorization.slice(7).trim();
    return token.length >= 16 && token.length <= 8192 ? token : null;
  }
  if (!sameOriginRequest(request)) return null;
  const token = cookieValue(request, ACCESS_COOKIE);
  return token && token.length >= 16 && token.length <= 8192 ? token : null;
}

export function requestRefreshToken(request: Request): string | null {
  if (!sameOriginRequest(request)) return null;
  const token = cookieValue(request, REFRESH_COOKIE);
  return token && token.length >= 16 && token.length <= 8192 ? token : null;
}

export const authCookie = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};
