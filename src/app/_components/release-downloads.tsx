"use client";

import { useSyncExternalStore } from "react";

import type {
  PublicReleaseManifest,
  ReleasePlatform,
} from "../../lib/release-manifest";

import styles from "../page.module.css";

const platformOrder: ReleasePlatform[] = ["linux", "macos", "windows", "android"];

const controlSurfaces = [
  {
    id: "iphone",
    family: "Mobile control",
    label: "iPhone",
    architecture: "Working control build",
    status: "Public artifact preparing",
  },
  {
    id: "ipad",
    family: "Tablet control",
    label: "iPad",
    architecture: "Working control build",
    status: "Public artifact preparing",
  },
] as const;

export function detectReleasePlatform(value: string): ReleasePlatform | null {
  const platform = value.toLowerCase();
  if (platform.includes("android")) return "android";
  if (platform.includes("win")) return "windows";
  if (platform.includes("mac") || platform.includes("iphone") || platform.includes("ipad")) return "macos";
  if (platform.includes("linux") || platform.includes("ubuntu")) return "linux";
  return null;
}

export function ReleaseDownloads({ manifest }: { manifest: PublicReleaseManifest }) {
  const detected = useSyncExternalStore(
    () => () => undefined,
    () => {
    const navigatorWithData = navigator as Navigator & {
      userAgentData?: { platform?: string };
    };
      return detectReleasePlatform(
        `${navigatorWithData.userAgentData?.platform ?? navigator.platform} ${navigator.userAgent}`,
      );
    },
    () => null,
  );

  return (
    <div className={styles.downloadCenter}>
      <div className={styles.downloadIntro}>
        <p className={styles.eyebrow}>FIRST PUBLIC RELEASE</p>
        <h2>Pick your platform.</h2>
        <p>
          The repository is open now. A platform download activates only after its installer,
          checksum, release notes, and compatibility evidence are published together.
        </p>
        <a href={manifest.repositoryUrl} rel="noopener noreferrer">
          Open the GitHub repository <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.downloadCatalog}>
        <p className={styles.downloadGroupLabel}>Node software + desktop control</p>
        <div className={styles.downloadGrid} aria-label="Spark Plug platform releases">
          {platformOrder.filter((platform) => platform !== "android").map((platform) => {
            const artifact = manifest.platforms[platform];
            const available = artifact.status === "available" && artifact.url;
            const state = artifact.status === "preparing" ? "Public artifact preparing" : artifact.status === "coming-soon" ? "Coming soon" : `Download ${manifest.version}`;
            const family = platform === "linux" ? "Node software" : platform === "macos" ? "Desktop control" : "Desktop control + future node";
            const workingBuild = platform === "macos";
            return (
              <article key={platform} data-detected={detected === platform || undefined}>
                {detected === platform && <small>YOUR DEVICE</small>}
                <span>{family}</span>
                <h3>{artifact.label}</h3>
                <p>{workingBuild ? "Working control build" : artifact.architecture}</p>
                {available ? (
                  <a href={artifact.url ?? undefined}>Download <span aria-hidden="true">↓</span></a>
                ) : (
                  <button type="button" disabled>{state}</button>
                )}
              </article>
            );
          })}
        </div>

        <p className={styles.downloadGroupLabel}>Mobile + tablet control</p>
        <div className={styles.downloadGrid} aria-label="Spark Plug mobile control releases">
          {controlSurfaces.map((surface) => (
            <article key={surface.id}>
              <span>{surface.family}</span>
              <h3>{surface.label}</h3>
              <p>{surface.architecture}</p>
              <button type="button" disabled>{surface.status}</button>
            </article>
          ))}
          <article data-detected={detected === "android" || undefined}>
            {detected === "android" && <small>YOUR DEVICE</small>}
            <span>Mobile control</span>
            <h3>{manifest.platforms.android.label}</h3>
            <p>{manifest.platforms.android.architecture}</p>
            <button type="button" disabled>Coming soon</button>
          </article>
        </div>
      </div>
    </div>
  );
}
