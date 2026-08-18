# Security design and release checklist

## Threat model priorities

1. A malicious creator attempts to hide secrets or excessive permissions in a
   setup manifest.
2. A browser tampers with plan/verification claims to obtain premium assets or
   payouts.
3. A forged or replayed payment webhook attempts to mutate entitlements twice.
4. A service secret is imported into a Client Component or logged.
5. Public-release automation accidentally copies private repository history,
   data, screenshots, configuration, or media.

## Required controls

- Treat every downloaded manifest as untrusted and require explicit owner
  approval before local mutation.
- Validate manifests against a deny-by-default schema; reject credential-like
  keys, absolute host paths, embedded binaries, sessions, and output references.
- Verify signed Pro snapshots locally and refresh only when stale/on demand;
  resolve every hosted protected mutation from server-owned state.
- Keep service-role, Stripe, signing, and local-agent credentials out of all
  `NEXT_PUBLIC_` variables and browser bundles.
- Verify Stripe signatures over the raw body and enforce event-ID idempotency.
- Keep public catalog metadata separate from manifest delivery; authorize paid
  manifests by owner or paid order and return them `private, no-store`.
- Enable Supabase RLS before grants and test policies as anonymous,
  authenticated owner, authenticated non-owner, verified creator, and service.
- Store only a keyed HMAC of request addresses for waitlist rate limiting.
- Avoid logging request bodies, auth tokens, email addresses, checkout payloads,
  local paths, or manifests before redaction.
- Keep CSP, clickjacking, MIME sniffing, referrer, permissions, and noindex
  preview headers under regression test.

## Release checks

- `npm ci`, unit tests, lint, production build, and production-server smoke pass.
- Accessibility scan passes with keyboard-only navigation and reduced motion.
- Mobile widths show no horizontal document overflow.
- Secret scan and dependency audit return no high/critical findings.
- Public boundary review confirms the repository has new history only and every
  binary asset is original and intentionally included.
- Supabase migration is reviewed in a disposable project before production.
- Threat-model and cost-control gates in `THREAT_MODEL.md` and
  `COST_CONTROLS.md` are reviewed with the RLS role matrix.
- Production environment values are set in Vercel; no `.env` file is committed.
- Legal/privacy/fee text receives owner and qualified counsel review before
  public accounts or payments open.
