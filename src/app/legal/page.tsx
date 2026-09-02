import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Legal hub", "Spark Plug public notices, policies, and activation gates.", "/legal");

const pages = [
  ["/terms", "Preview Terms", "Current website conditions and product-release boundaries."],
  ["/privacy", "Privacy Notice", "Website, hosting, and voluntary-support data boundaries."],
  ["/security", "Security", "Node authority, website boundaries, disclosure, and release controls."],
  ["/trademarks", "Trademarks", "Brand ownership, compatibility, and non-affiliation."],
  ["/accessibility", "Accessibility", "Accessibility goals, testing, and feedback."],
  ["/support", "Support Policy", "Help channels, voluntary financial support, and refund contacts."],
  ["/community-leaders", "Community Leaders", "Earned recognition, review, expiry, removal, and appeals."],
  ["/legal/software", "Open-source license", "Apache-2.0, third-party notices, and verified release requirements."],
  ["/legal/marketplace", "Marketplace rules", "Creator licensing, review, reporting, sales, and conduct."],
  ["/legal/refunds", "Marketplace support & refunds", "Compatibility evidence, creator cure, escalation, abandonment, and refund review."],
  ["/legal/commercial", "Commercial activation gate", "Pro, billing, creator sales, payouts, and buyer protections."],
  ["/docs", "Third-party notices", "Engine, model, tool, and profile license responsibilities."],
] as const;

export default function LegalPage() {
  return <LegalShell eyebrow="GAMEWORLDS LLC / MARYLAND" title="One place for every public boundary." summary="Spark Plug keeps its local core free and open source. These pages separate today&rsquo;s accountless preview from the planned optional Pro service and moderated creator marketplace.">
    <h2>Current policies</h2><ul>{pages.map(([href, title, copy]) => <li key={href}><Link href={href}><strong>{title}</strong></Link> — {copy}</li>)}</ul>
    <h2>Release gate</h2><p>Source is governed by the repository license. Binary releases activate only when their notices, provenance, checksums, signatures, compatibility evidence, and support boundaries are published with the matching GitHub tag.</p>
  </LegalShell>;
}
