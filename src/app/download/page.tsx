import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { currentRelease, releaseForStage, validateReleaseManifest } from "@/lib/release-manifest";
import { currentLaunch } from "@/lib/launch-stage";

export const metadata = detailMetadata("Free downloads and releases", "Free Spark Plug installers, source, checksums, and compatibility evidence.", "/download");

export default function DownloadPage() {
  const release = releaseForStage(currentRelease, currentLaunch.downloads);
  const publishable = release.releaseStatus === "published" && validateReleaseManifest(release);
  return (
    <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} STAGE / FREE RELEASES`} title={publishable ? `Download Spark Plug ${currentRelease.version} free` : "The source is open. Free installers are coming soon."} summary="GitHub is the source of truth. Website installer buttons activate only when the source, artifact, checksum, signature, release notes, compatibility evidence, and clean-install result all describe the same version.">
      <h2>Current status</h2>
      <p><strong>{publishable ? "Verified free release available" : "No public installer is active."}</strong> Every installer and executable is free. The disabled state is intentional and cannot be overridden by browser detection or marketing copy.</p>
      <h2>Release history</h2>
      <p>No public binary release has been published yet. Version history will link to GitHub Releases after the first tagged release passes every gate.</p>
      <h2>Known issues</h2>
      <p>Version-specific known issues will be published beside each release. Private-build observations are not presented as public release defects or compatibility promises.</p>
      <h2>Every release must include</h2>
      <ul><li>Versioned installer and detached signature.</li><li>SHA-256 checksum and matching tagged source.</li><li>Supported hardware, OS, architecture, and engine matrix.</li><li>Install, upgrade, rollback, and uninstall instructions.</li><li>Release notes, known limitations, and clean-install evidence.</li></ul>
    </LegalShell>
  );
}
