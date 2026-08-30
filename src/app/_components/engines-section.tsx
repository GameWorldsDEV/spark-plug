import Image from "next/image";

import styles from "./engines-section.module.css";

export const engineCards = [
  { name: "vLLM", status: "QUALIFIED FIRST", detail: "DGX SPARK / LINUX", logo: "/engines/vllm.svg", copy: "The first qualified concurrent inference runtime for DGX Spark, with model, context, parser, streaming, residency, and memory controls." },
  { name: "Colibri", status: "WORKING BUILD", detail: "INDEPENDENT TEXT LANE", logo: "/engines/colibri.svg", copy: "A separate text and reasoning lane for slow, large, or background workloads. Its queue, lifecycle, settings, and memory cost remain independently visible." },
  { name: "ComfyUI", status: "WORKING BUILD", detail: "MEDIA WORKFLOWS", logo: "/engines/comfyui.svg", copy: "Image, video, 3D, and custom audio workflows run through their own queue, memory policy, progress states, and returned asset records." },
  { name: "MLX", status: "PLANNED", detail: "APPLE SILICON NODES", logo: "/engines/mlx.svg", copy: "A planned engine contract for future Mac nodes, centered on Apple Silicon and published only after the node, runtime, and installer are qualified together." },
  { name: "Ollama", status: "PLANNED", detail: "PENDING PLATFORM QUALIFICATION", logo: "/engines/ollama.svg", copy: "A planned runtime option for additional node classes. Platform support is not claimed until its engine and installer contracts pass qualification." },
] as const;

const telemetry = [
  { label: "Unified memory", value: "86 / 128 GB", state: "67% allocated" },
  { label: "Loaded models", value: "2 resident", state: "298K total context" },
  { label: "Queue pressure", value: "4 waiting", state: "2 running" },
  { label: "Power", value: "112 W", state: "node draw" },
] as const;

const recentEvents = [
  ["10:42:16", "vLLM", "ready"],
  ["10:42:03", "ComfyUI", "job running"],
  ["10:41:48", "Colibri", "queue admitted"],
] as const;

export function EnginesSection() {
  return (
    <section className={styles.section} id="engines" aria-labelledby="engines-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>PROFILE-CONTROLLED RUNTIMES</p>
          <h2 id="engines-title">Every engine. Its own controls.</h2>
        </div>
        <p>A Spark Plug profile can coordinate several engines at once without flattening them into one generic runtime. Each keeps its own settings, health, queue, lifecycle, and memory cost.</p>
      </div>

      <div className={styles.engineGrid}>
        {engineCards.map((engine, index) => (
          <article className={styles.engineCard} key={engine.name} data-status={engine.status.toLowerCase()}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><strong>{engine.status}</strong></header>
            <div className={styles.logoBox}>
              <Image src={engine.logo} width={240} height={72} alt={`${engine.name} logo`} unoptimized />
            </div>
            <p className={styles.engineDetail}>{engine.detail}</p>
            <p className={styles.engineCopy}>{engine.copy}</p>
          </article>
        ))}
      </div>

      <div className={styles.capacity}>
        <div className={styles.capacityIntro}>
          <p className={styles.eyebrow}>CAPACITY + NODE TELEMETRY</p>
          <h3>See the whole machine before you change it.</h3>
          <p>GW Broker evaluates selected engines, resident models, context, queued work, supporting services, and protected headroom before a profile can change runtime state.</p>
          <div className={styles.localBoundary}>
            <span aria-hidden="true">●</span>
            <p>Node telemetry, capacity information, and logs remain on the Spark Plug node by default.</p>
          </div>
        </div>

        <div className={styles.dashboard} aria-label="Illustrative Spark Plug node telemetry">
          <header className={styles.dashboardHeader}>
            <div><i aria-hidden="true" /><span>NODE READY</span></div>
            <p>ILLUSTRATIVE LIVE SNAPSHOT</p>
          </header>
          <div className={styles.telemetryGrid}>
            {telemetry.map((metric) => (
              <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.state}</small></article>
            ))}
          </div>
          <div className={styles.memoryLedger}>
            <div><span>UNIFIED MEMORY / EXAMPLE</span><strong>42 GB FREE</strong></div>
            <div className={styles.memoryMeter} role="progressbar" aria-label="Illustrative unified memory allocation" aria-valuemin={0} aria-valuemax={128} aria-valuenow={86}>
              <i /><i /><i /><i />
            </div>
            <ul aria-label="Illustrative memory allocation legend">
              <li><i />vLLM</li><li><i />Colibri</li><li><i />Media</li><li><i />Protected</li>
            </ul>
          </div>
          <div className={styles.runtimeStrip}>
            <div><span>Runtime health</span><strong>3 READY · 1 WARMING</strong></div>
            <div><span>Recent events</span><strong>LOGS LOCAL</strong></div>
          </div>
          <ol className={styles.events} aria-label="Illustrative recent node events">
            {recentEvents.map(([time, engine, state]) => (
              <li key={`${time}-${engine}`}><time>{time}</time><strong>{engine}</strong><span>{state}</span></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
