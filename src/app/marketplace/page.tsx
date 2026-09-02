import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { currentLaunch } from "@/lib/launch-stage";

export const metadata = detailMetadata("Community profile library", "Free, editable Spark Plug profiles shared through GitHub.", "/marketplace");

export default function MarketplacePage() {
  return <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} / COMMUNITY LIBRARY`} title="Free profiles. Reviewed before they reach your node." summary="Spark Plug profiles are shared openly through GitHub. No account, subscription, purchase, or publishing tier is required.">
    <h2>Preview status</h2><p>The cards on the homepage are examples. The first community profiles will appear in the repository after schema, license, provenance, and safety review.</p>
    <h2>Profiles are configuration—not plug-ins</h2><p>Submissions must be declarative, schema validated, revision pinned, checksummed, licensed, provenance labeled, and reviewed. They cannot contain scripts, credentials, secrets, host paths, commands, or private output references.</p>
    <h2>Contribute through GitHub</h2><p>Fork the repository, add a schema-valid profile and its license and provenance notes, then open a pull request. Approved profiles stay free to download, inspect, edit, and redistribute under their stated licenses.</p>
    <h2>Themes and motion</h2><p><Link href="/themes">Explore the Themes page</Link> for the Cartridge and Compact Disc concepts, the built-in collection, package safety rules, and future free downloads.</p>
    <h2>Review and reporting</h2><p>Pull-request review records checksums, risk labels, review notes, and version history. Reports, corrections, removals, and appeals use public issues unless a security concern requires private disclosure.</p>
  </LegalShell>;
}
