import Link from "next/link";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import { githubSponsorsStatus, stripeSupportUrl } from "@/lib/support-links";

export const metadata = detailMetadata("Support the open-source project", "Community help, security contacts, and optional financial support boundaries.", "/support");

export default function SupportPage() {
  return <LegalShell eyebrow="OPEN-SOURCE SUPPORT / CLEAR BOUNDARIES" title="Help the project—or get help without guessing where to go." summary="GitHub community help, privacy requests, security reports, optional Stripe tips, and GitHub Sponsors each have a separate path. Software and profiles remain free either way.">
    <h2>Product support</h2><p>Email <a href="mailto:support@gameworlds.ai">support@gameworlds.ai</a>. Until dedicated aliases finish provisioning, messages may be copied to <a href="mailto:hello@gameworlds.ai">hello@gameworlds.ai</a>. No response-time or priority-support promise is sold.</p>
    <h2>Security and privacy</h2><p>Send vulnerabilities to <a href="mailto:security@gameworlds.ai">security@gameworlds.ai</a>. Send privacy requests to <a href="mailto:privacy@gameworlds.ai">privacy@gameworlds.ai</a>. Never email live credentials, private prompts, or destructive proof.</p>
    <h2>Optional one-time support</h2><p><a href={stripeSupportUrl} rel="noopener noreferrer">Support Spark Plug through Stripe ↗</a>. You choose the amount beginning at $1. This is voluntary support—not a software purchase, charitable contribution, investment, preorder, license, feature promise, priority, or governance right.</p>
    <p>Stripe hosts the payment page, processes payment and fraud-prevention information under its own notices, and provides the receipt. GameWorlds LLC may receive transaction, contact, status, and payout records needed to reconcile the support payment.</p>
    <p>For a duplicate or mistaken payment, contact <a href="mailto:support@gameworlds.ai?subject=Spark%20Plug%20support%20payment">support@gameworlds.ai</a> with the Stripe receipt identifier. Refunds required by law or approved for a payment error are returned through the original provider and method.</p>
    <h2>GitHub Sponsors</h2><p>GitHub Sponsors is <strong>{githubSponsorsStatus === "pending" ? "still pending approval" : "available"}</strong>. It will not be advertised as active until GitHub publishes the profile. GitHub sponsorships use GitHub and Stripe terms and are separate from direct Stripe support.</p>
    <h2>Before tipping</h2><p>Read the <Link href="/terms">Project Terms</Link> and <Link href="/privacy">Privacy Notice</Link>. Financial support does not unlock software, profiles, features, priority, status, or governance.</p>
  </LegalShell>;
}
