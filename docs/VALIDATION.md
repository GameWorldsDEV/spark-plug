# Validation snapshot — 2026-08-30

Release-candidate checkpoint for the noindex Vercel preview.

## Automated gates

- Unit/component/API-boundary tests: 65 passed.
- Production browser tests: 15 passed.
- Axe browser scan: zero automatic violations on `/`, `/privacy`, `/terms`,
  `/trademarks`, and `/security`.
- Responsive overflow: zero document overflow at 390×844, 820×1180, and
  1440×900.
- Reduced-motion behavior, platform detection, disabled unfinished downloads,
  and the public release-manifest contract: passed.
- Four-stage pair, profile, apply, and work story: visually verified at phone
  and desktop sizes; outgoing and incoming copy do not overlap.
- Redesigned homepage is at or below twelve viewport heights at 1440×900,
  compared with roughly twenty-one and a half screens before the rewrite.
- GW Broker/Switchyard, ComfyUI/TRELLIS, remote-device, Rabbit R1, platform
  roadmap, and download claims were checked against the current product task.
- Public product language checked against the current private product task and
  its node, client, profile, engine, queue, memory, and pairing contracts.
- Security/noindex headers and route-specific social metadata: passed.
- Waitlist body cap: both declared-length and chunked payloads above 16 KiB
  return HTTP 413 in the production server; unit tests also assert early stream
  cancellation.
- TypeScript, ESLint, and production Next.js build: passed.
- Dependency audit: zero known vulnerabilities at the configured audit level.
- Public-boundary scan: no private host, node path, private-key marker, live
  payment key, or Supabase service-role assignment found in the public source.

## Historical Lighthouse local production run

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

This score predates the final homepage rewrite and is retained only as a
historical baseline. Lighthouse is a lab measurement, not a production field
guarantee. Re-run it on the exact Vercel preview and production domain before
public launch.
