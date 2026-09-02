import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { MARKETPLACE_PLATFORM_FEE_PERCENT } from "@/lib/plans";

export const metadata = detailMetadata("Commercial terms gate", "Requirements before Pro subscriptions and creator sales may activate.", "/legal/commercial");

export default function CommercialTermsPage() {
  return <LegalShell eyebrow="COMMERCIAL TERMS / NOT YET EFFECTIVE" title="No subscription or sale goes live on unfinished promises." summary="The planned Pro service and creator marketplace remain disabled until billing, seller, buyer, privacy, moderation, security, and support terms are complete and tested.">
    <h2>Planned Pro service</h2><p>The proposed launch price is $5 monthly or $48 annually. Pro covers premium presentation packs and optional hosted creator services. It never gates the open-source local core, local profiles, local training tools, security, accessibility, diagnostics, or offline operation.</p>
    <h2>Creator marketplace</h2><p>Active Pro creators may apply to publish approved free or paid profiles, themes, motion packs, and rights-cleared LoRA adapters. GameWorlds&rsquo; planned platform fee is {MARKETPLACE_PLATFORM_FEE_PERCENT}% of each paid sale. Processing and Connect costs are separate. Payout timing, reserves, refunds, disputes, taxes, content licenses, takedowns, and account termination require explicit terms before activation.</p>
    <h2>Required buyer terms</h2><ul><li>Exact contents, compatibility, license, creator identity class, risk label, and price before checkout.</li><li>Receipt, download access, update expectations, refund eligibility, and support boundary.</li><li>Clear separation between a creator asset and separately licensed models, engines, datasets, or software.</li></ul>
    <h2>Required billing controls</h2><ul><li>Google account recovery and deletion paths.</li><li>Recurring-payment consent, renewal, cancellation, failed-payment, grace-period, and entitlement expiry.</li><li>Stripe-signed webhooks, idempotency, fixed server price allowlists, and tested customer-portal settings.</li><li>Stripe Connect onboarding, payout verification, refund/chargeback allocation, and seller tax reporting.</li></ul>
    <h2>Activation rule</h2><p>The public website may link to the separately deployed private marketplace only after that service passes test-mode transactions, adversarial authorization tests, moderation operations, rate limits, legal review, and owner approval. No commerce implementation or secret belongs in the public website repository.</p>
  </LegalShell>;
}
