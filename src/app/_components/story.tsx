"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "./brand-logo";
import styles from "./story.module.css";

const beats = [
  { label: "INSTALL", title: "Install Spark Plug.", copy: "The Spark Plug control app lands on your DGX Spark and becomes the place where engines, models, profiles, and work are managed." },
  { label: "ENGINES", title: "Add your engines.", copy: "Install qualified engines through Spark Plug. vLLM is qualified first for DGX Spark; Colibri and ComfyUI are working builds. MLX and Ollama remain clearly marked roadmap options." },
  { label: "AGENTS", title: "Connect your agents.", copy: "OpenClaw, Hermes Agent, Paperclip, Codex, and Claude Code connect to authorized OpenAI-compatible or Anthropic-compatible endpoints." },
  { label: "MODELS", title: "Download your models.", copy: "Choose models from Hugging Face, download them to your own machine, and assign each model to the engine that will run it." },
  { label: "PROFILE", title: "Build and load a profile.", copy: "Save engines, models, memory, queues, and routing as one reusable workflow. Spark Plug checks capacity before anything changes." },
  { label: "RUN", title: "Run local. Switch when you need.", copy: "Load the approved profile, run the work locally, then switch between Code, Creative, and Background workflows from one control hub." },
] as const;

const engineMarks = [
  ["vLLM", "/engines/vllm.svg", "INSTALLING"],
  ["Colibri", "/engines/colibri.svg", "WORKING BUILD"],
  ["ComfyUI", "/engines/comfyui.svg", "WORKING BUILD"],
  ["MLX", "/engines/mlx.svg", "MAC ROADMAP"],
  ["Ollama", "/engines/ollama.svg", "PLANNED"],
] as const;

const toolMarks = [
  ["OpenClaw", "/integrations/openclaw.svg"], ["Hermes", "/integrations/hermes.png"],
  ["Paperclip", "/integrations/paperclip.svg"], ["Codex", "/integrations/codex.svg"],
  ["Claude Code", "/integrations/claude-code.svg"],
] as const;

const statuses = ["APP DOWNLOADING", "ENGINES CONFIGURING", "AGENTS CONNECTED", "MODELS DOWNLOADING", "PROFILE LOADING", "LOCAL AI READY"] as const;

export function Story() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const distance = Math.max(1, node.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      const nextStage = Math.min(beats.length - 1, Math.floor(progress * beats.length));
      node.style.setProperty("--story-progress", String(progress));
      setStage((current) => current === nextStage ? current : nextStage);
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

  return (
    <section className={styles.story} ref={root} aria-labelledby="story-title">
      <div className={styles.sticky}>
        <div className={styles.grid} aria-hidden="true" />
        <header className={styles.heroCopy}>
          <p>SPARK PLUG / LOCAL AI CONTROL</p>
          <h1 id="story-title">Your local AI.<br /><em>One control hub.</em></h1>
          <span>Install Spark Plug, add your engines and models, build reusable profiles, and run your AI machine from one place.</span>
          <div className={styles.actions}>
            <a href="#release">Download for DGX Spark</a>
            <a href="#profile-workflow">See how profiles work <b aria-hidden="true">↓</b></a>
          </div>
        </header>

        <div className={styles.machineStage} data-stage={stage} aria-hidden="true">
          <div className={styles.aura}><i /><i /><i /></div>
          <div className={styles.orbits}><i /><i /><i /></div>
          <div className={styles.appDownload}>
            <BrandLogo className={styles.appBrand} />
            <span><small>SPARK PLUG APP</small><strong>DOWNLOADING TO DGX</strong></span>
            <b><i /></b>
          </div>
          <div className={styles.transferBeam}><i /><i /><i /><span /></div>
          <div className={styles.machine}>
            <Image src="/dgx/dgx-spark-quarter.webp" width={1430} height={1430} priority sizes="(max-width: 800px) 108vw, 62vw" alt="" />
            <div className={styles.powerWash} /><div className={styles.scanLine} />
          </div>
          <div className={styles.engineDownloads}>
            {engineMarks.map(([name, icon, status], index) => (
              <span key={name} data-roadmap={index > 2 || undefined}>
                <Image src={icon} width={90} height={38} alt="" unoptimized />
                <b>{name}</b><small>{status}</small><i />
              </span>
            ))}
          </div>
          <div className={styles.toolCloud}>
            {toolMarks.map(([name, icon]) => <span key={name}><Image src={icon} width={34} height={34} alt="" unoptimized /><b>{name}</b></span>)}
            <div className={styles.agentEndpoint}>AUTHORIZED ENDPOINTS <i /></div>
          </div>
          <div className={styles.modelDownload}>
            <div className={styles.huggingFace}><Image src="/integrations/hugging-face.svg" width={62} height={62} alt="" unoptimized /><span><small>HUGGING FACE</small><strong>CHOOSE YOUR MODELS</strong></span></div>
            <div className={styles.modelFiles}><span>QWEN <i>42%</i></span><span>NEMOTRON <i>QUEUED</i></span><span>GLM <i>READY</i></span></div>
            <div className={styles.modelBeam}><i /><i /><i /></div>
          </div>
          <div className={styles.profileConsole}>
            <header><small>BUILD PROFILE</small><strong>CREATIVE + CODE</strong></header>
            <div><span>vLLM <b>QWEN</b></span><i>READY</i></div>
            <div><span>ComfyUI <b>MEDIA</b></span><i>READY</i></div>
            <div><span>GW Broker <b>ROUTES</b></span><i>CHECKED</i></div>
            <footer><span /><b>LOADING PROFILE</b></footer>
          </div>
          <div className={styles.completion}>
            <div><small>ACTIVE PROFILE</small><strong>CODE</strong><span>vLLM · Qwen</span></div>
            <i>⇄</i>
            <div><small>SWITCH TO</small><strong>CREATIVE</strong><span>vLLM + ComfyUI</span></div>
            <b><i />LOCAL AI READY</b>
          </div>
          <div className={styles.machineStatus}><i /><span>{statuses[stage]}</span></div>
        </div>

        <div className={styles.beats} aria-live="polite">
          {beats.map((beat, index) => <article key={beat.label} data-active={stage === index} aria-hidden={stage !== index}><p>{String(index + 1).padStart(2, "0")} / {beat.label}</p><h2>{beat.title}</h2><span>{beat.copy}</span></article>)}
        </div>
        <div className={styles.staticStory}>
          {beats.map((beat, index) => <article key={beat.label}><p>{String(index + 1).padStart(2, "0")} / {beat.label}</p><h2>{beat.title}</h2><span>{beat.copy}</span></article>)}
        </div>
        <div className={styles.progress} aria-hidden="true"><span /><div>{beats.map((beat, index) => <i key={beat.label} data-active={stage >= index} />)}</div></div>
        <p className={styles.disclaimer}>Real DGX Spark development hardware. Spark Plug is independent software and is not affiliated with NVIDIA.</p>
      </div>
    </section>
  );
}
