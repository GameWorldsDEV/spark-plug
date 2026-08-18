# Validation snapshot — 2026-08-18

Local-only checkpoint; no hosted resources were changed.

## Automated gates

- Unit/component/API-boundary tests: 14 passed.
- Production browser tests: 9 passed.
- Axe browser scan: zero automatic violations on `/`, `/privacy`, `/terms`,
  `/trademarks`, and `/security`.
- Responsive overflow: zero document overflow at 390×844, 820×1180, and
  1440×900.
- Reduced-motion behavior and monthly/annual pricing interaction: passed.
- Security/noindex headers and route-specific social metadata: passed.
- Waitlist body cap: both declared-length and chunked payloads above 16 KiB
  return HTTP 413 in the production server; unit tests also assert early stream
  cancellation.
- TypeScript, ESLint, and production Next.js build: passed.
- Dependency audit: zero known vulnerabilities at the configured audit level.
- Staged clean-room repository scan with gitleaks 8.30.1: no leaks found.

## Lighthouse local production run

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 63 |

Measured local LCP was 2.0 s, CLS was 0, total blocking time was 10 ms, and
the loaded transfer was 189 KiB. SEO is deliberately reduced because every
prelaunch response is `noindex, nofollow`; it must remain that way until owner,
legal, security, domain, and content approval.

Lighthouse is a lab measurement, not a production field guarantee. Re-run it on
the exact Vercel preview and production domain before public launch.
