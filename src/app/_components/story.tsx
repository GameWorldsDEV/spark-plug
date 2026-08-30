"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./story.module.css";

const beats = [
  { label: "INSTALL", title: "Install Spark Plug.", copy: "Start with one control app on your DGX Spark. Add only the engines that match the work you want to run." },
  { label: "PROFILES", title: "Build your workflows.", copy: "Combine models from separate engines in one saved profile, then switch the whole workload without rebuilding it by hand." },
  { label: "AGENTS", title: "Connect your agents.", copy: "Give compatible agent and coding tools stable OpenAI-compatible or Anthropic-compatible endpoints through GW Broker." },
  { label: "ROUTE", title: "Send work to the right model.", copy: "GW Broker admits and observes every request. Optional NVIDIA NeMo Switchyard routing selects only from models approved by the active profile." },
] as const;

const toolMarks = [
  ["OpenClaw", "/integrations/openclaw.svg"], ["Hermes", "/integrations/hermes.svg"],
  ["Paperclip", "/integrations/paperclip.svg"], ["Codex", "/integrations/codex.svg"],
  ["Claude Code", "/integrations/claude-code.svg"],
] as const;

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
          <span>Install Spark Plug, download your models, build multi-engine profiles, and manage your AI machine from one place.</span>
          <div className={styles.actions}>
            <a href="#release">Download for DGX Spark</a>
            <a href="#profile-workflow">See how profiles work <b aria-hidden="true">↓</b></a>
          </div>
        </header>

        <div className={styles.machineStage} data-stage={stage} aria-hidden="true">
          <div className={styles.aura}><i /><i /><i /></div>
          <div className={styles.orbits}><i /><i /><i /></div>
          <div className={styles.machine}>
            <Image src="/dgx/dgx-spark-quarter.webp" width={1430} height={1430} priority sizes="(max-width: 800px) 108vw, 62vw" alt="" />
            <div className={styles.powerWash} /><div className={styles.scanLine} />
          </div>
          <div className={styles.installCard}><b>SP</b><span><strong>SPARK PLUG</strong><small>INSTALLING ON DGX SPARK</small></span><i /></div>
          <div className={styles.engineRail}>
            <span><b>vLLM</b><small>QUALIFIED FIRST</small></span><span><b>COLIBRI</b><small>WORKING BUILD</small></span>
            <span><b>COMFYUI</b><small>WORKING BUILD</small></span><span><b>MLX + OLLAMA</b><small>PLANNED</small></span>
          </div>
          <div className={styles.profileDeck}>
            <article><small>PROFILE 01</small><strong>CODE</strong><span>vLLM · Qwen</span></article>
            <article><small>PROFILE 02</small><strong>CREATIVE</strong><span>vLLM + ComfyUI</span></article>
            <article><small>PROFILE 03</small><strong>BACKGROUND</strong><span>Colibri · GLM</span></article>
          </div>
          <div className={styles.toolCloud}>
            {toolMarks.map(([name, icon]) => <span key={name}><Image src={icon} width={34} height={34} alt="" unoptimized /><b>{name}</b></span>)}
          </div>
          <div className={styles.routeMap}><span>AGENTS</span><i /><strong>GW<br />BROKER</strong><i /><b>SWITCHYARD</b><i /><span>APPROVED<br />MODELS</span></div>
          <div className={styles.machineStatus}><i /><span>{["INSTALLING", "PROFILE READY", "TOOLS CONNECTED", "ROUTING OBSERVED"][stage]}</span></div>
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
