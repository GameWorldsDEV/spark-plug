import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Legal hub", "Spark Plug public notices, policies, and activation gates.", "/legal");

const pages = [
  ["/terms", "Preview Terms", "Current website conditions and product-release boundaries."],
  ["/privacy", "Privacy Notice", "Website, hosting, support-payment, and future-service data boundaries."],
  ["/security", "Security", "Node authority, website boundaries, disclosure, and release controls."],
  ["/trademarks", "Trademarks", "Brand ownership, compatibility, and non-affiliation."],
  ["/accessibility", "Accessibility", "Accessibility goals, testing, and feedback."],
  ["/support", "Support Policy", "Help channels, voluntary financial support, and refund contacts."],
  ["/community-leaders", "Community Leaders", "Earned recognition, review, expiry, removal, and appeals."],
  ["/legal/software", "Software terms gate", "License, acceptable use, warranty, release, and support requirements."],
  ["/legal/commercial", "Commercial terms gate", "Pro billing, cancellation, refund, account, and deletion requirements."],
  ["/legal/marketplace", "Marketplace rules", "Free publishing, licensing, moderation, reporting, and conduct."],
  ["/docs", "Third-party notices", "Engine, model, tool, and profile license responsibilities."],
] as const;

export default function LegalPage() {
  return <LegalShell eyebrow="GAMEWORLDS LLC / MARYLAND" title="One place for every public boundary." summary="Preview notices apply today. Product, billing, marketplace, and account terms become effective only when the corresponding stage is activated and counsel-approved details are published.">
    <h2>Current policies</h2><ul>{pages.map(([href, title, copy]) => <li key={href}><Link href={href}><strong>{title}</strong></Link> — {copy}</li>)}</ul>
    <h2>Promotion gate</h2><p>GameWorlds LLC’s exact registered address, venue, consumer disclosures, dispute language, and release-specific software terms require counsel approval before Software Release or Commercial promotion. The website must not replace missing details with invented legal language.</p>
  </LegalShell>;
}
