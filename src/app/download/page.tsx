import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { currentRelease, releaseForStage, validateReleaseManifest } from "@/lib/release-manifest";
import { currentLaunch } from "@/lib/launch-stage";

export const metadata = detailMetadata("Download and releases", "Verified Spark Plug release readiness, artifacts, checksums, and compatibility evidence.", "/download");

export default function DownloadPage() {
  const release = releaseForStage(currentRelease, currentLaunch.downloads);
  const publishable = release.releaseStatus === "published" && validateReleaseManifest(release);
  return (
    <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} STAGE / RELEASE GATE`} title={publishable ? `Download Spark Plug ${currentRelease.version}` : "The repository is open. Installers are coming soon."} summary="A download activates only when its source, installer, checksum, signature, release notes, compatibility evidence, and clean-install result all describe the same version.">
      <h2>Current status</h2>
      <p><strong>{publishable ? "Verified release available" : "No public installer is active."}</strong> The disabled state is intentional and cannot be overridden by browser detection or marketing copy.</p>
      <h2>Release history</h2>
      <p>No public binary release has been published yet. Version history will appear here after the first tagged release passes every gate.</p>
      <h2>Known issues</h2>
      <p>Version-specific known issues will be published beside each release. Private-build observations are not presented as public release defects or compatibility promises.</p>
      <h2>Every release must include</h2>
      <ul><li>Versioned installer and detached signature.</li><li>SHA-256 checksum and matching tagged source.</li><li>Supported hardware, OS, architecture, and engine matrix.</li><li>Install, upgrade, rollback, and uninstall instructions.</li><li>Release notes, known limitations, and clean-install evidence.</li></ul>
    </LegalShell>
  );
}
