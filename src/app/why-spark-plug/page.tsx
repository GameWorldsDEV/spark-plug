import Link from "next/link";

import { BrandLogo } from "../_components/brand-logo";
import { detailMetadata } from "../../lib/metadata";
import styles from "./page.module.css";

export const metadata = detailMetadata(
  "Why Spark Plug",
  "Why Spark Plug is building a visible, profile-driven control layer for local AI infrastructure.",
  "/why-spark-plug",
);

const principles = [
  {
    number: "01",
    title: "Own the machine",
    copy: "Your models and local runtimes should remain useful without turning every request into a dependency on somebody else’s hosted control plane.",
  },
  {
    number: "02",
    title: "Save the whole workflow",
    copy: "A reusable profile coordinates models across engines while preserving each engine’s settings, health, queue, lifecycle, and memory cost.",
  },
  {
    number: "03",
    title: "See what is running",
    copy: "Capacity, loaded models, queues, power, health, logs, and recent events should be visible before a profile changes runtime state.",
  },
  {
    number: "04",
    title: "Authorize every path",
    copy: "A reachable node is not an open node. Pairing, identity, admission, and the active profile still decide who may control it and what may run.",
  },
] as const;

export default function WhySparkPlugPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Spark Plug home"><BrandLogo className={styles.brandLogo} /></Link>
        <Link className={styles.back} href="/">← Back to the product</Link>
      </header>

      <section className={styles.hero} aria-labelledby="why-title">
        <p>WHY SPARK PLUG</p>
        <h1 id="why-title">Local AI should feel owned—not improvised.</h1>
        <div>
          <strong>Domesticate your AI.</strong>
          <p>Spark Plug is being built to turn a powerful local AI machine into infrastructure you can configure, observe, and safely operate from one control hub.</p>
        </div>
      </section>

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.sectionIntro}><p>THE OPERATING PRINCIPLES</p><h2 id="principles-title">Control that survives past the demo.</h2></div>
        <div className={styles.principleGrid}>
          {principles.map((principle) => (
            <article key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.audiences} aria-labelledby="audiences-title">
        <div><p>BUILT FOR REAL WORK</p><h2 id="audiences-title">For developers and businesses.</h2></div>
        <article><span>DEVELOPERS</span><h3>Repeatable environments without a mystery box.</h3><p>Save profiles for coding, creative work, research, or experiments. Swap the approved workload instead of rebuilding runtime settings by hand each time.</p></article>
        <article><span>BUSINESSES</span><h3>Visible infrastructure with deliberate access.</h3><p>Keep local workloads observable, separate long-running queues from interactive work, and give authorized operators a clear view of node state.</p></article>
      </section>

      <section className={styles.remote} aria-labelledby="remote-title">
        <div className={styles.remoteDiagram} aria-hidden="true">
          <span>YOUR DEVICE</span><i /><strong>TRUSTED NETWORK PATH</strong><i /><span>SPARK PLUG NODE</span>
        </div>
        <div>
          <p>REMOTE ADMINISTRATION</p>
          <h2 id="remote-title">Reachability is not authorization.</h2>
          <p>A LAN, Tailscale, Headscale, or another trusted user-managed VPN can provide the route to your machine. Spark Plug pairing and node authentication remain the gate for control.</p>
          <p>Node telemetry, capacity information, and logs remain on the Spark Plug node by default. Optional cloud routes and third-party transports have their own disclosed boundaries.</p>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <p>ONE LOCAL CONTROL HUB</p>
        <h2 id="closing-title">Know the profile. Know the capacity. Run the work.</h2>
        <div><Link href="/#release">See release readiness</Link><Link href="/benchmarks">Review benchmark rules</Link></div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 GameWorlds. Spark Plug is independent software.</p>
        <nav aria-label="Why Spark Plug footer"><Link href="/security">Security</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
      </footer>
    </main>
  );
}
