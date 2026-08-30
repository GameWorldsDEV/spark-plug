import { currentRelease } from "../../../lib/release-manifest";

export function GET() {
  return Response.json(currentRelease, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
