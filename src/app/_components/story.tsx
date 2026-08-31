"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "./brand-logo";
import styles from "./story.module.css";

export const storyStages = [
  { key: "app", label: "SPARK PLUG APP", title: "Install Spark Plug.", status: "APP DOWNLOADING", copy: "Download the Spark Plug control app to your DGX Spark. One verified node becomes the home for engines, models, profiles, and work." },
  { key: "engines", label: "ENGINES", title: "Add your engines.", status: "ENGINES CONFIGURING", copy: "Start with qualified vLLM. Add working-build Colibri and ComfyUI lanes when needed. MLX and Ollama stay visibly planned—not installed." },
  { key: "agents", label: "COMPATIBLE AGENTS", title: "Connect your agents.", status: "AGENTS CONNECTED", copy: "OpenClaw, Hermes Agent, Paperclip, Codex, and Claude Code connect through authorized OpenAI-compatible or Anthropic-compatible endpoints." },
  { key: "models", label: "HUGGING FACE MODELS", title: "Download your models.", status: "MODELS DOWNLOADING", copy: "Choose models from Hugging Face, store them on your machine, and assign each one to the engine that will run it." },
  { key: "profile", label: "REUSABLE PROFILE", title: "Build and load a profile.", status: "CAPACITY CHECKED", copy: "Save engines, models, memory, queues, and routing as one workflow. GW Broker checks the full capacity plan before it changes runtime state." },
  { key: "run", label: "LOCAL WORK", title: "Run local. Switch when you need.", status: "LOCAL AI READY", copy: "Load the approved profile, run the work on your node, and switch between Code, Creative, and Background Research from one control hub." },
] as const;

const engineMarks = [
  ["vLLM", "/engines/vllm.svg", "QUALIFIED FIRST", false],
  ["Colibri", "/engines/colibri.svg", "WORKING BUILD", false],
  ["ComfyUI", "/engines/comfyui.svg", "WORKING BUILD", false],
  ["MLX", "/engines/mlx.svg", "PLANNED / MAC NODES", true],
  ["Ollama", "/engines/ollama.svg", "PLANNED", true],
] as const;

const toolMarks = [
  { name: "OpenClaw", icon: "/integrations/openclaw.svg" },
  { name: "Hermes Agent", icon: "/integrations/hermes.png" },
  { name: "Paperclip", icon: "/integrations/paperclip.svg" },
  { name: "Codex", icon: "/integrations/codex.png" },
  { name: "Claude Code", icon: "/integrations/claude-code.png" },
] as const;

