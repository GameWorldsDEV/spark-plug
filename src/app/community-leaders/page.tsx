import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Community Leaders", "Earned Spark Plug community recognition and review boundaries.", "/community-leaders");

export default function CommunityLeadersPage() {
  return <LegalShell eyebrow="COMMUNITY LEADERS / EARNED, NOT SOLD" title="Contribution earns recognition. Payment never buys trust." summary="Community Leader is a manually reviewed, time-limited recognition for sustained, constructive contribution to the Spark Plug community.">
    <h2>Selection criteria</h2><ul><li>Repeated, accurate help that respects local privacy and security boundaries.</li><li>Useful documentation, testing, accessible examples, issue triage, or reviewed profiles.</li><li>Constructive conduct and transparent disclosure of conflicts or affiliations.</li></ul>
    <h2>Recognition</h2><p>Active Leaders may receive a visible recognition badge and an invitation to the community feedback circle. The role grants no employment, partnership, endorsement, moderation authority, roadmap control, priority support, or profile-validation bypass.</p>
    <h2>Review and expiry</h2><p>Every recognition records its reviewer, review date, contribution summary, and expiry. GameWorlds LLC may expire or revoke recognition for inactivity, misleading conduct, policy violations, security concerns, or abuse. The member may appeal through support@gameworlds.ai.</p>
    <h2>Never for sale</h2><p>There is no paid tier and financial support never grants Leader status. Recognition is based only on reviewed community contribution.</p>
  </LegalShell>;
}
