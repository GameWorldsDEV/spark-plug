# Commercial service setup checklist

Do not paste secrets into chat, issues, commits, screenshots, or public docs.
Store them directly in the Vercel project and local ignored environment files.

## Owner decisions

- [ ] Confirm Pro at $5 monthly and $48 annually.
- [ ] Choose marketplace commission percentage.
- [ ] Choose initial seller/buyer countries and USD-only or multi-currency.
- [ ] Choose minimum and maximum asset prices.
- [ ] Approve digital-download refund window and exceptions.
- [ ] Choose package/storage/bandwidth limits by asset type.
- [ ] Decide whether private profile sync ships in the first Pro release.
- [ ] Obtain counsel-approved buyer, seller, billing, privacy, IP/takedown,
      Maryland venue, consumer, and dispute terms.

## Supabase and Google

- [ ] Create a dedicated Spark Plug public Supabase project; do not reuse a
      private product or development database.
- [ ] Record the project URL, publishable key, and service-role key in Vercel.
- [ ] Create a Google Auth Platform web application.
- [ ] Configure branding, support/privacy links, authorized origin, and the exact
      Supabase callback URL.
- [ ] Enable only `openid`, email, and profile scopes.
- [ ] Add localhost, preview, and production redirect allowlists separately.
- [ ] Configure account deletion, session revocation, and recovery behavior.
- [ ] Apply migrations in a disposable project and pass the complete RLS role
      matrix before production.

## Stripe Billing and Connect

- [ ] Finish GameWorlds LLC platform verification in Stripe.
- [ ] Create test-mode monthly and annual Pro products/prices.
- [ ] Configure the Customer Portal cancellation and payment-method rules.
- [ ] Register the exact webhook endpoint and store its signing secret in Vercel.
- [ ] Configure Stripe Connect seller onboarding and payout capabilities.
- [ ] Select the charge model only after fee, dispute, refund, negative-balance,
      and merchant-of-record responsibility is approved.
- [ ] Configure the commission as a fixed server-owned basis-point value.
- [ ] Complete test subscription, cancellation, refund, dispute, onboarding,
      payout, paid-download, replay, duplicate, and out-of-order webhook runs.

## Edge, abuse, and operations

- [ ] Add Vercel WAF rules and route-specific rate limits.
- [ ] Add CAPTCHA/bot challenges to abusive auth and mutation paths.
- [ ] Configure package quarantine, scanning, decompression limits, and review.
- [ ] Configure database, auth, email, storage, egress, function, and Stripe cost
      alerts plus emergency commerce kill switches.
- [ ] Create moderation, takedown, appeal, refund, incident, backup, restore, key
      rotation, and support runbooks.
- [ ] Complete accessibility, privacy, security, dependency, secret, RLS, and
      authorization testing.

## Activation

- [ ] Keep `NEXT_PUBLIC_SITE_STAGE=preview`, indexing off, and
      `SPARKPLUG_COMMERCE_READY=false` during setup.
- [ ] Run private test mode and a limited reviewed creator beta.
- [ ] Record owner approval and the exact Git commit/deployment receipt.
- [ ] Enable production only after every gate above passes.
