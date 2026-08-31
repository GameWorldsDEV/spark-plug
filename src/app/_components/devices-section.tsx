import Image from "next/image";

import styles from "./devices-section.module.css";

export const devicePanels = [
  { id: "computer", name: "Computer", platform: "BROWSER + MAC", status: "WORKING BUILD", headline: "Node overview", detail: "Profile: Creative + Code", metric: "3 runtimes ready" },
  { id: "iphone", name: "iPhone", platform: "NATIVE CONTROL", status: "WORKING BUILD", headline: "Qwen ready", detail: "Profile controls", metric: "vLLM · 262K" },
  { id: "ipad", name: "iPad", platform: "NATIVE CONTROL", status: "WORKING BUILD", headline: "86 GB active", detail: "Telemetry + queues", metric: "4 jobs waiting" },
  { id: "android", name: "Android mobile", platform: "MOBILE CONTROL", status: "COMING SOON", headline: "In planning", detail: "Control client", metric: "No public build" },
] as const;

export function DevicesSection() {
  return (
    <section className={styles.section} id="devices" aria-labelledby="devices-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>REMOTE CONTROL / YOUR NETWORK</p>
          <h2 id="devices-title">Work on the go.</h2>
        </div>
        <div className={styles.headingCopy}>
          <p>Inspect the machine, watch active work, and switch approved profiles from a control surface you already carry. The compute stays on your Spark Plug node.</p>
          <p className={styles.releaseBoundary}>Working control builds are used in development today. They are not public-download claims.</p>
        </div>
      </div>

      <div className={styles.panelGrid} aria-label="Spark Plug remote control surfaces">
        {devicePanels.map((device) => (
          <article
            className={styles.devicePanel}
            data-device={device.id}
            data-release={device.status === "COMING SOON" ? "planned" : "working"}
            key={device.id}
            aria-label={`${device.name}: ${device.status.toLowerCase()}`}
          >
            <header>
              <div><span>{device.platform}</span><h3>{device.name}</h3></div>
              <strong>{device.status}</strong>
            </header>
            <div className={styles.deviceStage} aria-hidden="true">
              <div className={styles.deviceFrame}>
                <div className={styles.deviceScreen}>
                  <div className={styles.screenTop}><i /><span>SPARK PLUG</span><b>•••</b></div>
                  <p>{device.detail}</p>
                  <strong>{device.headline}</strong>
                  <div className={styles.screenMeter}><i /></div>
                  <small>{device.metric}</small>
                </div>
              </div>
              <span className={styles.remoteTag}>CONTROLS REMOTE NODE</span>
            </div>
            <p className={styles.panelSummary}>
              {device.status === "COMING SOON"
                ? "Planned control surface. No compatibility or release is claimed yet."
                : "A working-build control surface for an enrolled Spark Plug node."}
            </p>
          </article>
        ))}
      </div>

      <div className={styles.connectionRow}>
        <div className={styles.networks} aria-label="Compatible remote networking options">
          <p>REACH YOUR NODE THROUGH</p>
          <div>
            <span><Image src="/connectivity/tailscale.svg" width={32} height={32} alt="Tailscale logo" unoptimized /><b>Tailscale</b></span>
            <span><Image src="/connectivity/headscale.svg" width={58} height={32} alt="Headscale logo" unoptimized /><b>Headscale</b></span>
            <span><i aria-hidden="true">+</i><b>Another trusted user-managed VPN</b></span>
          </div>
        </div>
        <div className={styles.authorization}>
          <span>PATH ≠ PERMISSION</span>
          <h3>Reachability does not replace authentication.</h3>
          <p>A trusted VPN gets a client to the node. Spark Plug pairing, node credentials, and authorization still decide who can inspect or control it.</p>
        </div>
      </div>

      <p className={styles.roadmapNote}>Windows and Android control clients are coming soon. Public artifacts remain unavailable until their matching builds and release evidence are published.</p>
    </section>
  );
}
