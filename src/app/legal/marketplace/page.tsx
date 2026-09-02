import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Marketplace rules", "Creator publishing, licensing, review, reporting, and future sales boundaries.", "/legal/marketplace");

export default function MarketplaceRulesPage() {
  return <LegalShell eyebrow="CREATOR MARKETPLACE RULES / DRAFT" title="Payment never replaces proof, review, or a safe way to report problems." summary="Everyone may use approved free listings. Planned Pro creators may submit free or paid assets, but publication is moderated and never automatic.">
    <h2>Submission requirements</h2><p>Publishers must have rights to the text, configuration, artwork, model references, and license information they submit. Profiles must be declarative, revision pinned, checksummed, provenance labeled, and free of scripts, secrets, credentials, commands, and private paths.</p>
    <h2>Review</h2><p>Maintainers may hold, reject, label, remove, or request changes to protect users, comply with law, respond to security issues, or enforce these rules. Reports and appeals must identify the profile/version and reason without including private node data.</p>
    <h2>Community conduct</h2><p>No malware, credential theft, deceptive capability claims, harassment, impersonation, license laundering, privacy invasion, artificial metrics, or evasion of review. Verification and Community Leader recognition do not endorse every submission or bypass moderation.</p>
    <h2>Sales remain disabled today</h2><p>The preview has no marketplace checkout, seller onboarding, payout, or paid placement. Before activation, every creator must accept seller terms and complete Stripe Connect onboarding. Every paid listing must show its creator, contents, price, platform fee, license, compatibility, refund boundary, and support expectations.</p>
    <h2>Model and dataset rights</h2><p>A profile cannot resell referenced model weights. LoRA adapters require documented rights for training data, base-model use, output, and commercial distribution. Infringing, deceptive, unsafe, or unverifiable assets may be rejected or removed, and a seller remains responsible for the rights they claim.</p>
  </LegalShell>;
}
