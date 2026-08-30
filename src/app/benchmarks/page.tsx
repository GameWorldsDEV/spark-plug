import Link from "next/link";

import { BENCH_METHOD, PUBLISHED_RUNS } from "@/lib/benchmarks";
import { detailMetadata } from "@/lib/metadata";
import { BrandLogo } from "../_components/brand-logo";
import styles from "./benchmarks.module.css";

export const metadata = detailMetadata(
  "Benchmarks",
  "Spark Plug benchmark publication rules and the current measured-results ledger. No estimates or copied leaderboard numbers.",
  "/benchmarks",
);

export default function BenchmarksPage() {
  return (
    <main className={styles.benchPage}>
      <header className={styles.benchPageHeader}>
        <Link className={styles.wordmark} href="/" aria-label="Spark Plug home">
          <BrandLogo className={styles.brandLogo} />
        </Link>
        <Link className={styles.headerCta} href="/#release">
          ← Back to the release
        </Link>
      </header>

      <div className={styles.benchHero}>
        <p className={styles.sectionIndex}>MEASURED, NOT MARKETED / COMING SOON</p>
        <h1>No performance claims without a measured run.</h1>
        <p>
          Spark Plug does not have a public benchmark result yet. When a result
          is published here, it will come from the Spark Plug broker on the
          supported DGX Spark test node and include enough configuration and
          method detail to explain what was actually measured.
        </p>
      </div>

      <section
        className={styles.benchPageBody}
        aria-labelledby="bench-runs-title"
      >
        <div className={styles.benchPanel}>
          <p className={styles.panelTag} id="bench-runs-title">
            PUBLISHED RESULTS / CURRENTLY EMPTY
          </p>
          <div className={styles.benchTableWrap}>
            <table className={styles.benchTable}>
              <thead>
                <tr>
                  <th scope="col">Model</th>
                  <th scope="col">Quant</th>
                  <th scope="col">Context</th>
                  <th scope="col">Prefill t/s</th>
                  <th scope="col">Decode t/s</th>
                  <th scope="col">Measured</th>
                </tr>
              </thead>
              <tbody>
                {PUBLISHED_RUNS.length > 0 ? (
                  PUBLISHED_RUNS.map((run) => (
                    <tr key={`${run.model}-${run.measuredAt}`}>
                      <th scope="row">{run.model}</th>
                      <td>{run.quant}</td>
                      <td>{run.contextWindow.toLocaleString("en-US")}</td>
                      <td>{run.prefillTps.toLocaleString("en-US")}</td>
                      <td>{run.decodeTps.toLocaleString("en-US")}</td>
                      <td>{run.measuredAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className={styles.benchComingSoon} colSpan={6}>
                      <strong>COMING SOON</strong>
                      <span>
                        No measured results have passed the publication gate.
                        The table stays empty until one does.
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className={styles.panelFoot}>{BENCH_METHOD}</p>
        </div>

        <div className={styles.benchCards}>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>THE TEST BENCH</p>
            <p>
              The first supported test target is one NVIDIA DGX Spark with a
              GB10 Grace Blackwell Superchip and 128&nbsp;GB unified memory.
              Published tests will run through the broker and serving stack,
              not a separate best-case command that bypasses the product.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>WHAT WILL BE REPORTED</p>
            <p>
              Each result must name the node configuration, Spark Plug and
              engine builds, model and quantization, context and output sizes,
              concurrency, warm or cold state, request count, summary method,
              and measurement date. Different test conditions are not merged.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>WHAT THE TABLE DOES NOT CLAIM</p>
            <p>
              An accepted request is not proof that a model was resident or
              ready. A model&rsquo;s advertised context limit is not proof that
              the full window was tested. An empty table means exactly that:
              Spark Plug is making no public speed or capacity claim yet.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>HOW TO READ A FUTURE RESULT</p>
            <p>
              A result will describe one tested configuration, not every model,
              prompt, context length, client, or DGX Spark installation. Use it
              to reproduce that configuration—not as a universal performance
              guarantee.
            </p>
          </article>
        </div>

        <p className={styles.benchLegal}>
          NVIDIA and DGX are trademarks and/or registered trademarks of NVIDIA
          Corporation. Spark Plug and GameWorlds are independent and are not
          sponsored, endorsed, or affiliated with NVIDIA. Model names belong to
          their respective owners.
        </p>
      </section>
    </main>
  );
}
