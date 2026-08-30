/**
 * Published performance measurements.
 *
 * House rule: every row in PUBLISHED_RUNS was measured by the Spark Plug
 * broker on our own hardware, with the date and method attached. Nothing
 * here is copied from a third-party leaderboard, estimated, or projected.
 * An empty list renders an honest "no published runs yet" state — never
 * placeholder numbers. benchmarks.test.ts enforces the invariants.
 */

export type BenchmarkRun = {
  /** Model name as the broker reports it. */
  model: string;
  /** Weight quantisation, e.g. "NVFP4", "FP8". */
  quant: string;
  /** Context window the run was measured at. */
  contextWindow: number;
  /** Median decode throughput, tokens per second. Must be measured. */
  decodeTps: number;
  /** Median prefill throughput, tokens per second. Must be measured. */
  prefillTps: number;
  /** ISO date the measurement was taken. */
  measuredAt: string;
  /** How it was measured (runs, sampling, load state). */
  method: string;
};

export const BENCH_METHOD =
  "Runs are measured by the broker itself on a single DGX Spark: median of " +
  "at least five requests, greedy decode, otherwise-idle box, reported with " +
  "the measurement date and broker build. If a number is not measured, it " +
  "is not shown.";

export const PUBLISHED_RUNS: BenchmarkRun[] = [
  // Intentionally empty until the first measured runs are published.
  // Add rows only from broker-recorded measurements — see BENCH_METHOD.
];

export function hasPublishedRuns(): boolean {
  return PUBLISHED_RUNS.length > 0;
}

export function validateRun(run: BenchmarkRun): string[] {
  const problems: string[] = [];
  if (!run.model.trim()) problems.push("model name is required");
  if (!run.quant.trim()) problems.push("quantisation is required");
  if (!Number.isFinite(run.contextWindow) || run.contextWindow <= 0) {
    problems.push("context window must be a positive number");
  }
  if (!Number.isFinite(run.decodeTps) || run.decodeTps <= 0) {
    problems.push("decode throughput must be a measured positive number");
  }
  if (!Number.isFinite(run.prefillTps) || run.prefillTps <= 0) {
    problems.push("prefill throughput must be a measured positive number");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(run.measuredAt)) {
    problems.push("measuredAt must be an ISO date (YYYY-MM-DD)");
  } else if (new Date(run.measuredAt).getTime() > Date.now()) {
    problems.push("measuredAt cannot be in the future");
  }
  if (!run.method.trim()) problems.push("method is required");
  return problems;
}
