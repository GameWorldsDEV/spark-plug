export type PlanId = "community" | "pro";

export type Entitlement =
  | "core.download"
  | "core.local_routes"
  | "core.outputs"
  | "community.public_profiles"
  | "community.free_presets"
  | "pro.premium_themes"
  | "pro.motion_packs"
  | "pro.private_sync"
  | "pro.early_releases"
  | "pro.profile_history"
  | "creator.verified_badge"
  | "creator.free_listings"
  | "creator.analytics";

export type PlanDefinition = {
  id: PlanId;
  name: string;
  eyebrow: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceLabel: string;
  description: string;
  cta: string;
  featured?: boolean;
  entitlements: readonly Entitlement[];
  highlights: readonly string[];
};

const COMMUNITY_ENTITLEMENTS = [
  "core.download",
  "core.local_routes",
  "core.outputs",
  "community.public_profiles",
  "community.free_presets",
] as const satisfies readonly Entitlement[];

const PRO_ENTITLEMENTS = [
  ...COMMUNITY_ENTITLEMENTS,
  "pro.premium_themes",
  "pro.motion_packs",
  "pro.private_sync",
  "pro.early_releases",
  "pro.profile_history",
  "creator.free_listings",
  "creator.analytics",
] as const satisfies readonly Entitlement[];

export const PLANS: readonly PlanDefinition[] = [
  {
    id: "community",
    name: "Community",
    eyebrow: "The open door",
    monthlyPrice: 0,
    annualPrice: 0,
    priceLabel: "Free forever",
    description: "Run the core, route your own models, and learn from public setups.",
    cta: "Download free",
    entitlements: COMMUNITY_ENTITLEMENTS,
    highlights: [
      "Core routing and output handoff",
      "Unlimited profiles on your machine",
      "Browse and download public setups",
      "Bring your own hardware",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    eyebrow: "Make it yours",
    monthlyPrice: 5,
    annualPrice: 48,
    priceLabel: "$5 monthly",
    description: "Premium presentation, optional private sync, and free profile publishing without locking the core.",
    cta: "Choose Pro",
    featured: true,
    entitlements: PRO_ENTITLEMENTS,
    highlights: [
      "Everything in Community",
      "Premium themes and motion packs",
      "Up to 10 hosted free profiles",
      "Private sync, version history, and analytics",
      "Opt-in early releases and beta testing",
    ],
  },
] as const;

export function entitlementsForPlan(planId: PlanId): ReadonlySet<Entitlement> {
  const plan = PLANS.find((candidate) => candidate.id === planId);
  if (!plan) {
    return new Set();
  }

  return new Set(plan.entitlements);
}

export function planGrants(planId: PlanId, entitlement: Entitlement): boolean {
  return entitlementsForPlan(planId).has(entitlement);
}

export function displayPrice(plan: PlanDefinition, annual: boolean): string {
  if (plan.monthlyPrice === null || plan.annualPrice === null) {
    return plan.priceLabel;
  }

  if (plan.monthlyPrice === 0) {
    return "$0";
  }

  if (annual) {
    return `$${Math.round(plan.annualPrice / 12)}`;
  }

  return `$${plan.monthlyPrice}`;
}
