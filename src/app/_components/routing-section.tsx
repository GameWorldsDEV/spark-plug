import { BrandLogo } from "./brand-logo";
import styles from "./routing-section.module.css";

const routes = [
  {
    id: "fast",
    number: "01",
    source: "OpenClaw / interactive",
    request: "What time is it?",
    lane: "Fast request",
    engine: "vLLM",
    model: "Nemotron 8B",
  },
  {
    id: "code",
    number: "02",
    source: "Hermes / coding",
    request: "Build a watch app.",
    lane: "Coding request",
    engine: "vLLM",
    model: "Qwen 27B",
  },
  {
    id: "background",
    number: "03",
    source: "Paperclip / background",
    request: "Prepare five days of reports.",
    lane: "Background request",
    engine: "Colibri",
    model: "GLM-5.2",
  },
] as const;

export function RoutingSection() {
  return (
    <section className={styles.section} id="routing" aria-labelledby="routing-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>GW BROKER + NVIDIA NEMO SWITCHYARD</p>
          <h2 id="routing-title">One broker. The right model for every request.</h2>
        </div>
        <p>
          GW Broker authenticates, admits, observes, and manages runtime state. Optional Switchyard
          routing selects only from endpoints already approved by the active profile.
        </p>
      </div>

      <div className={styles.scene}>
        <div className={styles.requestStack} aria-label="Illustrative requests">
          {routes.map((route) => (
            <article className={styles.requestCard} data-route={route.id} key={route.id}>
              <small>{route.source}</small>
              <strong>“{route.request}”</strong>
              <span>{route.lane}</span>
            </article>
          ))}
          <article className={`${styles.requestCard} ${styles.explicitCard}`}>
            <small>Authorized client / explicit model</small>
            <strong>“Use my selected model.”</strong>
            <span>Bypass advisory routing</span>
          </article>
        </div>

        <div className={styles.brokerCard}>
          <BrandLogo compact className={styles.brokerMark} />
          <small>NODE AUTHORITY</small>
          <h3>GW<br />BROKER</h3>
          <ul>
            <li>authenticate</li><li>admit</li><li>profiles</li><li>runtime</li><li>observe</li>
          </ul>
        </div>

        <div className={styles.switchyardCard}>
          <small>OPTIONAL ADVISORY ROUTING</small>
          <strong>NEMO<br />SWITCHYARD</strong>
          <span>SELECTS FROM PROFILE-APPROVED ENDPOINTS</span>
        </div>

        <div className={styles.modelStack} aria-label="Illustrative model destinations">
          {routes.map((route) => (
            <article className={styles.modelCard} data-route={route.id} key={route.id}>
              <i aria-hidden="true" />
              <div><small>{route.lane}</small><strong>{route.engine} / {route.model}</strong></div>
            </article>
          ))}
          <article className={`${styles.modelCard} ${styles.explicitModel}`}>
            <i aria-hidden="true" />
            <div><small>Explicit selection</small><strong>Profile-approved model</strong></div>
          </article>
        </div>

        <svg className={styles.routeMap} viewBox="0 0 1200 610" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="routing-arrow-lime" markerHeight="8" markerWidth="8" orient="auto-start-reverse" refX="4" refY="4"><path d="M0,0 L8,4 L0,8 z" fill="#a9ff2e" /></marker>
            <marker id="routing-arrow-cyan" markerHeight="8" markerWidth="8" orient="auto-start-reverse" refX="4" refY="4"><path d="M0,0 L8,4 L0,8 z" fill="#58d9ff" /></marker>
            <marker id="routing-arrow-orange" markerHeight="8" markerWidth="8" orient="auto-start-reverse" refX="4" refY="4"><path d="M0,0 L8,4 L0,8 z" fill="#ff885c" /></marker>
            <marker id="routing-arrow-explicit" markerHeight="8" markerWidth="8" orient="auto-start-reverse" refX="4" refY="4"><path d="M0,0 L8,4 L0,8 z" fill="#d7ddd8" /></marker>
          </defs>
          <g className={styles.fastPath}>
            <path d="M250 65 H350 M570 65 H625 M795 65 H865" />
            <circle r="5"><animateMotion dur="3.8s" repeatCount="indefinite" path="M250 65 H350 M570 65 H625 M795 65 H865" /></circle>
            <circle className={styles.returnPacket} r="4"><animateMotion begin="-1.9s" dur="3.8s" keyPoints="1;0" keyTimes="0;1" repeatCount="indefinite" path="M250 65 H350 M570 65 H625 M795 65 H865" /></circle>
          </g>
          <g className={styles.codePath}>
            <path d="M250 202 H350 M570 202 H625 M795 202 H865" />
            <circle r="5"><animateMotion begin="-1.25s" dur="4.2s" repeatCount="indefinite" path="M250 202 H350 M570 202 H625 M795 202 H865" /></circle>
            <circle className={styles.returnPacket} r="4"><animateMotion begin="-3.35s" dur="4.2s" keyPoints="1;0" keyTimes="0;1" repeatCount="indefinite" path="M250 202 H350 M570 202 H625 M795 202 H865" /></circle>
          </g>
          <g className={styles.backgroundPath}>
            <path d="M250 339 H350 M570 339 H625 M795 339 H865" />
            <circle r="5"><animateMotion begin="-2.45s" dur="4.8s" repeatCount="indefinite" path="M250 339 H350 M570 339 H625 M795 339 H865" /></circle>
            <circle className={styles.returnPacket} r="4"><animateMotion begin="-4.85s" dur="4.8s" keyPoints="1;0" keyTimes="0;1" repeatCount="indefinite" path="M250 339 H350 M570 339 H625 M795 339 H865" /></circle>
          </g>
          <g className={styles.explicitPath}>
            <path d="M250 506 H350 M570 506 C700 506 735 475 865 475" />
            <circle r="4"><animateMotion dur="5.2s" repeatCount="indefinite" path="M250 506 H350 M570 506 C700 506 735 475 865 475" /></circle>
            <circle className={styles.returnPacket} r="3"><animateMotion begin="-2.6s" dur="5.2s" keyPoints="1;0" keyTimes="0;1" repeatCount="indefinite" path="M250 506 H350 M570 506 C700 506 735 475 865 475" /></circle>
          </g>
        </svg>
      </div>

      <ol className={styles.routeLegend} aria-label="Request route examples">
        {routes.map((route) => (
          <li data-route={route.id} key={route.id}>
            <span>{route.number}</span>
            <p><strong>{route.lane}</strong> → GW Broker → Switchyard → {route.engine} / {route.model} → back to the requester</p>
          </li>
        ))}
        <li className={styles.explicitLegend}>
          <span>04</span>
          <p><strong>Explicit model</strong> → GW Broker admission → selected profile-approved endpoint → back to the requester</p>
        </li>
      </ol>

      <p className={styles.note}>
        Illustrative policy paths—not benchmark results. Switchyard recommends a configured endpoint;
        GW Broker retains admission and runtime authority. Explicit model selection bypasses Switchyard,
        never Broker admission.
      </p>
    </section>
  );
}

export { routes as routingExamples };
