import { LegalShell } from "../../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Open-source software license", "Apache-2.0 licensing and verified Spark Plug release responsibilities.", "/legal/software");

export default function SoftwareTermsGatePage() {
  return <LegalShell eyebrow="OPEN SOURCE / APACHE-2.0" title="Free to use, inspect, modify, and share." summary="Spark Plug repository source is licensed under Apache License 2.0. Official installers are free distributions of the same reviewed source and include their applicable notices.">
    <h2>License</h2><p>The repository LICENSE file is the authoritative Apache-2.0 grant and warranty disclaimer. Third-party engines, models, datasets, artwork, and dependencies keep their own licenses and notices.</p>
    <h2>Operator responsibility</h2><p>Users remain responsible for hardware changes, credentials, model and dataset licenses, third-party tools, requested permissions, prompts, and outputs. The final agreement must distinguish user responsibility from defects or obligations that applicable law does not permit GameWorlds LLC to disclaim.</p>
    <h2>Release rule</h2><p>An installer remains blocked until it matches a tagged GitHub commit and publishes its checksum, signature, notices, supported-platform evidence, install and removal instructions, release notes, and known limitations.</p>
  </LegalShell>;
}
