import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Changelog", "Public Spark Plug website and software release history.", "/changelog");

export default function ChangelogPage() {
  return <LegalShell eyebrow="CHANGELOG / VERSIONED TRUTH" title="What changed—and what actually shipped." summary="Website changes and verified software releases are recorded separately so a design update cannot masquerade as a product release.">
    <h2>Theme library preview — September 2, 2026</h2><ul><li>Added a dedicated free Themes page.</li><li>Marked Cartridge and Compact Disc as included free themes with reduced-motion fallbacks.</li><li>Listed Neon Grid, Cyberdeck Amber, Matrix Rain, Synthwave Sunset, Tokyo Night, and Ice / Holo as the included color collection.</li><li>Added expansion slots for future community themes.</li><li>Kept downloads disabled until versioned, licensed, checksummed packages exist.</li></ul>
    <h2>Open-source reset — September 1, 2026</h2><ul><li>Adopted Apache License 2.0 and a GitHub-first community model.</li><li>Removed accounts, subscriptions, Pro entitlements, hosted publishing, paid listings, and commercial APIs.</li><li>Kept every source package, community profile, executable, and verified installer free.</li><li>Retained optional Stripe tips and pending GitHub Sponsors with no purchased benefits.</li></ul>
    <h2>Software releases</h2><p>No public software binary has shipped. The first entry will link to its tagged source, artifacts, signatures, checksums, notes, compatibility evidence, and known issues.</p>
  </LegalShell>;
}
