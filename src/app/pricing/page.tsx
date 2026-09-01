import { LegalShell } from "../_components/legal-shell";
import { PricingPlans } from "../_components/pricing-plans";
import { currentLaunch } from "@/lib/launch-stage";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Community and Pro", "Spark Plug free local core and optional Pro hosted conveniences.", "/pricing");

export default function PricingPage() {
  return <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} / PRICING`} title="Your node stays yours. Pro personalizes the experience." summary="Community keeps the local control plane free and accountless. Pro is planned at $5 monthly or $48 annually and never unlocks core routing, security, or access to hardware you already own.">
    <PricingPlans active={currentLaunch.billing} />
    <h2>Marketplace boundary</h2><p>Only Pro may publish up to ten moderated profiles. Every published profile in the first marketplace is free to browse and download. Paid listings and creator payouts are not part of this launch.</p>
  </LegalShell>;
}

