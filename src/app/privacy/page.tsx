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
      eyebrow="PREVIEW-SITE NOTICE / UPDATED AUGUST 30, 2026"
      title="What this site collects today."
      summary="This notice covers the current public preview. There are no public Spark Plug product accounts, payments, marketplace listings, software downloads, or node connections on this site."
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

      <h2>Rabbit R1 model viewer</h2>
      <p>
        The Rabbit R1 section loads an interactive 3D model from Sketchfab. When
        that section loads, the browser contacts Sketchfab and may send ordinary
        request information such as IP address, browser and device details,
        referrer, and time. The viewer is requested with Sketchfab&rsquo;s do-not-track
        option, but Sketchfab remains an independent third-party service governed
        by its own terms and privacy practices.
      </p>

      <h2>What this site does not collect by default</h2>
      <ul>
        <li>Local prompts, model conversations, or agent session history.</li>
        <li>Local model files, weights, credentials, or service tokens.</li>
        <li>Private output files or host and container filesystem paths.</li>
        <li>Private Spark Plug profiles, routes, node identities, or configuration.</li>
      </ul>

      <h2>Future services are not presented as active</h2>
      <p>
        If accounts, hosted profiles, payments, or a marketplace open later, this
        notice will be replaced or updated before those features collect data. Their
        required fields, purposes, processors, retention, and user controls are not
        presented here as current behavior.
      </p>

      <h2>Questions and requests</h2>
      <p>
        To ask about information sent by email, or request access, correction, or
        deletion where applicable, contact{" "}
        <a href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20privacy%20request">
          hello@gameworlds.ai
        </a>.
      </p>
    </LegalShell>
  );
}
