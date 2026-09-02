export const PRO_MONTHLY_USD = 5;
export const PRO_ANNUAL_USD = 48;
export const MARKETPLACE_PLATFORM_FEE_BPS = 500;
export const MARKETPLACE_PLATFORM_FEE_PERCENT = MARKETPLACE_PLATFORM_FEE_BPS / 100;

export function marketplacePlatformFeeCents(grossCents: number): number {
  if (!Number.isSafeInteger(grossCents) || grossCents < 0) {
    throw new RangeError("grossCents must be a non-negative safe integer");
  }
  return Math.round((grossCents * MARKETPLACE_PLATFORM_FEE_BPS) / 10_000);
}

export const communityFeatures = [
  "Complete local control application and updates",
  "Unlimited profiles and history stored on your machine",
  "All qualified engines, routing, queues, ComfyUI, and remote clients",
  "Local Unsloth and LoRA workflows on supported hardware",
  "Bundled Cartridge, Compact Disc, and color themes",
  "Browse and install approved free marketplace releases",
] as const;

export const proFeatures = [
  "Everything in Community",
  "Premium themes and motion packs",
  "Creator storefront and profile publishing",
  "Free or paid listings with version history",
  "Creator download and sales analytics",
  "Optional private profile sync and restoration",
] as const;

export const creatorAssetTypes = [
  "Spark Plug profiles",
  "Theme packs",
  "Motion and animation packs",
  "Rights-cleared LoRA adapters",
] as const;
