import Image from "next/image";

import styles from "./comfy-section.module.css";

export const comfyCapabilities = [
  ["IMAGE", "Saved workflow"],
  ["VIDEO", "Queued render"],
  ["3D", "TRELLIS workflow"],
  ["AUDIO", "Imported or custom workflow"],
] as const;

export const comfyQueueStates = [
  ["WAITING", "Product turntable", "03"],
  ["RUNNING", "Scene extension", "62%"],
  ["READY", "Material study", "4 files"],
  ["FAILED", "Audio variation", "held"],
] as const;

export function ComfySection() {
  return (
    <section className={styles.section} id="media" aria-labelledby="comfy-title">
      <div className={styles.heading}>
        <div className={styles.logoLockup}>
          <Image src="/engines/comfyui.svg" width={408} height={114} alt="ComfyUI logo" unoptimized />
          <span>WORKING BUILD</span>
        </div>
        <div>
          <p className={styles.eyebrow}>COMFYUI / DEDICATED MEDIA RUNTIME</p>
          <h2 id="comfy-title">Your ComfyUI workflows, managed from Spark Plug.</h2>
          <p className={styles.lead}>
            Connect ComfyUI to Spark Plug and give visual generation a visible
            queue, explicit memory decisions, preferred workflows, and durable
            returned assets.
          </p>
        </div>
      </div>

      <div className={styles.workspace}>
        <div className={styles.console} aria-label="Illustrative ComfyUI queue in Spark Plug">
          <header>
            <div><i aria-hidden="true" /><span>COMFYUI / CONNECTED</span></div>
            <strong>QUEUE 04</strong>
          </header>

          <div className={styles.workflowTypes}>
            {comfyCapabilities.map(([kind, detail]) => (
              <article key={kind}>
                <span>{kind}</span>
                <p>{detail}</p>
              </article>
            ))}
          </div>

          <div className={styles.queue}>
            <div className={styles.queueHead}>
              <span>STATE</span><span>WORKFLOW</span><span>RESULT</span>
            </div>
            {comfyQueueStates.map(([state, job, result]) => (
              <article key={state} data-state={state.toLowerCase()}>
                <span><i aria-hidden="true" />{state}</span>
                <strong>{job}</strong>
                <small>{result}</small>
                {state === "RUNNING" && (
                  <div
                    className={styles.jobProgress}
                    role="progressbar"
                    aria-label="Illustrative running job"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={62}
                  >
                    <i />
                  </div>
                )}
              </article>
            ))}
          </div>

          <footer>
            <span>MODEL CONTROL</span>
            <div><button type="button">LOAD</button><button type="button">UNLOAD</button></div>
            <strong>ASSET HISTORY / 18</strong>
          </footer>
        </div>

        <div className={styles.details}>
          <div className={styles.mediaList}>
            <article><span>01</span><div><h3>Image + video</h3><p>Run preferred or custom workflows while progress, outputs, and failures remain visible to the requesting client.</p></div></article>
            <article><span>02</span><div><h3>3D generation</h3><p>TRELLIS runs as a ComfyUI workflow—not as a separate Spark Plug engine.</p></div></article>
            <article><span>03</span><div><h3>Audio workflows</h3><p><strong>Audio through imported or custom ComfyUI workflows.</strong> Returned <code>.wav</code>, <code>.mp3</code>, <code>.flac</code>, and <code>.ogg</code> files can be tracked as assets; there is not yet a dedicated one-click audio endpoint.</p></div></article>
          </div>

          <div className={styles.arbitration}>
            <p className={styles.eyebrow}>MEMORY ARBITRATION</p>
            <h3>Make room. Render. Put the work back.</h3>
            <p>
              When an approved render conflicts with a hot model, Spark Plug
              can hold the job, unload that conflicting model, run the ComfyUI
              workflow, and restore the previous model afterward.
            </p>
            <ol aria-label="ComfyUI memory arbitration sequence">
              <li><span>01</span><strong>HOLD</strong><small>queue request</small></li>
              <li><span>02</span><strong>EVICT</strong><small>conflicting model</small></li>
              <li><span>03</span><strong>RENDER</strong><small>ComfyUI workflow</small></li>
              <li><span>04</span><strong>RESTORE</strong><small>previous model</small></li>
            </ol>
          </div>
        </div>
      </div>

      <p className={styles.boundary}>
        Queue values shown here are illustrative. Workflow compatibility depends
        on the user&apos;s installed ComfyUI nodes, models, and approved Spark Plug profile.
      </p>
    </section>
  );
}
