import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Community profile rules", "Free GitHub profile contributions, review, reporting, and licensing.", "/legal/marketplace");

export default function MarketplaceRulesPage() {
  return <LegalShell eyebrow="COMMUNITY PROFILE RULES" title="Free profiles still require proof, review, and a safe way to report problems." summary="Anyone may download approved profiles or propose one through a GitHub pull request. Publication is reviewed, never automatic.">
    <h2>Submission requirements</h2><p>Publishers must have rights to the text, configuration, artwork, model references, and license information they submit. Profiles must be declarative, revision pinned, checksummed, provenance labeled, and free of scripts, secrets, credentials, commands, and private paths.</p>
    <h2>Review</h2><p>Maintainers may hold, reject, label, remove, or request changes to protect users, comply with law, respond to security issues, or enforce these rules. Reports and appeals must identify the profile/version and reason without including private node data.</p>
    <h2>Community conduct</h2><p>No malware, credential theft, deceptive capability claims, harassment, impersonation, license laundering, privacy invasion, artificial metrics, or evasion of review. Verification and Community Leader recognition do not endorse every submission or bypass moderation.</p>
    <h2>No marketplace sales</h2><p>Profiles are community resources, not listings for sale. There is no marketplace checkout, account tier, fee, payout, or paid placement.</p>
  </LegalShell>;
}
