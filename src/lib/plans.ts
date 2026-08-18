export type PlanId = "community" | "pro" | "pro-plus";

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
  | "creator.verified_badge"
  | "creator.paid_listings"
  | "creator.analytics"
  | "creator.payouts";

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
      "Public community profiles",
      "Free setup library",
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
    description: "Premium motion, themes, and private setup sync without locking the core.",
    cta: "Choose Pro",
    featured: true,
    entitlements: PRO_ENTITLEMENTS,
    highlights: [
      "Everything in Community",
      "Premium themes and motion packs",
      "Private setup sync",
      "Early visual releases",
    ],
  },
  {
    id: "pro-plus",
    name: "Pro+",
    eyebrow: "Verified creators",
    monthlyPrice: null,
    annualPrice: null,
    priceLabel: "Apply to verify",
    description: "Publish a trusted profile and optionally charge for original setup packs.",
    cta: "Apply for Pro+",
    entitlements: [
      ...PRO_ENTITLEMENTS,
      "creator.verified_badge",
      "creator.paid_listings",
      "creator.analytics",
      "creator.payouts",
    ],
    highlights: [
      "Everything in Pro",
      "Verified creator badge",
      "Free or paid setup listings",
      "Storefront analytics and payouts",
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
