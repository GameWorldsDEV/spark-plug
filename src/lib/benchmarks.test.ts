import { describe, expect, it } from "vitest";

import { PUBLISHED_RUNS, validateRun } from "./benchmarks";

describe("published benchmark runs", () => {
  it("every published row passes the measured-data invariants", () => {
    for (const run of PUBLISHED_RUNS) {
      expect(validateRun(run)).toEqual([]);
    }
  });

  it("rejects unmeasured or placeholder rows", () => {
    expect(
      validateRun({
        model: "example",
        quant: "FP8",
        contextWindow: 131072,
        decodeTps: 0,
        prefillTps: -1,
        measuredAt: "someday",
        method: "",
      }),
    ).toEqual([
      "decode throughput must be a measured positive number",
      "prefill throughput must be a measured positive number",
      "measuredAt must be an ISO date (YYYY-MM-DD)",
      "method is required",
    ]);
  });

  it("rejects measurements dated in the future", () => {
    expect(
      validateRun({
        model: "example",
        quant: "FP8",
        contextWindow: 131072,
        decodeTps: 40,
        prefillTps: 900,
        measuredAt: "2999-01-01",
        method: "median of 5 runs",
      }),
    ).toContain("measuredAt cannot be in the future");
  });
});
