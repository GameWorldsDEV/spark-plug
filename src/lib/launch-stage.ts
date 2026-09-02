export const LAUNCH_STAGES = ["preview", "release", "commercial"] as const;

export type LaunchStage = (typeof LAUNCH_STAGES)[number];

export type LaunchCapabilities = {
  stage: LaunchStage;
  downloads: boolean;
  accounts: boolean;
  billing: boolean;
  creatorPublishing: boolean;
  marketplaceSales: boolean;
  hostedTraining: false;
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
  commerceReady = process.env.SPARKPLUG_COMMERCE_READY === "true",
): LaunchCapabilities {
  const commerceActive = stage === "commercial" && commerceReady;
  return Object.freeze({
    stage,
    downloads: stage !== "preview",
    accounts: commerceActive,
    billing: commerceActive,
    creatorPublishing: commerceActive,
    marketplaceSales: commerceActive,
    hostedTraining: false,
    indexable: stage !== "preview" && indexRequested,
  });
}

export const currentLaunch = launchCapabilities();
