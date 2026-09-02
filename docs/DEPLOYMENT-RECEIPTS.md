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
