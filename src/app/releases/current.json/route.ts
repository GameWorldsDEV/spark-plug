import { currentRelease, releaseForStage } from "../../../lib/release-manifest";
import { currentLaunch } from "../../../lib/launch-stage";

export function GET() {
  return Response.json(releaseForStage(currentRelease, currentLaunch.downloads), {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
