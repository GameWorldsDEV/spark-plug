# Low-call-cost controls

The design minimizes hosted calls without making authorization stale forever.

## No-call and cache paths

- Community local use: **zero auth and entitlement calls**.
- Pro local use: verify the cached signed snapshot at every startup; refresh only
  on demand or within 12 hours of its seven-day expiry.
- Public key set: long immutable/cacheable response per key rotation.
- Catalog and free manifests: Vercel shared cache for 5 minutes with 24-hour
  stale-while-revalidate.
- Paid manifests and entitlement refresh: private/no-store because authorization
  or current payment state matters.

## Bounded database/work limits

- Catalog page size is clamped to 1–50 and uses indexed date cursors, never
  unbounded offsets.
- Manifests are at most 64 KiB, eight models, 32 files per model, and two TiB of
  declared bytes. Request bodies are streamed with hard caps.
- Webhooks are capped at 256 KiB; only a small projection and SHA-256 receipt are
  persisted.
- Community has unlimited local profiles but zero hosted publishing. Active Pro
  has exactly ten hosted published slots, free or paid. Profile versions are
  immutable and publication is service-reviewed.
- The public catalog omits manifest bodies, reducing egress and preventing paid
  data from entering edge caches.
- Database indexes cover published catalog order, profile versions, orders,
  visible forum content, and vote targets.

## Abuse and budget gates

Before public writes open, set owner-approved per-account/IP-HMAC rate budgets
for profile validation, forum posts/comments/votes, entitlement refresh,
checkout creation, and Connect links. Return `429` with backoff; never enqueue
unbounded background work. Add spend/usage alerts in Vercel, Supabase, Stripe,
and email delivery, with a documented emergency switch that preserves free local
functionality.

Suggested initial review values (not active policy): 20 posts/day, 100
comments/day, 500 vote changes/day, 10 profile validations/hour, and 6
entitlement refresh attempts/hour/account. The owner must approve these after a
staging load test.

## Cost observability without private data

Track aggregate route count, latency, status, cache hit rate, and database rows
scanned. Do not send profile bodies, prompts, outputs, tokens, emails, host paths,
or Stripe payloads to analytics. Retention and provider selection are owner/legal
decisions.
