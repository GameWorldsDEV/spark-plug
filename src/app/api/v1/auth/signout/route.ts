import { NextResponse } from "next/server";
import { ACCESS_COOKIE, PKCE_COOKIE, REFRESH_COOKIE } from "@/lib/auth-flow";

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/account", request.url), 303);
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, PKCE_COOKIE]) response.cookies.delete(name);
  return response;
}