export function Story() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    if (reduced) {
      node.style.setProperty("--story-progress", "0");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const distance = Math.max(1, node.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const nextStage = Math.min(storyStages.length - 1, Math.floor(progress * storyStages.length));
      node.style.setProperty("--story-progress", String(progress));
      setStage((current) => current === nextStage ? current : nextStage);
      setStarted((current) => current === (progress > .035) ? current : progress > .035);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const introVisible = !started;

  return (
    <section className={styles.story} ref={root} aria-labelledby="story-title">
      <div className={styles.sticky}>
        <div className={styles.grid} aria-hidden="true" />
        <header className={styles.heroCopy} data-hidden={!introVisible || undefined} aria-hidden={!introVisible || undefined}>
          <p>SPARK PLUG / LOCAL AI CONTROL</p>
          <h1 id="story-title">Your local AI.<br /><em>One control hub.</em></h1>
          <span>Install Spark Plug, add your engines and models, build reusable profiles, and run your AI machine from one place.</span>
          <div className={styles.actions}>
            <a className={styles.nodeDownload} href="#release" tabIndex={introVisible ? 0 : -1}>Download for DGX Spark</a>
            <div className={styles.mobileStoreActions} aria-label="Mobile client apps">
              <button type="button" disabled aria-label="iOS App Store — coming soon">
                <i aria-hidden="true">iOS</i><span><small>COMING SOON ON THE</small><strong>App Store</strong></span>
              </button>
              <button type="button" disabled aria-label="Google Play — coming soon">
                <i aria-hidden="true">▶</i><span><small>COMING SOON ON</small><strong>Google Play</strong></span>
              </button>
            </div>
            <a className={styles.toolsCta} href="#tools" tabIndex={introVisible ? 0 : -1}>See compatible tools <b aria-hidden="true">↓</b></a>
          </div>
        </header>

        <div
          className={styles.scene}
          data-stage={stage}
          data-intro={!started || undefined}
          aria-hidden="true"
        >
          <div className={styles.installStack}>
            <div className={styles.appCard}><BrandLogo className={styles.appLogo} /><span><small>SPARK PLUG APP</small><strong>DOWNLOADING TO DGX</strong></span><b><i /></b></div>
            <div className={styles.greenPath}><i /><i /><i /></div>
          </div>

          <div className={styles.engineStack}>
            {engineMarks.map(([name, icon, status, planned]) => (
              <span key={name} data-planned={planned || undefined}><Image src={icon} width={82} height={34} alt="" unoptimized /><b>{name}</b><small>{status}</small><i /></span>
            ))}
            <div className={styles.stackPath}><i /></div>
          </div>

          <div className={styles.agentStack}>
            {toolMarks.map((tool) => <span key={tool.name}><Image src={tool.icon} width={30} height={30} alt="" unoptimized /><b>{tool.name}</b></span>)}
            <strong>AUTHORIZED ENDPOINTS</strong><i />
          </div>

          <div className={styles.modelStack}>
            <div><Image src="/integrations/hugging-face.svg" width={58} height={58} alt="" unoptimized /><span><small>HUGGING FACE</small><strong>CHOOSE YOUR MODELS</strong></span></div>
            <span>QWEN <b>42%</b></span><span>NEMOTRON <b>QUEUED</b></span><span>GLM <b>READY</b></span>
            <i />
          </div>

          <div className={styles.profileBuilder}>
            <header><small>BUILD PROFILE</small><strong>CREATIVE + CODE</strong></header>
            <div><span>vLLM <b>QWEN</b></span><i>READY</i></div>
            <div><span>ComfyUI <b>MEDIA</b></span><i>READY</i></div>
            <div><span>GW Broker <b>CAPACITY</b></span><i>CHECKED</i></div>
            <footer><span /><b>PROFILE APPROVED</b></footer>
          </div>

          <div className={styles.runSwitch}>
            <div><small>ACTIVE PROFILE</small><strong>CODE</strong><span>vLLM · Qwen</span></div><i>⇄</i>
            <div><small>SWITCH TO</small><strong>CREATIVE</strong><span>vLLM + ComfyUI</span></div>
            <b><i />LOCAL AI READY</b>
          </div>

          <div className={styles.machine}>
            <div className={styles.machineGlow} />
            <Image src="/dgx/dgx-spark-quarter.webp" width={768} height={256} priority sizes="(max-width: 760px) 90vw, 54vw" alt="" />
            <div className={styles.scan} />
          </div>
          <div className={styles.machineStatus}><i /><span>{storyStages[stage].status}</span></div>
        </div>

        <div className={styles.beats} data-started={started || undefined} aria-live="polite" aria-hidden={!started || undefined}>
          {storyStages.map((item, index) => (
            <article key={item.key} data-active={stage === index} aria-hidden={!started || stage !== index}>
              <p>{String(index + 1).padStart(2, "0")} / {item.label}</p><h2>{item.title}</h2><span>{item.copy}</span>
            </article>
          ))}
        </div>

        <div className={styles.staticStory}>
          {storyStages.map((item, index) => <article key={item.key}><p>{String(index + 1).padStart(2, "0")} / {item.label}</p><h2>{item.title}</h2><span>{item.copy}</span><small>{item.status}</small></article>)}
        </div>
        <div className={styles.progress} aria-hidden="true"><span /><div>{storyStages.map((item, index) => <i key={item.key} data-active={stage >= index} />)}</div></div>
        <p className={styles.disclaimer}>Real DGX Spark development hardware. Spark Plug is independent software and is not affiliated with NVIDIA. Compatibility marks are descriptive.</p>
      </div>
    </section>
  );
}
