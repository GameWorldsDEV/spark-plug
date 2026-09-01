import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Marketplace and community rules", "Free-profile publishing, moderation, reporting, and Community Leader boundaries.", "/legal/marketplace");

export default function MarketplaceRulesPage() {
  return <LegalShell eyebrow="MARKETPLACE RULES / ACTIVATION GATED" title="Free profiles still require proof, review, and a safe way to report problems." summary="Everyone may browse approved profiles. Only active Pro accounts and GameWorlds Official may submit up to ten free profiles. Publication is never automatic.">
    <h2>Submission requirements</h2><p>Publishers must have rights to the text, configuration, artwork, model references, and license information they submit. Profiles must be declarative, revision pinned, checksummed, provenance labeled, and free of scripts, secrets, credentials, commands, and private paths.</p>
    <h2>Moderation</h2><p>GameWorlds LLC may hold, reject, label, remove, or request changes to protect users, comply with law, respond to security issues, or enforce these rules. Reports and appeals must identify the profile/version and reason without including private node data.</p>
    <h2>Community conduct</h2><p>No malware, credential theft, deceptive capability claims, harassment, impersonation, license laundering, privacy invasion, artificial metrics, or evasion of review. Verification and Community Leader recognition do not endorse every submission or bypass moderation.</p>
    <h2>No marketplace sales</h2><p>The first commercial marketplace is free-only. Paid listings, marketplace checkout, orders, fees, Connect accounts, and creator payouts remain disabled.</p>
  </LegalShell>;
}

