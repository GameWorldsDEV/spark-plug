import Link from "next/link";

import { BENCH_METHOD, PUBLISHED_RUNS } from "@/lib/benchmarks";
import { detailMetadata } from "@/lib/metadata";
import styles from "../page.module.css";

export const metadata = detailMetadata(
  "Benchmarks",
  "Model performance measured on our own DGX Spark by the Spark Plug broker. Coming soon — no reprinted leaderboards, no estimates.",
  "/benchmarks",
);

export default function BenchmarksPage() {
  return (
    <main className={styles.benchPage}>
      <header className={styles.benchPageHeader}>
        <Link className={styles.wordmark} href="/" aria-label="Spark Plug home">
          <span aria-hidden="true" className={styles.mark}>
            <span />
          </span>
          <span>SPARK PLUG</span>
        </Link>
        <Link className={styles.headerCta} href="/#benchmarks">
          ← Back to the story
        </Link>
      </header>

      <div className={styles.benchHero}>
        <p className={styles.sectionIndex}>MEASURED, NOT MARKETED / COMING SOON</p>
        <h1>Benchmarks measured on our own box.</h1>
        <p>
          Every number that will appear on this page is produced by the Spark
          Plug broker running a model on our own NVIDIA DGX Spark, with the
          method and date attached. Nothing is reprinted from another
          leaderboard, estimated, or projected — if we didn&rsquo;t measure
          it, it isn&rsquo;t here.
        </p>
      </div>

      <section
        className={styles.benchPageBody}
        aria-labelledby="bench-runs-title"
      >
        <div className={styles.benchPanel}>
          <p className={styles.panelTag} id="bench-runs-title">
            PUBLISHED RUNS / DGX SPARK
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
                        The first broker-signed runs land in these columns.
                        The table stays empty until they do.
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
              All runs execute on a single NVIDIA DGX Spark — GB10 Grace
              Blackwell, 128&nbsp;GB unified memory — driven end-to-end by the
              Spark Plug broker, the same path your agents use. That means the
              numbers include the queue, the ledger, and the real serving
              stack, not a bare-metal best case.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>WHAT WILL BE REPORTED</p>
            <p>
              Model and quantisation, the context window it ran at, prefill
              and decode throughput, the measurement date, and the broker
              build. Each row is reproducible from its method line: median of
              at least five requests, greedy decode, otherwise-idle box.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>READY FOR THE NEWEST QWEN</p>
            <p>
              First candidates for the bench:{" "}
              <a
                href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"
                rel="noopener noreferrer"
              >
                Qwen3.6-35B-A3B
              </a>{" "}
              via{" "}
              <a
                href="https://huggingface.co/unsloth/Qwen3.6-35B-A3B-NVFP4"
                rel="noopener noreferrer"
              >
                Unsloth&rsquo;s NVFP4 build
              </a>
              , with the community&rsquo;s{" "}
              <a
                href="https://huggingface.co/Koopah/Qwen3.6-35B-A3B-NVFP4-DSPARK"
                rel="noopener noreferrer"
              >
                DGX-Spark-tuned speculative-decoding draft
              </a>{" "}
              alongside it.
            </p>
          </article>
          <article className={styles.benchCard}>
            <p className={styles.panelTag}>THE WIDER PICTURE</p>
            <p>
              For independent, industry-wide comparisons, cross-reference{" "}
              <a href="https://artificialanalysis.ai" rel="noopener noreferrer">
                Artificial Analysis
              </a>
              . We link to their work instead of reprinting their data.
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
