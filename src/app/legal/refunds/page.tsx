import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Marketplace support and refunds", "Creator support, compatibility evidence, escalation, abandonment, and refund review.", "/legal/refunds");

export default function RefundPolicyPage() {
  return <LegalShell eyebrow="MARKETPLACE SUPPORT + REFUNDS / DRAFT" title="Tested compatibility first. Creator support next. Independent review when needed." summary="This draft describes the intended operational workflow. It is not effective until counsel review, seller acceptance, buyer disclosure, and commerce activation are complete.">
    <h2>Before purchase</h2><p>Every paid listing must state exactly what is included and identify each computer, operating system, architecture, memory configuration, GPU or accelerator, engine version, model revision, and date the creator tested. Buyers should run Spark Plug&rsquo;s local preflight and compare the result before purchase and installation.</p>
    <h2>What is not automatically a defect</h2><p>Local AI performance varies by hardware, memory, drivers, engines, model files, operating systems, and user changes. A listing failing on an unlisted or materially changed configuration is not by itself proof that the creator&rsquo;s package is defective.</p>
    <h2>Creator cure process</h2><ol><li>The buyer opens a case against the exact purchased version and shares a scrubbed preflight report and reproducible error.</li><li>The creator provides first-line troubleshooting and, when appropriate, a correction or revision.</li><li>The marketplace records messages, revisions, compatibility evidence, and the outcome.</li><li>If unresolved, the buyer or creator escalates the case to GameWorlds administrators.</li></ol>
    <h2>When a refund may be approved</h2><p>A refund may be approved when applicable law requires it; when GameWorlds reproduces a material defect on a configuration the creator declared supported and the creator cannot correct it after a reasonable cure opportunity; or when the creator abandons the listing or the open support case. A fixed response and cure period will be published in the effective policy before sales activate.</p>
    <h2>Abandonment</h2><p>A listing may be marked abandoned when the creator removes required support, fails to respond within the published period, cannot maintain required access, or leaves a confirmed defect unresolved. GameWorlds may suspend sales, preserve buyer access to lawful prior downloads, issue eligible refunds, or remove the listing.</p>
    <h2>Mandatory rights</h2><p>Nothing in this policy limits non-waivable consumer, payment-card, fraud, or other legal rights. Chargebacks and payment-provider processes remain available under their own rules. Final terms require counsel approval before live sales.</p>
    <h2>Contact</h2><p>Marketplace cases will use an authenticated case system. Until that launches, policy questions may be sent to <a href="mailto:support@gameworlds.ai?subject=Spark%20Plug%20marketplace">support@gameworlds.ai</a>.</p>
  </LegalShell>;
}
