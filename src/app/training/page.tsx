import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Local training roadmap", "Planned Unsloth and LoRA training boundaries in Spark Plug.", "/training");

export default function TrainingPage() {
  return <LegalShell eyebrow="LOCAL TRAINING / ROADMAP" title="Train locally only after the data, model, and capacity pass review." summary="Unsloth and LoRA are planned local workflows—not an active hosted training service or first-release promise.">
    <h2>Planned workflow</h2><p>Select a compatible base model and dataset, validate rights and formats, calculate capacity, run the local job, record provenance, and return a versioned adapter.</p>
    <h2>Required gates</h2><ul><li>Dataset ownership, permission, and sensitive-data review.</li><li>Base-model license and adapter compatibility.</li><li>Capacity, output-path, checkpoint, and recovery validation.</li><li>Adapter checksum, source revisions, settings, and provenance.</li></ul>
    <h2>No hosted training</h2><p>Prompts, datasets, checkpoints, models, and adapters are not accepted by this public website. Hosted training remains disabled in every current launch stage.</p>
  </LegalShell>;
}
