import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { currentLaunch } from "@/lib/launch-stage";

export const metadata = detailMetadata("Profile marketplace", "Curated, declarative Spark Plug profile marketplace boundaries.", "/marketplace");

export default function MarketplacePage() {
  return <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} / MARKETPLACE`} title="Curated profiles. Reviewed before they reach your node." summary="Everyone may browse and download free profiles after launch. Only active Pro accounts may submit up to ten free profiles for validation and moderation.">
    <h2>Preview status</h2><p>The cards on the homepage are examples. Public catalog accounts, downloads, publishing, ratings, and transactions are not active during Preview.</p>
    <h2>Profiles are configuration—not plug-ins</h2><p>Submissions must be declarative, schema validated, revision pinned, checksummed, licensed, provenance labeled, and reviewed. They cannot contain scripts, credentials, secrets, host paths, commands, or private output references.</p>
    <h2>Free marketplace launch</h2><p>The first marketplace carries free profiles only. Paid listings, creator payouts, and marketplace checkout remain disabled. Pro controls publishing capacity, not whether another user can browse or download an approved free profile.</p>
    <h2>Moderation and appeals</h2><p>Publication is service managed. Reports, removals, version history, risk labels, review timestamps, appeals, and takedowns remain auditable. Verification never bypasses validation.</p>
  </LegalShell>;
}

