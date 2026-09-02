import Image from "next/image";

import styles from "./marketplace-section.module.css";

export const marketplaceProfiles = [
  {
    name: "Code Bench",
    purpose: "Fast coding + deeper review",
    engines: "vLLM + Colibri",
    config: "2 models · broker routes · editable context",
  },
  {
    name: "Creative Studio",
    purpose: "Text, image, video, and 3D",
    engines: "vLLM + ComfyUI",
    config: "2 engines · media queue · editable memory",
  },
  {
    name: "Research Lane",
    purpose: "Long-running reports and analysis",
    engines: "Colibri + GW Broker",
    config: "Background queue · saved route · editable limits",
  },
] as const;

const engineSources = [
  ["vLLM", "QUALIFIED FIRST"],
  ["Colibri", "WORKING BUILD"],
  ["ComfyUI", "WORKING BUILD"],
  ["MLX", "APPLE NODE ROADMAP"],
  ["Ollama", "PLANNED"],
] as const;

export function MarketplaceSection() {
  return (
    <section className={styles.section} id="marketplace" aria-labelledby="marketplace-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>COMMUNITY PROFILE LIBRARY / GITHUB</p>
          <h2 id="marketplace-title">Start with a profile. Make it yours.</h2>
        </div>
        <div className={styles.intro}>
          <strong>CURATED FOR SPARK PLUG</strong>
          <p>
            A free, open catalog of reusable LLM profiles with engine requirements,
            model choices, memory budgets, queues, and routes already organized.
            Review the configuration, edit every setting, then let GW Broker check
            capacity before anything loads.
          </p>
          <small>Profiles will be downloaded from GitHub after public review. No account, paywall, or paid listing.</small>
        </div>
      </div>

      <div className={styles.profileGrid} aria-label="Illustrative curated profile previews">
        {marketplaceProfiles.map((profile, index) => (
          <article key={profile.name}>
            <header><span>PROFILE {String(index + 1).padStart(2, "0")}</span><b>CURATION PREVIEW</b></header>
            <h3>{profile.name}</h3>
            <p>{profile.purpose}</p>
            <dl>
              <div><dt>ENGINES</dt><dd>{profile.engines}</dd></div>
              <div><dt>CONFIGURATION</dt><dd>{profile.config}</dd></div>
            </dl>
            <button type="button" disabled>COMMUNITY PROFILE COMING SOON</button>
          </article>
        ))}
      </div>

      <div className={styles.modelSource}>
        <div className={styles.huggingFace}>
          <Image src="/integrations/hugging-face.svg" width={112} height={112} alt="" unoptimized />
          <div>
            <p>HUGGING FACE MODEL SOURCE</p>
            <h3>Choose the engine. Bring the right model.</h3>
            <span>
              Browse model weights for the engine you plan to run, review each model&rsquo;s
              license and requirements, then add it to an editable Spark Plug profile.
            </span>
          </div>
        </div>
        <ul aria-label="Engine-specific model lanes">
          {engineSources.map(([engine, status]) => <li key={engine}><strong>{engine}</strong><span>{status}</span></li>)}
        </ul>
        <p className={styles.boundary}>
          Hugging Face is a model source, not a Spark Plug partner. Compatibility,
          quantization, license terms, and memory fit remain model- and engine-specific.
        </p>
      </div>
    </section>
  );
}
