export const LAUNCH_STAGES = ["preview", "release"] as const;

export type LaunchStage = (typeof LAUNCH_STAGES)[number];

export type LaunchCapabilities = {
  stage: LaunchStage;
  downloads: boolean;
  indexable: boolean;
};

export function parseLaunchStage(value: string | undefined): LaunchStage {
  return LAUNCH_STAGES.includes(value as LaunchStage)
    ? (value as LaunchStage)
    : "preview";
}

export function launchCapabilities(
  stage = parseLaunchStage(process.env.NEXT_PUBLIC_SITE_STAGE),
  indexRequested = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
): LaunchCapabilities {
  return Object.freeze({
    stage,
    downloads: stage !== "preview",
    indexable: stage !== "preview" && indexRequested,
  });
}

export const currentLaunch = launchCapabilities();
