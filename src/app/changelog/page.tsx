import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Changelog", "Public Spark Plug website and software release history.", "/changelog");

export default function ChangelogPage() {
  return <LegalShell eyebrow="CHANGELOG / VERSIONED TRUTH" title="What changed—and what actually shipped." summary="Website changes and verified software releases are recorded separately so a design update cannot masquerade as a product release.">
    <h2>Creator commerce direction — September 2, 2026</h2><ul><li>Kept the local application and bundled themes free and open source.</li><li>Added a disabled commercial preview for $5 monthly or $48 annual Pro service.</li><li>Defined a moderated marketplace for free or paid profiles, themes, motion packs, and rights-cleared LoRA adapters.</li><li>Specified Google sign-in, Supabase, Stripe Billing/Connect, low-call profile import, seller review, and abuse-control gates without activating accounts or payments.</li></ul>
    <h2>Theme library preview — September 2, 2026</h2><ul><li>Added a dedicated Themes page.</li><li>Marked Cartridge and Compact Disc as included free themes with reduced-motion fallbacks and visible $0.00 pricing.</li><li>Listed Neon Grid, Cyberdeck Amber, Matrix Rain, Synthwave Sunset, Tokyo Night, and Ice / Holo as the included $0.00 color collection.</li><li>Added separate expansion slots for future community themes and animation packs.</li><li>Kept downloads disabled until versioned, licensed, checksummed packages exist.</li></ul>
    <h2>Open-source reset — September 1, 2026</h2><ul><li>Adopted Apache License 2.0 and a GitHub-first community model.</li><li>Removed accounts, subscriptions, Pro entitlements, hosted publishing, paid listings, and commercial APIs.</li><li>Kept every source package, community profile, executable, and verified installer free.</li><li>Retained optional Stripe tips and pending GitHub Sponsors with no purchased benefits.</li></ul>
    <h2>Software releases</h2><p>No public software binary has shipped. The first entry will link to its tagged source, artifacts, signatures, checksums, notes, compatibility evidence, and known issues.</p>
  </LegalShell>;
}
