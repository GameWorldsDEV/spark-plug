"use client";

import { type KeyboardEvent, useRef, useState } from "react";

import styles from "./profile-workflow.module.css";

const steps = [
  ["01", "Install Spark Plug", "Pair the control app with one exact AI node."],
  ["02", "Download models", "Choose the models each engine needs for your work."],
  ["03", "Create profiles", "Save models, engine settings, queues, and route policy together."],
  ["04", "Switch profiles", "Move between complete workflows without rebuilding every setting."],
  ["05", "Run work", "Use stable endpoints while GW Broker keeps state and capacity visible."],
] as const;

export const workflowProfiles = [
  {
    id: "code", name: "CODE", summary: "Interactive coding and tool use", status: "READY",
    engines: [
      { engine: "vLLM", model: "Qwen", state: "PRIMARY / READY" },
      { engine: "Colibri", model: "GLM", state: "BACKGROUND / IDLE" },
    ],
    queue: "Interactive requests first; longer research can wait in Colibri’s separate queue.",
    route: "GW Broker admits the request and applies the Code profile’s approved model route.",
  },
  {
    id: "creative", name: "CREATIVE", summary: "Text, image, video, and 3D workflows", status: "MEDIA READY",
    engines: [
      { engine: "vLLM", model: "Qwen", state: "PROMPTS / READY" },
      { engine: "ComfyUI", model: "Preferred workflow", state: "MEDIA / IDLE" },
    ],
    queue: "Media requests wait in the ComfyUI queue while text work remains independently available.",
    route: "GW Broker sends typed media work directly to ComfyUI; Switchyard is not a media runtime.",
  },
  {
    id: "background", name: "BACKGROUND RESEARCH", summary: "Long-running reports in a separate lane", status: "QUEUES READY",
    engines: [
      { engine: "Colibri", model: "GLM", state: "REPORTS / READY" },
      { engine: "vLLM", model: "Nemotron", state: "FAST TASKS / READY" },
    ],
    queue: "Long jobs stay in Colibri while fast local requests continue through the vLLM lane.",
    route: "GW Broker keeps both queues observable and admits only work approved by this profile.",
  },
] as const;

export function ProfileWorkflow() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const profile = workflowProfiles[selected];

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % workflowProfiles.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + workflowProfiles.length) % workflowProfiles.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = workflowProfiles.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className={styles.section} id="profile-workflow" aria-labelledby="profile-workflow-title">
      <div className={styles.heading}>
        <div><p>REUSABLE MULTI-ENGINE PROFILES</p><h2 id="profile-workflow-title">Build once. Switch workflows in seconds.</h2></div>
        <div className={styles.intro}><p>One profile can coordinate multiple engines and models at the same time. Each engine still keeps its own settings, queue, lifecycle, and memory cost.</p><p>Save the complete setup for the work you do, then switch it as one unit.</p></div>
      </div>

      <ol className={styles.steps} aria-label="Basic Spark Plug workflow">
        {steps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}
      </ol>

      <div className={styles.profileDemo}>
        <div className={styles.profileTabs} role="tablist" aria-label="Example reusable profiles">
          {workflowProfiles.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => { tabs.current[index] = node; }}
              id={`profile-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls="active-profile-panel"
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => move(event, index)}
            >
              <small>PROFILE {String(index + 1).padStart(2, "0")}</small><strong>{item.name}</strong><span>{item.summary}</span>
            </button>
          ))}
        </div>

        <div className={styles.runtimeView} id="active-profile-panel" role="tabpanel" aria-labelledby={`profile-tab-${profile.id}`} tabIndex={0}>
          <header><span>ACTIVE PROFILE</span><b>{profile.name}</b><i>{profile.status}</i></header>
          <div className={styles.runtimeRows}>
            {profile.engines.map((item) => <div key={item.engine}><span><i />{item.engine}</span><strong>{item.model}</strong><small>{item.state}</small></div>)}
          </div>
          <dl><div><dt>QUEUE</dt><dd>{profile.queue}</dd></div><div><dt>ROUTING</dt><dd>{profile.route}</dd></div></dl>
          <footer>Independent runtimes. One reusable workflow.</footer>
        </div>
      </div>
    </section>
  );
}
