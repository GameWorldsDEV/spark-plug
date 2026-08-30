export type ReleasePlatform = "linux" | "macos" | "windows" | "android";
export type ReleaseArtifactStatus = "available" | "preparing" | "coming-soon";

export type ReleaseArtifact = {
  label: string;
  architecture: string;
  status: ReleaseArtifactStatus;
  url: string | null;
  sha256: string | null;
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
    },
    macos: {
      label: "macOS",
      architecture: "Universal client",
      status: "coming-soon",
      url: null,
      sha256: null,
    },
    windows: {
      label: "Windows",
      architecture: "Client and future node",
      status: "coming-soon",
      url: null,
      sha256: null,
    },
    android: {
      label: "Android",
      architecture: "Mobile control client",
      status: "coming-soon",
      url: null,
      sha256: null,
    },
  },
};

export function validateReleaseManifest(manifest: PublicReleaseManifest) {
  for (const artifact of Object.values(manifest.platforms)) {
    if (artifact.status === "available" && (!artifact.url || !artifact.sha256)) {
      return false;
    }
    if (artifact.url && !artifact.url.startsWith("https://")) return false;
    if (artifact.sha256 && !/^[a-f0-9]{64}$/i.test(artifact.sha256)) return false;
  }
  return manifest.repositoryUrl.startsWith("https://github.com/");
}
