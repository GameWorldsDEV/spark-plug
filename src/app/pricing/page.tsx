import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { communityFeatures, creatorAssetTypes, PRO_ANNUAL_USD, PRO_MONTHLY_USD, proFeatures } from "@/lib/plans";
import styles from "./pricing.module.css";

export const metadata = detailMetadata(
  "Community and Pro",
  "The free local Spark Plug core and the planned Pro creator marketplace.",
  "/pricing",
);

export default function PricingPage() {
  return (
    <LegalShell
      eyebrow="COMMUNITY + PRO / COMMERCIAL PREVIEW"
      title="Own the machine. Build a business around the work."
      summary="The local Spark Plug core stays free and open source. Pro funds the optional hosted creator marketplace, premium presentation library, publishing tools, and services that have real operating costs."
    >
      <div className={styles.gate} role="status">
        <strong>NOT ACCEPTING PRO PAYMENTS YET</strong>
        <p>Google sign-in, subscriptions, seller onboarding, checkout, and payouts activate only after test-mode, legal, moderation, and security review.</p>
      </div>

      <div className={styles.plans} aria-label="Spark Plug plans">
        <article>
          <p>OPEN-SOURCE CORE</p>
          <h2>Community</h2>
          <div className={styles.price}><strong>$0</strong><span>forever</span></div>
          <ul>{communityFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <Link href="/download">Download from GitHub ↗</Link>
        </article>
        <article className={styles.pro}>
          <p>CREATOR + PRESENTATION</p>
          <h2>Pro</h2>
          <div className={styles.price}><strong>${PRO_MONTHLY_USD}</strong><span>/ month</span></div>
          <small>or ${PRO_ANNUAL_USD} billed yearly</small>
          <ul>{proFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <button type="button" disabled aria-label="Google sign-in and Pro subscriptions coming soon">GOOGLE SIGN-IN / COMING SOON</button>
        </article>
      </div>

      <h2>What creators can publish</h2>
      <div className={styles.assets} aria-label="Planned creator asset types">
        {creatorAssetTypes.map((asset) => <article key={asset}><span>SELL OR SHARE</span><h3>{asset}</h3></article>)}
      </div>
      <p>Each approved listing may be free or paid. Paid sales use Stripe Connect seller onboarding and a clearly disclosed platform fee. The percentage, minimum price, refund rules, payout schedule, and tax responsibilities are not final and will be shown before any creator agrees to sell.</p>

      <h2>What Pro never owns</h2>
      <p>Pro never gates local inference, security, accessibility, diagnostics, profiles stored on your machine, engine support, routing, queues, ComfyUI, remote clients, or local Unsloth/LoRA tools. Losing Pro removes hosted and premium services—not the user&rsquo;s local work.</p>

      <h2>Storage boundary</h2>
      <p>The hosted service stores only the account, listing metadata, reviewed distributable packages, purchases, payout state, and narrow analytics needed to operate the marketplace. Prompts, outputs, node credentials, private routes, model inventory, and local telemetry stay off the marketplace.</p>
    </LegalShell>
  );
}
