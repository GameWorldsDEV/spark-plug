import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata(
  "Privacy notice",
  "How the Spark Plug launch site handles waitlist, account, creator, and purchase information.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="PRELAUNCH NOTICE / UPDATED AUGUST 18, 2026"
      title="Privacy without mystery."
      summary="This notice describes the launch-site data boundary. It does not turn local Spark Plug outputs, prompts, routes, or credentials into cloud data."
    >
      <h2>What this site collects</h2>
      <p>
        The early-access form collects the email address you submit, the time of
        consent, and a short-lived one-way request fingerprint used to limit spam.
        The site host may also process ordinary security logs such as IP address,
        browser type, requested URL, and request time.
      </p>
      <p>
        When public accounts open, the service may also store profile details,
        public setup listings, subscription status, purchases, creator verification
        records, and payout state. Required fields and retention periods will be
        disclosed before account registration opens.
      </p>

      <h2>What this site does not collect by default</h2>
      <ul>
        <li>Local prompts, model conversations, or agent session history.</li>
        <li>Local model files, weights, credentials, or service tokens.</li>
        <li>Private output files or host/container filesystem paths.</li>
        <li>A private Spark Plug configuration unless you explicitly publish a scrubbed setup manifest.</li>
      </ul>

      <h2>How information is used</h2>
      <p>
        Waitlist information is used to send requested launch updates, prevent abuse,
        and measure basic signup reliability. Account and marketplace information will
        be used to provide the service, enforce ownership and entitlements, support
        creators, prevent fraud, and meet legal obligations.
      </p>

      <h2>Processors and transfers</h2>
      <p>
        The planned launch architecture uses Vercel to host the website and Supabase
        for application data and authentication. Stripe is the planned payment
        processor for paid subscriptions and creator purchases; card details should
        be entered directly into Stripe-hosted payment surfaces, not stored by Spark
        Plug. The final production processor list and regional terms will be published
        before paid access opens.
      </p>

      <h2>Control and requests</h2>
      <p>
        You can unsubscribe from launch messages using the link in an email. To ask
        for access, correction, or deletion, contact{" "}
        <a href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20privacy%20request">
          hello@gameworlds.ai
        </a>.
      </p>
    </LegalShell>
  );
}
