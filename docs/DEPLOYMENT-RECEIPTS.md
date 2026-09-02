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

## 2026-09-01 Open-source Preview

- Owner instruction: remove the paid product architecture, make Spark Plug free
  and open source, distribute through GitHub, and allow free verified installers
  or executables on the website.
- Git commit: `5b28599` (`refactor: make Spark Plug fully open source`).
- Vercel deployment: `dpl_FDwkBvtR7CKgasTjsCUScBWYiXZ5`.
- Immutable URL: <https://sparkplug-public-launch-site-1wlhbh6d6.vercel.app>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app>.
- Launch stage: `preview`; indexing and unfinished installer buttons remain
  disabled.
- Distribution: Apache-2.0 source and free GitHub-first community profiles.
  Website installers activate only with matching tagged source, checksum,
  signature, notices, release notes, compatibility evidence, and timestamp.
- Removed: accounts, subscriptions, Pro plans, entitlements, hosted publishing,
  paid marketplace code, product billing routes, waitlist, and Supabase schema.
- Financial support: optional external Stripe tips and pending GitHub Sponsors;
  neither purchases software, features, priority, status, or governance.
- Validation: typecheck, lint, 74 unit tests, production build, 33
  Playwright/axe checks, dependency audit, secret scan, and live route/header
  smoke tests passed.
- Domain state: Vercel accepted the alias, but public DNS still resolves
  `sparkplug.gameworlds.ai` to `185.53.179.128`; the custom domain remains
  unavailable until the external DNS CNAME is corrected.

## 2026-09-02 Themes Preview

- Owner instruction: add a theme-download page featuring Cartridge and Compact
  Disc animation, then catalog the remaining DGX Spark app themes after a
  sanitized live-app review.
- Git commit: `7f51e45` (`feat: add open theme library preview`).
- Vercel deployment: `dpl_21iYdxWKRqccpFq5XXHy51oESXpo`.
- Immutable URL: <https://sparkplug-public-launch-site-bjxarmhzs.vercel.app>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app/themes>.
- Theme downloads remain disabled until version, license, preview, checksum,
  and compatibility evidence are published.
- Validation: typecheck, lint, 74 unit tests, production build, 34
  Playwright/axe checks with one homepage-height regression corrected, targeted
  final browser checks, desktop/mobile visual review, and live smoke test.

## 2026-09-02 Free Theme Library Expansion

- Owner instruction: include Cartridge and Compact Disc free with the
  open-source release, list the built-in color themes, and reserve additional
  theme slots for future releases.
- Git commit: `47248d9` (`feat: expand free theme library`).
- Vercel deployment: `dpl_GhdgesX9Abo2XCa8GVBPidvCQ47R`.
- Immutable URL: <https://sparkplug-public-launch-site-bt37tgfsh.vercel.app/themes>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app/themes>.
- Included collection: Cartridge, Compact Disc, Neon Grid, Cyberdeck Amber,
  Matrix Rain, Synthwave Sunset, Tokyo Night, and Ice / Holo.
- Expansion: six clearly labeled community-theme placeholders were added without
  representing unfinished themes as available products.
- Validation: typecheck, lint, 74 unit tests, production build, targeted mobile
  Playwright regression check, zero horizontal overflow at 390 px, and live
  content smoke verification.

## 2026-09-02 Theme and Motion Catalog Preview

- Owner instruction: show $0.00 on bundled themes and prepare room for additional
  themes and animation packs, including the possibility of clearly priced future
  creator releases.
- Git commit: `3f9936a` (`feat: prepare theme and motion catalog`).
- Vercel deployment: `dpl_BAMfowv8SDRe7JB7EP7gjwdesYSW`.
- Immutable URL: <https://sparkplug-public-launch-site-6n045u03h.vercel.app/themes>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app/themes>.
- Catalog state: all eight bundled entries display $0.00; six future theme slots
  and six future animation slots are visibly reserved. No checkout was enabled.
- Validation: typecheck, lint, 74 unit tests, production build, mobile Playwright
  catalog/overflow regression check, and live stable-URL content verification.

## 2026-09-02 Creator Commerce Preview

- Owner instruction: preserve the free open-source local app while planning a
  paid Pro service, Google-authenticated creator marketplace, free/paid profile
  listings, premium presentation packs, and rights-cleared LoRA sales.
