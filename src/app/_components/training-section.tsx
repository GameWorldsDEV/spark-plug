import styles from "./training-section.module.css";

export const trainingSteps = [
  ["01", "Choose a base model", "Start from a compatible model and record its source, license, engine, and memory requirements."],
  ["02", "Attach your dataset", "Review the local training data, formatting, permissions, and output destination before a run begins."],
  ["03", "Set the LoRA recipe", "Tune rank, target modules, precision, checkpoints, and capacity limits in an editable training profile."],
  ["04", "Keep the adapter", "Return a versioned LoRA adapter and run record without replacing the original base model."],
] as const;

export function TrainingSection() {
  return (
    <section className={styles.section} id="training" aria-labelledby="training-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>LOCAL AI TRAINING / COMING SOON</p>
        <h2 id="training-title">Tune the model. Keep control of the adapter.</h2>
        <p>
          Spark Plug is preparing a managed training workspace for Unsloth-powered
          LoRA workflows: one place to define the base model, dataset, recipe,
          checkpoints, capacity, and returned adapter artifact.
        </p>
        <div className={styles.badges}><span>UNSLOTH INTEGRATION</span><span>LORA WORKFLOWS</span></div>
      </div>

      <ol className={styles.steps}>
        {trainingSteps.map(([number, title, copy]) => (
          <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></li>
        ))}
      </ol>

      <div className={styles.console} aria-label="Illustrative future training run">
        <header><span>TRAINING PROFILE</span><b>COMING SOON</b></header>
        <div className={styles.runName}><small>ADAPTER RUN</small><strong>PRODUCT-SUPPORT-LORA</strong></div>
        <dl>
          <div><dt>BASE</dt><dd>Qwen · Hugging Face</dd></div>
          <div><dt>METHOD</dt><dd>Unsloth · LoRA</dd></div>
          <div><dt>CAPACITY</dt><dd>Preflight required</dd></div>
          <div><dt>OUTPUT</dt><dd>Versioned adapter</dd></div>
        </dl>
        <footer><i /><span>TRAINING REMAINS A ROADMAP CAPABILITY—NOT A FIRST-RELEASE CLAIM.</span></footer>
      </div>
    </section>
  );
}
