import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Commercial terms gate", "Billing, cancellation, refund, account, and Pro activation requirements.", "/legal/commercial");

export default function CommercialTermsGatePage() {
  return <LegalShell eyebrow="COMMERCIAL TERMS / NOT YET EFFECTIVE" title="Pro stays off until billing and account promises are complete." summary="The planned Pro price is $5 monthly or $48 annually. Preview does not accept Pro subscriptions or create product accounts.">
    <h2>Pro boundary</h2><p>Pro covers premium presentation packs, optional encrypted profile sync, version history, up to ten hosted free profiles, creator analytics, and opt-in early-release testing. It never gates the local core, security, accessibility, diagnostics, or offline operation.</p>
    <h2>Required billing terms</h2><ul><li>Recurring-payment consent, billing frequency, renewal, and receipt.</li><li>Cancellation timing, continued access, downgrade, and entitlement expiry.</li><li>Refund, mistaken charge, dispute, failed-payment, and grace-period handling.</li><li>Applicable taxes, currency, price changes, and notice.</li><li>Account export, deletion, retention, session revocation, and subscription closure.</li></ul>
    <h2>Live-mode rule</h2><p>`PAYMENTS_MODE=live` remains blocked until counsel-approved terms, fixed Stripe price IDs, portal settings, webhooks, downgrade tests, support operations, and GameWorlds LLC identity details are verified in production.</p>
  </LegalShell>;
}

