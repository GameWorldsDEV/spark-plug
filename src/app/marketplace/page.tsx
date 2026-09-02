import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { currentLaunch } from "@/lib/launch-stage";

export const metadata = detailMetadata("Creator marketplace", "Free and paid Spark Plug profiles, themes, motion packs, and rights-cleared LoRA adapters.", "/marketplace");

export default function MarketplacePage() {
  return <LegalShell eyebrow={`${currentLaunch.stage.toUpperCase()} / CREATOR MARKETPLACE`} title="Share the setup. Sell the craft—not control of the machine." summary="Everyone can browse and install approved free releases. Planned Pro accounts may publish free or paid profiles, themes, motion packs, and rights-cleared LoRA adapters after review.">
    <h2>Commercial preview</h2><p>The cards on the homepage are examples. Accounts, publishing, sales, subscriptions, seller onboarding, and payouts are not active yet. <Link href="/pricing">Review the planned Community and Pro boundary</Link>.</p>
    <h2>Profiles are configuration—not plug-ins</h2><p>Submissions must be declarative, schema validated, revision pinned, checksummed, licensed, provenance labeled, and reviewed. They cannot contain scripts, credentials, secrets, host paths, commands, or private output references.</p>
    <h2>Open in Spark Plug</h2><ol><li>A creator exports a scrubbed profile from Spark Plug or builds one with the planned Pro website editor.</li><li>The marketplace validates, versions, signs, and reviews the profile document.</li><li>After a free download or purchase, the document opens in Spark Plug and displays every imported setting before approval.</li><li>GW Broker checks the user&rsquo;s engines and local model inventory. Missing models receive a clear acquisition plan with their source, pinned revision, files, license, size, memory fit, and checksum.</li><li>The user approves any model download and edits or saves the profile. Import never starts a model or job automatically.</li></ol>
    <h2>Free and paid listings</h2><p>A Pro creator may choose $0.00 or an approved one-time price for each listing. Stripe Connect will handle identity and payout onboarding. Spark Plug&rsquo;s platform percentage, payment fees, refund rules, payout schedule, and tax responsibilities must be disclosed before seller activation.</p>
    <h2>Models, adapters, and licenses</h2><p>A profile may reference compatible models without reselling their weights. A LoRA adapter may be distributed only when the creator has rights to its training data, base-model use, output, artwork, and commercial distribution. Every listing identifies what is included and what the buyer must obtain separately.</p>
    <h2>Low-call design</h2><p>The local app does not continuously phone home. Catalog metadata uses cache and update deltas; Pro status uses a short signed snapshot stored locally; Stripe webhooks update billing state; and paid packages use short-lived download grants. Network calls happen when a user signs in, browses, buys, downloads, publishes, views creator analytics, or explicitly refreshes near entitlement expiry.</p>
    <h2>Themes and motion</h2><p><Link href="/themes">Explore the Themes page</Link> for the bundled $0.00 collection and future Pro presentation packs.</p>
    <h2>Review, reporting, and takedowns</h2><p>Publication remains moderated. Checksums, risk labels, review notes, version history, reports, removals, appeals, refunds, and takedowns stay auditable. Payment or creator verification never bypasses technical validation.</p>
  </LegalShell>;
}
