import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata(
  "Terms preview",
  "Prelaunch operating terms for the Spark Plug website, software, and community marketplace.",
  "/terms",
);

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="PRELAUNCH TERMS / REVIEW DRAFT"
      title="Clear rules for shared setups."
      summary="These are transparent prelaunch terms for review. Final consumer, subscription, and marketplace terms must be published before accounts or payments open."
    >
      <h2>The software and the service</h2>
      <p>
        Spark Plug includes locally operated software and an optional hosted website
        for accounts, subscriptions, public profiles, and setup discovery. The free
        community program is separate from optional Pro visual features and the Pro+
        creator marketplace.
      </p>

      <h2>Your systems and content</h2>
      <p>
        You control the models, hardware, tools, prompts, and outputs you operate.
        You are responsible for securing those systems, reviewing requested setup
        permissions, following model and software licenses, and ensuring that your
        use complies with applicable law and the rights of others.
      </p>

      <h2>Community and creator listings</h2>
      <ul>
        <li>Only publish content and configurations you have the right to distribute.</li>
        <li>Never include credentials, private paths, user data, session history, or customer outputs.</li>
        <li>Disclose dependencies, permissions, routes, and material compatibility limitations.</li>
        <li>Do not claim affiliation or endorsement that does not exist.</li>
        <li>Paid listings require creator verification and published payout/refund terms.</li>
      </ul>

      <h2>Availability and changes</h2>
      <p>
        Prelaunch software may change, pause, or contain defects. No preview statement
        guarantees a release date, compatibility target, marketplace fee, or feature.
        Material paid-plan changes will be disclosed before renewal and handled under
        the final subscription terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20terms">
          hello@gameworlds.ai
        </a>.
      </p>
    </LegalShell>
  );
}
