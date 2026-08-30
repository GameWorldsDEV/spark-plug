"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./story.module.css";

const beats = [
  { label: "INSTALL", title: "Spark Plug arrives.", copy: "Install the verified node service, then open the same control surface from your desktop or browser." },
  { label: "PAIR", title: "Your devices meet the node.", copy: "A Mac, iPhone, or iPad discovers the box, upgrades to HTTPS, and enrolls to that node—not a universal cloud account." },
  { label: "PROFILE", title: "Choose how the box should work.", copy: "Select models, engines, context, streaming, concurrency, media policy, and routing as one saved workload plan." },
  { label: "RUN", title: "One profile becomes a working system.", copy: "vLLM, Colibri, ComfyUI, queues, memory protection, and connected agents come online with observable state." },
];

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
      node.style.setProperty("--story-progress", String(progress));
      setStage(Math.min(3, Math.floor(progress * 4.1)));
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
        <div className={styles.heroCopy}>
          <p>YOUR AI BOX / UNDER CONTROL</p>
          <h1 id="story-title">Plug in.<br /><em>Power up.</em></h1>
          <span>Scroll through the real setup flow</span>
        </div>

        <div className={styles.machineStage} data-stage={stage}>
          <div className={styles.aura} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.orbits} aria-hidden="true"><i /><i /><i /></div>
          <div className={styles.particles} aria-hidden="true">
            {Array.from({ length: 12 }).map((_, index) => <i key={index} />)}
          </div>
          <div className={styles.downloadPacket} aria-hidden="true">
            <span>SP</span><div><strong>SPARK PLUG</strong><small>verified package</small></div><b>↓</b>
          </div>
          <div className={styles.installBeam} aria-hidden="true"><i /></div>
          <div className={styles.machine}>
            <Image src="/dgx/dgx-spark-quarter.webp" width={1430} height={1430} priority sizes="(max-width: 800px) 108vw, 62vw" alt="A real NVIDIA DGX Spark powering up as Spark Plug is installed" />
            <div className={styles.powerWash} aria-hidden="true" />
            <div className={styles.scanLine} aria-hidden="true" />
          </div>
          <div className={styles.machineStatus}><i /><span>{["DOWNLOAD READY", "SECURE PAIRING", "PROFILE APPLYING", "SYSTEM ONLINE"][stage]}</span></div>
          <div className={styles.routeBurst} aria-hidden="true"><i /><i /><i /><i /></div>
        </div>

        <div className={styles.terminal} data-stage={stage} aria-hidden="true">
          <div><i /><i /><i /><span>SPARK PLUG INSTALLER</span></div>
          <p data-done={stage >= 0}><b>01</b> release signature verified</p>
          <p data-done={stage >= 1}><b>02</b> node account paired over HTTPS</p>
          <p data-done={stage >= 2}><b>03</b> profile accepted by the broker</p>
          <p data-done={stage >= 3}><b>04</b> engines, queues, and guards online</p>
        </div>

        <div className={styles.beats}>
          {beats.map((beat, index) => (
            <article key={beat.label} data-active={stage === index}>
              <p>{String(index + 1).padStart(2, "0")} / {beat.label}</p>
              <h2>{beat.title}</h2>
              <span>{beat.copy}</span>
            </article>
          ))}
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span /><div>{beats.map((beat, index) => <i key={beat.label} data-active={stage >= index} />)}</div>
        </div>
        <p className={styles.disclaimer}>Real DGX Spark development hardware. Spark Plug is independent software and is not affiliated with NVIDIA.</p>
      </div>
    </section>
  );
}
