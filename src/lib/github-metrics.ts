import "server-only";

const REPOSITORY = "GameWorldsDEV/spark-plug";
const API_ROOT = "https://api.github.com";

export const GITHUB_METRICS_REVALIDATE_SECONDS = 3600;
export const GITHUB_METRICS_TIMEOUT_MS = 3000;

export type GitHubMetrics = {
  stars: number | null;
  latestReleaseDownloads: number | null;
  releaseTag: string | null;
  updatedAt: string | null;
  status: "live" | "preparing" | "unavailable";
};

type NextFetchInit = RequestInit & { next?: { revalidate: number } };
type GitHubFetch = (input: string, init?: NextFetchInit) => Promise<Response>;

type GitHubMetricsOptions = {
  fetcher?: GitHubFetch;
  token?: string;
  timeoutMs?: number;
  now?: () => Date;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readCount(value: unknown) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function requestInit(token: string | undefined, signal: AbortSignal): NextFetchInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Spark-Plug-Public-Site",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    cache: "force-cache",
    headers,
    next: { revalidate: GITHUB_METRICS_REVALIDATE_SECONDS },
    signal,
  };
}

async function readJson(response: Response) {
  if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
  return response.json() as Promise<unknown>;
}

export async function getGitHubMetrics(options: GitHubMetricsOptions = {}): Promise<GitHubMetrics> {
  const fetcher = options.fetcher ?? (fetch as GitHubFetch);
  const token = options.token ?? process.env.GITHUB_TOKEN;
  const signal = AbortSignal.timeout(options.timeoutMs ?? GITHUB_METRICS_TIMEOUT_MS);
  const init = requestInit(token, signal);
  const updatedAt = (options.now ?? (() => new Date()))().toISOString();

  let stars: number;
  try {
    const repository = await readJson(await fetcher(`${API_ROOT}/repos/${REPOSITORY}`, init));
    const parsedStars = isRecord(repository) ? readCount(repository.stargazers_count) : null;
    if (parsedStars === null) throw new Error("GitHub repository response did not include a safe star count");
    stars = parsedStars;
  } catch {
    return { stars: null, latestReleaseDownloads: null, releaseTag: null, updatedAt: null, status: "unavailable" };
  }

  try {
    const response = await fetcher(`${API_ROOT}/repos/${REPOSITORY}/releases/latest`, init);
    if (response.status === 404) {
      return { stars, latestReleaseDownloads: null, releaseTag: null, updatedAt, status: "preparing" };
    }

    const release = await readJson(response);
    if (!isRecord(release) || typeof release.tag_name !== "string" || !Array.isArray(release.assets)) {
      throw new Error("GitHub release response did not match the expected schema");
    }

    let downloads = 0;
    for (const asset of release.assets) {
      const count = isRecord(asset) ? readCount(asset.download_count) : null;
      if (count === null || !Number.isSafeInteger(downloads + count)) {
        throw new Error("GitHub release response contained an unsafe download count");
      }
      downloads += count;
    }

    return {
      stars,
      latestReleaseDownloads: downloads,
      releaseTag: release.tag_name,
      updatedAt,
      status: "live",
    };
  } catch {
    return { stars, latestReleaseDownloads: null, releaseTag: null, updatedAt, status: "unavailable" };
  }
}

export const githubMetricsRepositoryUrl = `https://github.com/${REPOSITORY}`;