- Git commit: `545f810` (`feat: define gated creator marketplace`).
- Vercel deployment: `dpl_CyMB14Cu4ZdccLL1TsVJfGSuyMmR`.
- Immutable URL: <https://sparkplug-public-launch-site-kfp5947kr.vercel.app>.
- Stable pricing URL: <https://sparkplug-public-launch-site.vercel.app/pricing>.
- Stable marketplace URL: <https://sparkplug-public-launch-site.vercel.app/marketplace>.
- Commercial state: marketing/architecture preview only. Google sign-in,
  subscriptions, publishing, uploads, purchases, and payouts remain disabled;
  account and checkout routes return 404 and the site remains no-index.
- Architecture: dedicated Supabase service, Google OAuth/PKCE, Stripe Billing
  and Connect, locally cached signed Pro state, user-initiated catalog calls,
  immutable signed profile documents, broker-side inventory checks, and
  explicit missing-model acquisition approval.
- Validation: typecheck, lint, 77 unit tests, production build, 36 full
  Playwright/axe checks plus the added gated-commerce regression, dependency
  audit, security/header checks, and live stable-URL verification.

## 2026-09-02 Gated Marketplace Backend Preview

- Owner instruction: build the optional Pro and creator-commerce foundation,
  take a fixed 5% platform fee, require tested hardware compatibility, make
  creators own first-line support/revisions, and escalate unresolved or
  abandoned cases to GameWorlds administrators.
- Git commit: `65d86fa` (`feat: build gated creator marketplace backend`).
- Vercel deployment: `dpl_6r6BowNLiJfLxgtwake3mGkMzWKd`.
- Immutable URL: <https://sparkplug-public-launch-site-fqfj7b9cd.vercel.app>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app>.
- Commercial state: Preview and no-index. Google auth, billing, Connect,
  publishing, sales, support-case mutations, and entitlements fail closed until
  the Commercial stage and private readiness switches are enabled.
- Cost boundary: the website remains the commerce authority; the app receives
  a canonical read-only catalog snapshot cached for one hour with an ETag. Local
  app activity does not query the marketplace.
- Model boundary: packages reference model weights but do not bundle them. Paid
  publication requires an exact, current GameWorlds review of repository,
  immutable revision, license, and safety tier.
- Validation: typecheck, lint, 114 unit tests, production build, 37
  Playwright/axe checks, dependency audit, gitleaks, diff check, and stable-URL
  route/header smoke tests passed.
- External blockers: Supabase refuses project creation while the organization
  has overdue invoices. `sparkplug.gameworlds.ai` remains incorrectly pointed
  at `185.53.179.128`; Dynadot must change the `sparkplug` A record to
  `76.76.21.21` before the custom-domain HTTPS check can pass.
- Follow-up safety commit: `f9f3784` keeps the Stripe Connect charge model
  explicitly unselected, so marketplace checkout cannot activate until fee,
  dispute, refund, and negative-balance responsibility is approved.
- Latest Vercel deployment after that safety gate:
  `dpl_9P6hKK2S2n5SyZEas8QNZZza9Y9R` at
  <https://sparkplug-public-launch-site-ngmghkp6u.vercel.app>.

## 2026-09-02 Monthly Static App Catalog

- Owner instruction: eliminate recurring app marketplace database calls; publish
  one catalog edition per month while keeping website creator pages current for
  mid-month releases.
- Git commit: `3aacbfd` (`feat: serve monthly static app catalog`).
- Vercel deployment: `dpl_3v9VXGk8GoTd5i1YnqkepFtuGzEP`.
- Immutable deployment URL:
  <https://sparkplug-public-launch-site-osztjqmah.vercel.app>.
- Stable audit URL: <https://sparkplug-public-launch-site.vercel.app>.
- App contract: `/catalog/app/current.json` is a 30-day CDN-cached pointer to a
  checksummed, versioned, immutable catalog file. The app retains its last valid
  edition and does not check again before `validUntil`.
- Cost boundary: the app catalog path invokes neither Supabase nor a serverless
  function. The former `/api/v1/catalog/snapshot` endpoint was removed and now
  returns 404. The current website catalog remains separate and CDN-cached.
- Live verification: the pointer returned `200`, the repeat request returned a
  Vercel cache hit, the versioned snapshot returned the one-year `immutable`
  policy, and its SHA-256 matched the pointer.
- Validation: typecheck, lint, 114 unit tests, production build, 38 complete
  Playwright/axe checks, dependency audit with zero vulnerabilities, gitleaks,
  diff check, and stable-URL smoke checks passed.
- Remaining domain blocker: `sparkplug.gameworlds.ai` still resolves to
  `185.53.179.128`, so its HTTPS check fails. The `sparkplug` DNS record must be
  corrected before the canonical domain can serve this deployment.
