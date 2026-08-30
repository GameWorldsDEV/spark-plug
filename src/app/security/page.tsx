import { detailMetadata } from "@/lib/metadata";
import { LegalShell } from "../_components/legal-shell";

export const metadata = detailMetadata(
  "Security boundary",
  "What the current Spark Plug preview site does, and the security boundary the public node release must pass.",
  "/security",
);

export default function SecurityPage() {
  return (
    <LegalShell
      eyebrow="SECURITY BOUNDARY / UPDATED AUGUST 30, 2026"
      title="Separate what is live from what is planned."
      summary="This preview is a public website, not a remote control plane for your node. The public software release must preserve node-owned authentication and keep private runtime state out of the public repository."
    >
      <h2>This website today</h2>
      <ul>
        <li>Vercel serves this no-index preview and its server routes.</li>
        <li>There is no public product account, payment checkout, marketplace, or node connection on this site.</li>
        <li>The download cards read a public release manifest and remain disabled until a verified artifact is published.</li>
        <li>Platform highlighting happens in the browser and is not stored or sent to a Spark Plug account.</li>
        <li>This site does not need node credentials, local prompts, model files, or private outputs.</li>
      </ul>

      <h2>The node and client boundary</h2>
      <p>
        A Spark Plug account belongs to a specific node. Discovery may locate that
        node, but it does not authenticate a client. Enrollment and credentials use
        the node&rsquo;s reviewed HTTPS path. Optional Tailscale connectivity can make
        the node reachable; it does not replace Spark Plug authentication.
      </p>

      <h2>Runtime authority</h2>
      <p>
        The broker on the node is authoritative for the active profile, engine and
        model state, queue state, memory admission, and output provenance. A client
        must not convert an accepted request into a false &ldquo;ready&rdquo; state or
        invent model capabilities that the engine did not report.
      </p>

      <h2>Routing authority</h2>
      <p>
        Compatible harnesses submit work to GW Broker. When automatic text routing
        is enabled, NVIDIA NeMo Switchyard may recommend a candidate from the active
        profile, but the broker retains authentication, admission, and final route
        authority. Explicit engine and model routes bypass that advisory step. Media
        jobs use separate typed ComfyUI endpoints.
      </p>

      <h2>Rabbit R1 boundary</h2>
      <p>
        Requests initiated on Rabbit R1 traverse Rabbit&rsquo;s third-party service
        before reaching the user&rsquo;s computer. The integration remains labeled in
        qualification and must not be described as end-to-end local. Local broker
        and engine execution begins only after that transport boundary.
      </p>

      <h2>Public release controls</h2>
      <p>
        Public source is extracted into a clean repository through an allowlisted
        review. Credentials, profiles, prompts, outputs, histories, node identities,
        addresses, private routes, internal paths, and deployment topology are
        excluded. Installer artifacts must be versioned and checksummed, show their
        requested changes, and pass preflight checks before mutating a node.
      </p>

      <h2>Report a vulnerability</h2>
      <p>
        Send the affected surface, reproduction steps, and expected impact to{" "}
        <a href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20security%20report">
          hello@gameworlds.ai
        </a>. Do not include live credentials, private user data, or destructive proof.
      </p>

      <h2>Claim qualification</h2>
      <p>
        A feature is a public release claim only after source review, installation
        validation on the supported target, and a real runtime canary. Work still
        crossing those gates is labeled in qualification or omitted.
      </p>
    </LegalShell>
  );
}
