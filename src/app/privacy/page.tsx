import { detailMetadata } from "@/lib/metadata";
import { LegalShell } from "../_components/legal-shell";

export const metadata = detailMetadata(
  "Privacy notice",
  "What the current Spark Plug preview site does and does not collect.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="PREVIEW-SITE NOTICE / UPDATED AUGUST 31, 2026"
      title="What this site collects today."
      summary="This preview is still accountless today. Planned Google sign-in, Pro subscriptions, and creator sales remain disabled until a separate commercial privacy notice and tested controls are ready."
    >
      <h2>Information you send</h2>
      <p>
        The current homepage does not include an account or email signup form.
        If you contact hello@gameworlds.ai using your own email application, your
        email provider and the recipient&rsquo;s email service process whatever
        information you choose to send.
      </p>

      <h2>Platform detection</h2>
      <p>
        The release section reads the browser&rsquo;s platform and user-agent values to
        highlight the most relevant download card. This check runs in the browser,
        does not create a persistent identifier, and is not submitted to a Spark Plug
        product account. No download link activates until a verified artifact exists.
      </p>

      <h2>Hosting data</h2>
      <p>
        Vercel hosts this website and may process ordinary request and security data,
        such as IP address, browser and device information, requested URL, and time.
        The site does not use advertising trackers and does not set a product account
        or analytics cookie.
      </p>

      <h2>Optional Stripe support</h2>
      <p>
        If you choose the Support link, your browser leaves this site for a Stripe-hosted
        payment page. Stripe processes payment, contact, device, fraud-prevention, and
        receipt information under its own notices. GameWorlds LLC may receive transaction,
        contact, payment-status, receipt, and payout records needed to reconcile the
        voluntary payment. A support payment does not unlock software, features, status,
        service, or governance.
      </p>

      <h2>Marketplace and model-source preview</h2>
      <p>
        The marketplace cards and model-source marks on this preview are static,
        locally hosted explanations. They do not contact Hugging Face, open a public
        hosted marketplace account, or download a profile or model. A future user-initiated
        profile or model download will have its own source, license, account, network,
        and privacy boundary.
      </p>

      <h2>What this site does not collect by default</h2>
      <ul>
        <li>Local prompts, model conversations, or agent session history.</li>
        <li>Local model files, weights, credentials, or service tokens.</li>
        <li>Private output files or host and container filesystem paths.</li>
        <li>Private Spark Plug profiles, routes, node identities, or configuration.</li>
      </ul>

      <h2>Planned optional hosted account</h2>
      <p>
        The local Community product will not require an account, subscription,
        entitlement check, or cloud profile store. A future optional Pro account may
        use Google identity, Stripe billing, marketplace listings, purchases, payouts,
        and narrow creator analytics. Those services stay disabled until retention,
        deletion, processor, sharing, security, and user-rights terms are published.
      </p>

      <h2>Questions and requests</h2>
      <p>
        To ask about information sent by email, or request access, correction, or
        deletion where applicable, contact{" "}
        <a href="mailto:privacy@gameworlds.ai?subject=Spark%20Plug%20privacy%20request">
          privacy@gameworlds.ai
        </a>.
      </p>
    </LegalShell>
  );
}
