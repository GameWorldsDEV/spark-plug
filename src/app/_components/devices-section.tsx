import Image from "next/image";

import styles from "./devices-section.module.css";

const workingClients = ["Browser", "Mac", "iPhone", "iPad"] as const;
const comingClients = ["Windows", "Android"] as const;

export function DevicesSection() {
  return (
    <section className={styles.section} id="devices" aria-labelledby="devices-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>REMOTE CONTROL / YOUR NETWORK</p>
        <h2 id="devices-title">Work on the go.</h2>
        <p className={styles.lead}>Inspect your node, watch active work, and switch approved profiles from the devices you already carry.</p>
        <div className={styles.networks} aria-label="Compatible remote networking options">
          <span><Image src="/connectivity/tailscale.svg" width={32} height={32} alt="Tailscale logo" unoptimized /><b>Tailscale</b></span>
          <span><Image src="/connectivity/headscale.svg" width={58} height={32} alt="Headscale logo" unoptimized /><b>Headscale</b></span>
          <span><i aria-hidden="true">+</i><b>Another trusted user-managed VPN</b></span>
        </div>
        <p className={styles.boundary}><strong>A secure path is not permission.</strong> VPN reachability gets you to the node; Spark Plug pairing and node authentication still decide who can control it.</p>
      </div>

      <div className={styles.deviceScene} aria-label="Spark Plug control surfaces on a desktop, laptop, phone, and tablet">
        <div className={styles.desktop} role="img" aria-label="Desktop browser showing a ready Spark Plug node"><span>SPARK PLUG / BROWSER</span><strong>NODE READY</strong><i /></div>
        <div className={styles.laptop} role="img" aria-label="Mac client showing the active Creative profile"><span>MAC CLIENT</span><strong>CREATIVE</strong><small>vLLM + ComfyUI</small></div>
        <div className={styles.phone} role="img" aria-label="iPhone client showing a ready model"><i /><strong>READY</strong><span>QWEN · vLLM</span></div>
        <div className={styles.tablet} role="img" aria-label="iPad client showing node telemetry"><span>NODE / LIVE</span><strong>86 GB</strong><small>UNIFIED MEMORY</small><i /></div>
      </div>

      <div className={styles.availability}>
        <article>
          <p>WORKING-BUILD CONTROL SURFACES</p>
          <ul>{workingClients.map((client) => <li key={client}><i aria-hidden="true" />{client}</li>)}</ul>
          <span>Used in development today. Public downloads remain disabled until matching artifacts and release evidence are published.</span>
        </article>
        <article>
          <p>COMING SOON</p>
          <ul>{comingClients.map((client) => <li key={client}><i aria-hidden="true" />{client}</li>)}</ul>
          <span>Planned control clients—not current compatibility or release claims.</span>
        </article>
      </div>
    </section>
  );
}
