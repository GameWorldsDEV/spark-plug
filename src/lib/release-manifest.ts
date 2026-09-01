export type ReleasePlatform = "linux" | "macos" | "windows" | "android";
export type ReleaseArtifactStatus = "available" | "preparing" | "coming-soon";

export type ReleaseArtifact = {
  label: string;
  architecture: string;
  status: ReleaseArtifactStatus;
  url: string | null;
  sha256: string | null;
  signatureUrl: string | null;
  releaseNotesUrl: string | null;
  compatibilityEvidenceUrl: string | null;
};

export type PublicReleaseManifest = {
  schemaVersion: 1;
  version: string | null;
  releaseStatus: "preparing" | "published";
  publishedAt: string | null;
  repositoryUrl: string;
  platforms: Record<ReleasePlatform, ReleaseArtifact>;
};

export const currentRelease: PublicReleaseManifest = {
  schemaVersion: 1,
  version: null,
  releaseStatus: "preparing",
  publishedAt: null,
  repositoryUrl: "https://github.com/GameWorldsDEV/spark-plug",
  platforms: {
    linux: {
      label: "Linux / DGX Spark",
      architecture: "Ubuntu 24.04 ARM64",
      status: "preparing",
      url: null,
      sha256: null,
      signatureUrl: null,
      releaseNotesUrl: null,
      compatibilityEvidenceUrl: null,
    },
    macos: {
      label: "macOS",
      architecture: "Universal client",
      status: "preparing",
      url: null,
      sha256: null,
      signatureUrl: null,
      releaseNotesUrl: null,
      compatibilityEvidenceUrl: null,
    },
    windows: {
      label: "Windows",
      architecture: "Client and future node",
      status: "coming-soon",
      url: null,
      sha256: null,
      signatureUrl: null,
      releaseNotesUrl: null,
      compatibilityEvidenceUrl: null,
    },
    android: {
      label: "Android",
      architecture: "Mobile control client",
      status: "coming-soon",
      url: null,
      sha256: null,
      signatureUrl: null,
      releaseNotesUrl: null,
      compatibilityEvidenceUrl: null,
    },
  },
};

export function releaseForStage(
  manifest: PublicReleaseManifest,
  downloadsEnabled: boolean,
): PublicReleaseManifest {
  if (downloadsEnabled) return structuredClone(manifest);
  const masked = structuredClone(manifest);
  masked.releaseStatus = "preparing";
  masked.version = null;
  masked.publishedAt = null;
  for (const artifact of Object.values(masked.platforms)) {
    artifact.status = "coming-soon";
    artifact.url = null;
    artifact.sha256 = null;
    artifact.signatureUrl = null;
    artifact.releaseNotesUrl = null;
    artifact.compatibilityEvidenceUrl = null;
  }
  return masked;
}

export function validateReleaseManifest(manifest: PublicReleaseManifest) {
  if (manifest.releaseStatus === "published" && (!manifest.version || !manifest.publishedAt)) {
    return false;
  }
  for (const artifact of Object.values(manifest.platforms)) {
    if (artifact.status === "available" && (
      !artifact.url ||
      !artifact.sha256 ||
      !artifact.signatureUrl ||
      !artifact.releaseNotesUrl ||
      !artifact.compatibilityEvidenceUrl ||
      manifest.releaseStatus !== "published"
    )) {
      return false;
    }
    for (const url of [artifact.url, artifact.signatureUrl, artifact.releaseNotesUrl, artifact.compatibilityEvidenceUrl]) {
      if (url && !url.startsWith("https://")) return false;
    }
    if (artifact.sha256 && !/^[a-f0-9]{64}$/i.test(artifact.sha256)) return false;
  }
  return manifest.repositoryUrl.startsWith("https://github.com/");
}
