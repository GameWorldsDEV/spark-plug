"use client";

import { useSyncExternalStore } from "react";

import type {
  PublicReleaseManifest,
  ReleasePlatform,
} from "../../lib/release-manifest";

import styles from "../page.module.css";

const platformOrder: ReleasePlatform[] = ["linux", "macos", "windows", "android"];

const mobileStores = [
  {
    id: "ios",
    family: "iPhone + iPad control",
    label: "iOS App Store",
    architecture: "Mobile and tablet clients",
    status: "Coming soon",
  },
  {
    id: "android",
    family: "Android control",
    label: "Google Play",
    architecture: "Mobile client",
    status: "Coming soon",
  },
] as const;

function isIPadOSDesktopMode(value: string, maxTouchPoints = 0) {
  const platform = value.toLowerCase();
  return maxTouchPoints > 1 && (
    platform.includes("macintosh") ||
    platform.includes("macintel") ||
    platform.includes("mac os")
  );
}

export function detectReleasePlatform(value: string, maxTouchPoints = 0): ReleasePlatform | null {
  const platform = value.toLowerCase();
  if (platform.includes("android")) return "android";
  if (platform.includes("win")) return "windows";
  const isIOS = platform.includes("iphone") ||
    platform.includes("ipad") ||
    platform.includes("ios") ||
    isIPadOSDesktopMode(value, maxTouchPoints);
  if (isIOS) return null;
  if (platform.includes("mac")) return "macos";
  if (platform.includes("linux") || platform.includes("ubuntu")) return "linux";
  return null;
}

export function detectMobileStore(value: string, maxTouchPoints = 0): "ios" | "android" | null {
  const platform = value.toLowerCase();
  if (platform.includes("android")) return "android";
  const isIOS = platform.includes("iphone") ||
    platform.includes("ipad") ||
    platform.includes("ios") ||
    isIPadOSDesktopMode(value, maxTouchPoints);
  if (isIOS) return "ios";
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
        navigator.maxTouchPoints,
      );
    },
    () => null,
  );
  const detectedStore = useSyncExternalStore(
    () => () => undefined,
    () => detectMobileStore(`${navigator.platform} ${navigator.userAgent}`, navigator.maxTouchPoints),
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
            const state = artifact.status === "preparing" || artifact.status === "coming-soon" ? "Coming soon" : `Download ${manifest.version}`;
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
          {mobileStores.map((surface) => (
            <article key={surface.id} data-detected={detectedStore === surface.id || undefined}>
              {detectedStore === surface.id && <small>YOUR DEVICE</small>}
              <span>{surface.family}</span>
              <h3>{surface.label}</h3>
              <p>{surface.architecture}</p>
              <button type="button" disabled>{surface.status}</button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
