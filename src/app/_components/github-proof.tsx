import { getGitHubMetrics, githubMetricsRepositoryUrl, type GitHubMetrics } from "../../lib/github-metrics";
import { githubSponsorsStatus, stripeSupportUrl } from "../../lib/support-links";
import styles from "./github-proof.module.css";

type GitHubProofProps = { metrics?: GitHubMetrics };

const count = new Intl.NumberFormat("en-US");

export async function GitHubProof({ metrics: providedMetrics }: GitHubProofProps = {}) {
  const metrics = providedMetrics ?? await getGitHubMetrics();
  const stars = metrics.stars === null ? "Unavailable" : count.format(metrics.stars);
  const downloads = metrics.status === "preparing"
    ? "Coming soon"
    : metrics.latestReleaseDownloads === null
      ? "Unavailable"
      : count.format(metrics.latestReleaseDownloads);

  return (
    <section className={styles.proof} aria-labelledby="github-proof-title">
      <div className={styles.intro}>
        <p>OPEN DEVELOPMENT / LIVE GITHUB SIGNALS</p>
        <h2 id="github-proof-title">Follow the build.</h2>
        <div className={styles.actions}>
          <a href={githubMetricsRepositoryUrl} rel="noopener noreferrer">Open the GitHub repository <span aria-hidden="true">↗</span></a>
          <a href={stripeSupportUrl} rel="noopener noreferrer">Support Spark Plug <span aria-hidden="true">↗</span></a>
        </div>
        <p className={styles.supportNote}>
          Choose any amount from $1. GitHub Sponsors is {githubSponsorsStatus === "pending" ? "coming soon" : "available"}.
          Optional support is not a purchase or a tax-deductible charitable donation.
        </p>
      </div>
      <dl className={styles.metrics}>
        <div><dt>GitHub stars</dt><dd><strong>{stars}</strong><small>Public repository total</small></dd></div>
        <div><dt>Latest release downloads</dt><dd><strong>{downloads}</strong><small>{metrics.releaseTag ? `Release ${metrics.releaseTag} assets` : "No public release asset yet"}</small></dd></div>
      </dl>
      <p className={styles.note}>
        GitHub aggregate counts · refreshed hourly. Downloads cover assets attached to the latest
        public GitHub release, not repository clones or all-time traffic.
      </p>
    </section>
  );
}
