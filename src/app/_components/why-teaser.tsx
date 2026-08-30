import Link from "next/link";

import styles from "./why-teaser.module.css";

export function WhyTeaser() {
  return (
    <section className={styles.section} aria-labelledby="why-teaser-title">
      <div>
        <p className={styles.eyebrow}>WHY SPARK PLUG</p>
        <h2 id="why-teaser-title">Domesticate your AI.</h2>
      </div>
      <div className={styles.copy}>
        <p>
          Owning local compute is useful. Knowing what it is running, how much capacity it has,
          and exactly who may control it is better.
        </p>
        <Link href="/why-spark-plug">Why Spark Plug exists <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  );
}
