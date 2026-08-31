# GitHub operations

Repository: <https://github.com/GameWorldsDEV/spark-plug>

The repository is public so people can follow release preparation, star the
project, open scoped issues, and review documentation before product source
arrives. The README and website must continue to distinguish repository
availability from product-download availability.

## Current automation

- GitHub Actions runs lint, typecheck, unit tests, and the production build on
  pushes to `main` and pull requests.
- Dependabot checks npm and GitHub Actions dependencies weekly.
- CODEOWNERS requests review from `@GameWorldsDEV`.
- Issue forms separate bugs, feature requests, and private security reports.
- The public website links directly to the repository.

## Analytics and stars

GitHub provides repository traffic, clone, referrer, and popular-content data to
maintainers under **Insights → Traffic**. Stars and forks are public signals.
No third-party tracking script, GitHub user identity, or star event is copied
into Spark Plug accounts, billing, or local telemetry.

The website may display two narrowly defined public aggregates:

- the repository `stargazers_count`; and
- the sum of asset `download_count` values on GitHub's latest public release.

These counts are fetched by the Next.js server from the allowlisted
`GameWorldsDEV/spark-plug` repository, cached for one hour, and bounded by a
three-second timeout. An optional `GITHUB_TOKEN` is server-only and must never be
prefixed with `NEXT_PUBLIC_`, returned to a browser, or written to logs. The
browser receives only rendered aggregate numbers.

A missing latest release is displayed as **Coming soon**, not zero. GitHub errors,
rate limits, timeouts, or malformed responses are displayed as **Unavailable**.
A numeric zero is shown only when GitHub actually returns a valid zero. The
download label always says **Latest release downloads**; it is not an all-time
download, repository-clone, traffic, user, billing, or entitlement metric.

Review clone, referrer, and popular-content traffic in GitHub itself. Do not add
a browser analytics SDK merely to display repository interest.

## Release use

Create signed GitHub Releases only after the gates in `RELEASE-PLAN.md` pass.
Each release should include:

- versioned source tag;
- supported node/client matrix;
- release notes and known limitations;
- installer and package checksums;
- dependency/license notice;
- measured compatibility or benchmark receipts;
- upgrade and rollback instructions.

Do not upload private profiles, runtime logs, model files, credentials, node
addresses, or build artifacts that were not produced by the reviewed public
workflow.
