import Link from "next/link";

import styles from "./roadmap-section.module.css";

const roadmap = [
  {
    status: "NOW",
    title: "DGX Spark / Linux node",
    copy: "DGX Spark with Linux is the first qualified node target. Browser, Mac, iPhone, and iPad control surfaces are working builds.",
  },
  {
    status: "COMING SOON",
    title: "Public installers",
    copy: "Matching installers and approved native-client artifacts stay disabled until their release evidence is ready.",
  },
  {
    status: "NEXT",
    title: "Android client",
    copy: "Bring approved profile control and node visibility to Android without turning the phone into a compute node.",
  },
  {
    status: "COMING SOON",
    title: "DGX Spark clustering",
    copy: "Coordinate multiple qualified DGX Spark nodes only after membership, aggregate capacity, scheduling, failure handling, and cluster benchmarks pass review.",
  },
  {
    status: "COMING SOON",
    title: "Apple Mac nodes",
    copy: "Apple Silicon nodes will center on MLX and other independently qualified engines. This is separate from the working Mac control client.",
  },
  {
    status: "ROADMAP",
    title: "Windows nodes",
    copy: "Windows AMD and NVIDIA paths will be qualified independently, with their own installer, engines, capacity rules, and evidence.",
  },
] as const;

export function RoadmapSection() {
  return (
    <section className={styles.section} id="roadmap" aria-labelledby="roadmap-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>RELEASE PATH</p>
        <h2 id="roadmap-title">What’s now. What’s next.</h2>
        <p>One public contract at a time—measured, documented, and labeled before it becomes a download claim.</p>
        <Link href="/benchmarks">See Spark Plug benchmarks <span aria-hidden="true">↗</span></Link>
      </div>

      <ol className={styles.timeline}>
        {roadmap.map((item, index) => (
          <li key={item.title}>
            <span>{item.status}</span>
            <div><small>{String(index + 1).padStart(2, "0")}</small><h3>{item.title}</h3><p>{item.copy}</p></div>
          </li>
        ))}
      </ol>

      <div className={styles.screenshotReserve} aria-label="Future product screenshots">
        <div role="img" aria-label="Reserved space for a scrubbed Spark Plug profile screenshot">
          <span>SCRUBBED APP VIEW</span><strong>Profile control</strong><i aria-hidden="true" />
        </div>
        <div role="img" aria-label="Reserved space for a scrubbed Spark Plug telemetry screenshot">
          <span>SCRUBBED APP VIEW</span><strong>Node telemetry</strong><i aria-hidden="true" />
        </div>
        <p>Reserved for reviewed product captures. No private app screenshot or session data is included.</p>
      </div>
    </section>
  );
}

export { roadmap as roadmapItems };
