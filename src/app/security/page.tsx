import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata(
  "Security boundary",
  "The planned security model for Spark Plug accounts, setup manifests, entitlements, and local outputs.",
  "/security",
);

export default function SecurityPage() {
  return (
    <LegalShell
      eyebrow="SECURITY MODEL / PRELAUNCH"
      title="Trust the wiring you can inspect."
      summary="The hosted launch service is designed as a narrow account and marketplace plane. It does not need broad access to the local broker, model credentials, or private outputs."
    >
      <h2>Service boundary</h2>
      <ul>
        <li>Vercel serves the site and server routes; secrets remain server-only.</li>
        <li>Supabase Row Level Security scopes private records to their owner.</li>
        <li>Stripe webhooks, not browser claims, authoritatively update paid entitlements.</li>
        <li>The local Spark Plug broker remains the authority for model capability facts and output provenance.</li>
      </ul>

      <h2>Setup manifest safety</h2>
      <p>
        Public setup packs should be declarative, versioned, checksummed, and scrubbed.
        The installer must show routes, dependencies, tools, requested filesystem or
        network access, and the publisher identity before mutation. Secret fields,
        host-specific paths, and session data are rejected at publication time.
      </p>

      <h2>Entitlements and payments</h2>
      <p>
        Product entitlements are derived from a server-owned subscription record.
        Client UI flags are presentation only and never authorize premium downloads,
        creator payouts, or private profile reads. Payment events are processed
        idempotently and retained with provider event identifiers for audit.
      </p>

      <h2>Report a vulnerability</h2>
      <p>
        Send a concise report, affected surface, reproduction steps, and expected
        impact to{" "}
        <a href="mailto:hello@gameworlds.ai?subject=Spark%20Plug%20security%20report">
          hello@gameworlds.ai
        </a>. Do not include live credentials, private user data, or destructive proof.
      </p>
      <h2>Release qualification</h2>
      <p>
        Features are described as available only after source review, a clean
        installation check, and a real runtime canary. Work still crossing those
        gates is labeled qualifying or omitted from release claims.
      </p>
      <p>
        The public edition is produced from reviewed, allowlisted changes and a
        dedicated secret and provenance scrub. Private credentials, profiles,
        routes, node identities, histories, and internal addresses are never
        public release inputs.
      </p>
    </LegalShell>
  );
}
