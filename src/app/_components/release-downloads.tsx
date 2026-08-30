"use client";

import { useSyncExternalStore } from "react";

import type {
  PublicReleaseManifest,
  ReleasePlatform,
} from "../../lib/release-manifest";

import styles from "../page.module.css";

const platformOrder: ReleasePlatform[] = ["linux", "macos", "windows", "android"];

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
      <div className={styles.downloadGrid} aria-label="Spark Plug platform releases">
        {platformOrder.map((platform) => {
          const artifact = manifest.platforms[platform];
          const available = artifact.status === "available" && artifact.url;
          const state = artifact.status === "preparing" ? "Preparing first release" : artifact.status === "coming-soon" ? "Coming soon" : `Download ${manifest.version}`;
          return (
            <article key={platform} data-detected={detected === platform || undefined}>
              {detected === platform && <small>YOUR DEVICE</small>}
              <span>{platform === "linux" ? "LINUX" : platform.toUpperCase()}</span>
              <h3>{artifact.label}</h3>
              <p>{artifact.architecture}</p>
              {available ? (
                <a href={artifact.url ?? undefined}>Download <span aria-hidden="true">↓</span></a>
              ) : (
                <button type="button" disabled>{state}</button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
