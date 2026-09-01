import { NextRequest, NextResponse } from "next/server";

const LEGACY_PRODUCTION_HOST = "sparkplug-public-launch-site.vercel.app";
const CANONICAL_ORIGIN = "https://sparkplug.gameworlds.ai";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":", 1)[0]?.toLowerCase();
  if (process.env.NEXT_PUBLIC_CANONICAL_REDIRECT === "true" && host === LEGACY_PRODUCTION_HOST) {
    return NextResponse.redirect(new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, CANONICAL_ORIGIN), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
