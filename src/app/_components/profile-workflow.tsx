import styles from "./profile-workflow.module.css";

const steps = [
  ["01", "Install Spark Plug", "Pair the control app with one exact AI node."],
  ["02", "Download models", "Choose the models each engine needs for your work."],
  ["03", "Create profiles", "Save models, engine settings, queues, and route policy together."],
  ["04", "Switch profiles", "Move between complete workflows without rebuilding every setting."],
  ["05", "Run work", "Use stable endpoints while GW Broker keeps state and capacity visible."],
] as const;

const profiles = [
  ["CODE", "vLLM · Qwen", "Fast interactive coding and tool use"],
  ["CREATIVE", "vLLM + ComfyUI", "Text, image, video, and 3D workflows"],
  ["BACKGROUND RESEARCH", "Colibri · GLM", "Long-running reports in a separate lane"],
] as const;

export function ProfileWorkflow() {
  return (
    <section className={styles.section} id="profile-workflow" aria-labelledby="profile-workflow-title">
      <div className={styles.heading}>
        <div><p>REUSABLE MULTI-ENGINE PROFILES</p><h2 id="profile-workflow-title">Build once. Switch workflows in seconds.</h2></div>
        <div className={styles.intro}>
          <p>One Spark Plug profile can coordinate multiple engines and models at the same time. Each engine still keeps its own settings, queue, lifecycle, and memory cost.</p>
          <p>Save the complete setup for the work you do, then move between profiles without rebuilding your machine by hand.</p>
        </div>
      </div>
      <ol className={styles.steps} aria-label="Basic Spark Plug workflow">
        {steps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}
      </ol>
      <div className={styles.profileDemo}>
        <div className={styles.profileStack} aria-label="Example reusable profiles">
          {profiles.map(([name, engines, purpose], index) => <article key={name} data-selected={index === 1}><small>PROFILE {String(index + 1).padStart(2, "0")}</small><h3>{name}</h3><strong>{engines}</strong><p>{purpose}</p></article>)}
        </div>
        <div className={styles.runtimeView}>
          <header><span>ACTIVE PROFILE</span><b>CREATIVE</b></header>
          <div><span><i />vLLM</span><strong>QWEN · READY</strong></div>
          <div><span><i />ComfyUI</span><strong>MEDIA · IDLE</strong></div>
          <div><span><i />GW Broker</span><strong>ROUTES · ACTIVE</strong></div>
          <footer>Independent runtimes. One reusable workflow.</footer>
        </div>
      </div>
    </section>
  );
}
