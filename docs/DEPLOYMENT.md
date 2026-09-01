# Vercel, Supabase, and stage-promotion runbook

This repository is prepared for deployment but must not be published from an
automated audit or delegated task.

## 1. Owner review

- Review the public-boundary checklist and repository history.
- Confirm the product name, contact addresses, $5 Pro price, annual discount,
  creator rules, and non-affiliation text.
- Keep `NEXT_PUBLIC_SITE_INDEXABLE=false` through private previews.
- Keep `NEXT_PUBLIC_SITE_STAGE=preview` until every Preview gate passes.

## 2. Supabase staging

- Create a new project dedicated to the public launch; do not reuse a private
  product database.
- Apply migrations through the Supabase CLI in staging.
- Run RLS tests across anonymous, owner, non-owner, buyer, non-buyer, unverified
  Pro, each verified class, moderator, and service roles. Verify paid manifests
  never enter catalog responses or public caches.
- Copy the project URL and service-role key into Vercel encrypted environment
  settings. Never put the service-role key in browser code.
- Generate a new random waitlist HMAC secret and store it only in Vercel.

## 3. Vercel preview

- Import this clean repository as a new Vercel project.
- Use `npm ci` and `npm run build` (already declared in `vercel.json`).
- Set `NEXT_PUBLIC_SITE_URL` to the exact preview/production origin appropriate
  to the environment.
- Validate headers, metadata, forms, legal routes, responsive layout, keyboard
  navigation, and reduced motion on the generated preview URL.

## 4. Commercial payments (later gate)

- Confirm $5 monthly and $48 annual Pro, refund, cancellation, failed-payment,
  grace-period, and tax terms.
- Add only the approved Pro Stripe products/prices. Paid marketplace and Connect
  remain out of scope for the first Commercial stage.
- Keep `PAYMENTS_MODE=disabled` while configuring. In a disposable Stripe
  test-mode account, validate raw-body signatures, parallel duplicates, stale
  lease recovery, out-of-order subscription events, refunds, disputes, and
  downgrade and portal readiness before setting `PAYMENTS_MODE=test`.
- Populate `billing_price_catalog` only from owner-approved Stripe price IDs;
  source ships with no active price.

## 5. Stage promotion

- Attach an approved domain or subdomain when ready; a Vercel project URL is
  sufficient for prelaunch review.
- Promote Preview → Release only after artifacts, software terms, legal, security,
  accessibility, and content approval; then set indexing true.
- Promote Release → Commercial only after auth, RLS, checkout, portal, webhook,
  entitlement, cancellation, deletion, and moderation tests pass.
- Rebuild, verify canonical/OG URLs on the production host, then publish.
- DNS changes, production deployment, purchases, and payment activation require
  direct owner action or explicit authorization.

## Route activation matrix

| Surface | Source status | External activation gate |
| --- | --- | --- |
| Cinematic launch/legal/waitlist | Implemented | New public Supabase + Vercel preview approval |
| Catalog metadata/free manifest delivery | Implemented | Migration/RLS matrix in disposable staging |
| Pro signed-entitlement refresh | Implemented | Dedicated signing key + client integration tests |
| Stripe webhook projection | Implemented, default disabled | Stripe test-mode replay/concurrency tests |
| Profile submission API | Implemented, no public UI | Staging scanner/RLS/rate tests and moderation operations |
| Profile moderation/publication UI | Database ready | Reviewer roles, audit workflow, owner approval |
| Forum write UI/API | Schema/RLS ready | Spam/rate controls and moderation operations |
| Pro checkout and billing portal | Implemented, stage/payment gated | Commercial stage plus explicit test/live authorization |
| Paid marketplace and Connect | Excluded from first Commercial stage | A future separately approved product plan |
