# Deployment receipts

Each Vercel deployment must identify the exact Git commit and approved launch
stage. A receipt records deployment; it does not authorize a later stage.

## 2026-09-01 Preview

- Owner instruction: implement the approved three-stage completion plan and
  publish the Preview for audit.
- Git commit: `2a63423d` (`feat: implement staged public launch plan`).
- Vercel deployment: `dpl_HXLqfSPdmRWtbFAMJ45JzcF1xE3Z`.
- Immutable URL: <https://sparkplug-public-launch-site-fetzr4lh9.vercel.app>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app>.
- Launch stage: `preview`.
- Indexing: disabled; `robots.txt` disallows all and `X-Robots-Tag` is
  `noindex, nofollow`.
- Downloads, accounts, subscriptions, publishing, and hosted training: disabled.
- Validation: typecheck, lint, 112 unit tests, production build, 33 Playwright/axe
  checks, dependency audit, secret scan, security-header check, and a 33-link
  crawl passed.
- Domain state: `sparkplug.gameworlds.ai` is attached in Vercel but DNS still
  points to `185.53.179.128`. Replace the external DNS record with Vercel's
  assigned CNAME before enabling the canonical redirect.
- Release and Commercial promotion: not approved by this receipt.
