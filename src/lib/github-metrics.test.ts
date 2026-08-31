import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { GITHUB_METRICS_REVALIDATE_SECONDS, getGitHubMetrics } from "./github-metrics";

const at = () => new Date("2026-08-31T12:00:00.000Z");
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("getGitHubMetrics", () => {
  it("returns public stars and the sum of latest-release asset downloads", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ stargazers_count: 27 }))
      .mockResolvedValueOnce(json({ tag_name: "v1.0.0", assets: [{ download_count: 8 }, { download_count: 13 }] }));

    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toEqual({
      stars: 27,
      latestReleaseDownloads: 21,
      releaseTag: "v1.0.0",
      updatedAt: "2026-08-31T12:00:00.000Z",
      status: "live",
    });
  });

  it("preserves verified numeric zero", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ stargazers_count: 0 }))
      .mockResolvedValueOnce(json({ tag_name: "v1.0.0", assets: [{ download_count: 0 }] }));

    const result = await getGitHubMetrics({ fetcher, now: at });
    expect(result.stars).toBe(0);
    expect(result.latestReleaseDownloads).toBe(0);
    expect(result.status).toBe("live");
  });

  it("calls a missing latest release preparing instead of zero downloads", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ stargazers_count: 4 }))
      .mockResolvedValueOnce(json({ message: "Not Found" }, 404));

    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toMatchObject({
      stars: 4,
      latestReleaseDownloads: null,
      status: "preparing",
    });
  });

  it("rejects malformed public counts", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(json({ stargazers_count: "many" }));
    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toMatchObject({ status: "unavailable", stars: null });
  });

  it("fails closed on a rate limit", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(json({ message: "rate limited" }, 403));
    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toMatchObject({ status: "unavailable", stars: null });
  });

  it("fails closed on a timeout", async () => {
    const fetcher = vi.fn((_url: string, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Timed out", "AbortError")));
    }));

    await expect(getGitHubMetrics({ fetcher, timeoutMs: 1, now: at })).resolves.toMatchObject({ status: "unavailable" });
  });

  it("fails closed on a network error", async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new TypeError("offline"));
    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toMatchObject({ status: "unavailable" });
  });

  it("keeps stars but withholds malformed latest-release downloads", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ stargazers_count: 9 }))
      .mockResolvedValueOnce(json({ tag_name: "v1", assets: [{ download_count: -1 }] }));

    await expect(getGitHubMetrics({ fetcher, now: at })).resolves.toMatchObject({
      stars: 9,
      latestReleaseDownloads: null,
      status: "unavailable",
    });
  });

  it("uses server authorization, the API version, timeout signal, and one-hour cache", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({ stargazers_count: 1 }))
      .mockResolvedValueOnce(json({ message: "Not Found" }, 404));

    await getGitHubMetrics({ fetcher, token: "server-secret", now: at });
    const [, init] = fetcher.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer server-secret");
    expect(headers["X-GitHub-Api-Version"]).toBe("2022-11-28");
    expect(init?.cache).toBe("force-cache");
    expect(init?.next).toEqual({ revalidate: GITHUB_METRICS_REVALIDATE_SECONDS });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
});
