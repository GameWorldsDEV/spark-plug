import styles from "./routing-section.module.css";

const flow = [
  {
    number: "01",
    title: "Agent or app",
    subtitle: "Sends work",
    description: "OpenClaw, Hermes, Paperclip, Codex, Claude Code, or another authorized client.",
  },
  {
    number: "02",
    title: "GW Broker",
    subtitle: "Checks the request",
    description: "Authenticates, admits, checks the profile and capacity, then observes the run.",
  },
  {
    number: "03",
    title: "Switchyard",
    subtitle: "Optionally picks a text model",
    description: "Chooses only from configured endpoints already approved by the active profile.",
  },
  {
    number: "04",
    title: "Engine + model",
    subtitle: "Runs the request",
    description: "The selected local runtime performs the work and returns the result through GW Broker.",
  },
] as const;

const examples = [
  { id: "fast", label: "Fast", route: "vLLM / Nemotron 8B" },
  { id: "code", label: "Code", route: "vLLM / Qwen 27B" },
  { id: "background", label: "Background", route: "Colibri / GLM-5.2" },
] as const;

const runtimes = [
  ["vLLM", "Qualified first / text"],
  ["Colibri", "Working build / text"],
  ["ComfyUI", "Working build / Broker media route"],
  ["MLX", "Planned"],
  ["Ollama", "Planned"],
] as const;

export function RoutingSection() {
  return (
    <section className={styles.section} id="routing" aria-labelledby="routing-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>GW BROKER + OPTIONAL NVIDIA NEMO SWITCHYARD</p>
          <h2 id="routing-title">One request in. The right model out.</h2>
        </div>
        <p>
          GW Broker controls access and runtime state. Switchyard can help choose an approved text
          model; it never starts, stops, or manages an engine.
        </p>
      </div>

      <ol className={styles.flow} aria-label="How a routed request moves through Spark Plug">
        {flow.map((step) => (
          <li key={step.number}>
            <span>{step.number}</span>
            <h3>{step.title}</h3>
            <strong>{step.subtitle}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>

      <p className={styles.returnPath}><span aria-hidden="true">↶</span> Result returns through GW Broker to the requesting agent or app.</p>

      <div className={styles.examples} aria-label="Illustrative text routing examples">
        {examples.map((example) => (
          <article data-route={example.id} key={example.id}>
            <span>{example.label}</span><strong>{example.route}</strong>
          </article>
        ))}
      </div>

      <div className={styles.bypass}>
        <span>SELECTED MODEL</span>
        <p><strong>Your choice</strong><i aria-hidden="true">→</i>GW Broker checks<i aria-hidden="true">→</i>Chosen profile-approved model</p>
        <small>Switchyard skipped. Broker admission still applies.</small>
      </div>

      <div className={styles.runtimeStrip} aria-label="Runtime routing boundaries">
        {runtimes.map(([name, status]) => <span key={name}><strong>{name}</strong><small>{status}</small></span>)}
      </div>

      <p className={styles.note}>
        Illustrative policy paths—not benchmark results. ComfyUI image, video, 3D, and custom audio
        workflows use typed Broker media routes, not Switchyard text routing.
      </p>
    </section>
  );
}

export { examples as routingExamples, flow as routingFlow, runtimes as routingRuntimes };
