import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Changelog", "Public Spark Plug website and software release history.", "/changelog");

export default function ChangelogPage() {
  return <LegalShell eyebrow="CHANGELOG / VERSIONED TRUTH" title="What changed—and what actually shipped." summary="Website changes and verified software releases are recorded separately so a design update cannot masquerade as a product release.">
    <h2>Website preview — September 1, 2026</h2><ul><li>Introduced Preview, Release, and Commercial launch gates.</li><li>Added public documentation, download readiness, marketplace, training, support, legal, and accessibility routes.</li><li>Clarified Stripe support and kept unavailable product actions disabled.</li></ul>
    <h2>Software releases</h2><p>No public software binary has shipped. The first entry will link to its tagged source, artifacts, signatures, checksums, notes, compatibility evidence, and known issues.</p>
  </LegalShell>;
}

