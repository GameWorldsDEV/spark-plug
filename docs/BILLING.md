# Hosted billing and entitlement boundary

This is preparation, not activation. Supabase projects, Stripe products, prices,
checkout, customer accounts, and live payments remain disabled until the owner
provides the required production decisions and explicitly authorizes each gate.

## Paid value boundary

Paid capabilities are limited to optional presentation and hosted convenience:
premium themes, motion packs, private profile sync, version history, up to ten
hosted free profiles, creator download analytics, and opt-in early releases.

The following are always local Community capabilities and must never be gated:

- node-owned accounts and secure client pairing;
- local profiles and profile validation;
- vLLM, Colibri, ComfyUI, routing, queues, and memory controls;
- core security, accessibility, diagnostics, and output return;
- offline operation of the local program.

## System separation

```text
Stripe                 Supabase public service          Local Spark Plug
------                 -----------------------          -----------------
checkout/payment  -->  server-owned subscription  -->  signed Pro snapshot
signed webhook         entitlement projection          verified locally
                       no local prompts/outputs         cached until expiry
```

Stripe is authoritative for payment events. Supabase stores the narrow hosted
projection needed for accounts, subscriptions, purchases, and publishing. The
local product receives only an Ed25519-signed entitlement containing an opaque
user ID, plan, capability allowlist, creator class, hosted-profile limit, issued
time, expiry, and token ID. It receives no card, Stripe customer, email, prompt,
output, node, model, or route data.

## Free path

With no entitlement token, the client immediately selects Community and makes
no hosted call. A missing, invalid, unknown-key, or expired token removes paid
capabilities but never disables the local core.

## Pro path

1. The user explicitly signs in to the optional hosted service.
2. Stripe Checkout, created by a server route from an owner-approved price
   allowlist, completes outside the local product.
3. A verified Stripe webhook updates a server-owned Supabase projection.
4. The entitlement refresh route authenticates the user and reads that
   projection; browser-supplied plan or price claims are ignored.
5. The service issues a maximum seven-day signed snapshot.
6. The local product verifies the exact key, issuer, audience, claims, times,
   and signature without a network request.
7. Refresh happens only on demand or inside the final 12-hour stale window.

## Existing prepared components

- forced-RLS Supabase schema for profiles, subscriptions, orders, publishing,
  webhook receipts, moderation, and an empty price allowlist;
- raw-body Stripe signature verification with timestamp checks;
- leased webhook idempotency and a reduced safe event projection;
- signed entitlement schema, key-set route, local verification library, and
  refresh route;
- `PAYMENTS_MODE=disabled` as the source default;
- Commercial-stage checkout and billing-portal routes that fail closed unless
  the site stage, payment mode, authenticated user, and fixed server price
  allowlist all agree;
- no Connect, paid-listing, order, or creator-payout activation.

## Code handoff contract for the product task

The public local client needs a small entitlement adapter with these behaviors:

- default to Community without network I/O;
- read a cached token from platform-secure storage;
- validate using `schemas/entitlement-claims.v1.schema.json` and the published
  JWK set;
- map only the signed capability allowlist to presentation/hosted features;
- preserve the core when refresh, sign-in, network, or payment service fails;
- remove premium presentation cleanly after expiry without corrupting profiles;
- never send local profile bodies, prompts, outputs, routes, addresses, model
  inventory, or node telemetry to entitlement APIs.

## Activation sequence

1. Approve legal entity, privacy controller, support/security addresses, final
   paid capabilities, prices, taxes, refunds, cancellation, and support terms.
2. Create a new Supabase project dedicated to the public service; never reuse a
   private product database.
3. Apply migrations in disposable staging and pass the full RLS adversarial
   matrix.
4. Create Stripe test products/prices and populate the server-owned allowlist.
5. Implement checkout and customer-portal routes with fixed server values.
6. Run webhook replay, concurrency, stale lease, refund, dispute, cancellation,
   out-of-order event, and entitlement-expiry tests.
7. Integrate the local adapter and prove free offline use plus graceful Pro
   expiry.
8. Set `NEXT_PUBLIC_SITE_STAGE=commercial` and `PAYMENTS_MODE=test` only in the
   approved disposable test environment.
9. Complete owner and legal review before any live-mode authorization or stage promotion.

GitHub traffic and stars are public project signals, not billing identity or
entitlement inputs. They must never unlock paid capability.
