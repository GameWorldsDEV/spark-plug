import { currentLaunch } from "./launch-stage";

function configuredOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_MARKETPLACE_ORIGIN;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function hostedMarketplaceHref(path: `/${string}`): string | null {
  if (
    currentLaunch.stage !== "commercial" ||
    process.env.NEXT_PUBLIC_MARKETPLACE_AVAILABLE !== "true"
  ) return null;
  const origin = configuredOrigin();
  return origin ? new URL(path, origin).toString() : null;
}
