import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Software release terms gate", "Terms that must be approved before Spark Plug installers activate.", "/legal/software");

export default function SoftwareTermsGatePage() {
  return <LegalShell eyebrow="SOFTWARE TERMS / NOT YET EFFECTIVE" title="No installer activates before its license and responsibilities are readable." summary="This page records the Release-stage legal gate. It is not a substitute for counsel-approved product terms or a grant of rights to unreleased software.">
    <h2>Required release documents</h2><ul><li>Chosen software license or EULA and third-party notices.</li><li>Supported-use and acceptable-use rules.</li><li>Warranty disclaimer and limitation of liability.</li><li>Update, compatibility, support, and end-of-support policy.</li><li>Model, engine, dataset, prompt, and output responsibilities.</li><li>Maryland governing-law, venue, consumer, and dispute provisions approved for GameWorlds LLC.</li></ul>
    <h2>Operator responsibility</h2><p>Users remain responsible for hardware changes, credentials, model and dataset licenses, third-party tools, requested permissions, prompts, and outputs. The final agreement must distinguish user responsibility from defects or obligations that applicable law does not permit GameWorlds LLC to disclaim.</p>
    <h2>Activation rule</h2><p>The Release stage remains blocked until the final software terms identify the exact release, effective date, contracting address, license grant, support boundary, and required notices.</p>
  </LegalShell>;
}

