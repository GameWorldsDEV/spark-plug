# Public service threat model

This model covers the clean-room website, dedicated public Supabase project,
signed entitlement snapshots, public profile marketplace, forum, Stripe, and
Connect. It excludes the private/local product except at the explicit manifest
handoff boundary.

## Assets and adversaries

Protected assets are account identity, subscription/order state, payout state,
paid profile manifests, signing/service/webhook keys, moderation provenance,
forum integrity, and owner trust. Relevant adversaries include anonymous
scrapers, abusive signed-in users, malicious publishers/buyers, forged webhook
senders, compromised browser sessions, dependency/build attackers, and an
accidental release process that copies private material.

## Primary abuse cases and controls

| Abuse case | Required control | Residual/operational check |
| --- | --- | --- |
| Forge Pro or creator class | Ed25519 token verification; server-owned subscription/class; exact claims | Protect signing key, rotate with overlap, alert on refresh anomalies |
| Force free tier to phone home | Missing token resolves Community locally; `shouldRefresh(null)=false` | Client integration test on every supported agent/client |
| Exfiltrate a paid manifest through catalog/RLS | Metadata-only catalog; manifest column grants revoked; paid RPC checks owner/order | Disposable-project RLS tests as anon, buyer, non-buyer, owner |
| Publish executable/secrets/local data | Strict schema + runtime denylist + immutable digest + service-only version insertion + moderation | Human review; local installer revalidates and requests consent |
| Swap HF model after review | Full 40-character revision and per-file SHA-256 | Installer checks downloaded bytes; license/gated model policy |
| Replay/concurrently deliver a webhook | Raw-byte HMAC/timestamp verification; event hash; leased idempotency state | Stripe retry/concurrency integration test in test mode |
| Browser changes price, owner, payout, or order | Fixed server price catalog; service-only mutations; webhook projection | Checkout/Connect routes remain disabled until tested |
| Escalate verification/publication via direct SQL API | Forced RLS, narrow column grants, managed-field triggers | Migration lint + adversarial policy matrix |
| Forum spam, vote manipulation, or unsafe content | Auth ownership, unique vote target, pending moderation, re-review on edits | Add API rate limits/CAPTCHA policy before forum UI opens |
| Leak voter identities or reviewer notes | No public vote-table read; moderation tables service-only | Public response snapshot tests |
| Leak credentials through errors/logs | Generic errors; no body/token/manifest logging; raw webhook never stored | Vercel/Supabase log review and redaction test |
| Copy private history/assets/data into public release | Standalone root history; explicit boundary; binary and secret scans | Human clean-room review before any remote/push |

## Fail-closed behavior

- Payment routes are unavailable unless `PAYMENTS_MODE` is explicitly `test` or
  `live`; missing configuration never silently enables them.
- Unknown entitlement keys/claims, stale tokens, unapproved prices, unknown
  Stripe accounts, mismatched orders, and unclaimed events are rejected.
- Authorization failures for paid content do not reveal ownership or purchase
  state.
- A non-empty legacy inline manifest blocks the hardening migration for explicit
  review instead of being erased or exposed.

## Required security validation before activation

Run the RLS matrix, raw-webhook replay/concurrency tests, schema fuzz tests,
dependency and secret scans, browser accessibility/security-header gates, and a
manual review of every public binary and route. Checkout, Connect, profile
publication, and forum write APIs remain release blockers until their endpoint
tests and owner decisions are complete.
