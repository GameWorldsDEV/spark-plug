# Product and hosted-service handoff

This file is the coordination point between the private product task and the
public release repository. It does not authorize copying private source or
activating external services.

## Waiting public surfaces

- GitHub: <https://github.com/GameWorldsDEV/spark-plug>
- Website: <https://sparkplug-public-launch-site.vercel.app>
- Default branch: `main`
- GitHub CI: lint, typecheck, unit tests, production build
- Search indexing: disabled
- Payments: disabled
- Public Supabase project: not created or connected
- Product download: not published

## What the product task should report when ready

Provide the exact private source commit and a release manifest containing:

- approved public file allowlist;
- excluded private paths and data classes;
- broker/client contract version;
- supported node, OS, architecture, and dependency versions;
- installer, rollback, and uninstall behavior;
- capability and known-limitation table;
- complete tests and real-node canary results;
- third-party dependency/license inventory;
- binary artifact list and SHA-256 checksums.

Do not send credentials, profiles, prompts, outputs, node addresses, internal
URLs, Tailnet information, account pools, local paths, logs, model weights,
caches, customer data, or private Git history.

## Public integration sequence

1. Read the completed product task and record its exact source commit.
2. Compare its release manifest against `PRODUCT.md`, `RELEASE-PLAN.md`, and
   `PUBLIC_BOUNDARY.md`.
3. Extract only allowlisted source into a new branch based on public `main`.
4. Run two secret scanners, binary review, license review, dependency audit, and
   private-identifier search before committing.
5. Add source only to the declared `apps/`, `broker/`, `installer/`,
   `contracts/`, `docs/`, and `tests/` boundaries or an owner-approved revision.
6. Run clean installation, rollback, client pairing, profile admission, engine,
   queue, memory, accessibility, and runtime-state canaries on the supported
   DGX Spark target.
7. Open a public pull request with the evidence receipt; do not push directly to
   `main`.
8. After review, publish source, supported packages, checksums, release notes,
   and documentation as one release.
9. Only then replace the website's “no public product download” statement with
   verified repository and package destinations.

## Hosted-service integration sequence

The other task may prepare application-side adapters, but Supabase and Stripe
remain a separate activation track:

1. Create a new public-launch Supabase project after owner approval.
2. Apply the included migrations in staging and pass the adversarial RLS matrix.
3. Provide Vercel only with encrypted server-side project/service values.
4. Generate dedicated Ed25519 entitlement keys; never reuse a node or private
   product key.
5. Integrate the local client adapter described in `BILLING.md` and prove the
   Community path performs zero entitlement calls.
6. Create Stripe test products/prices only after prices and terms are approved.
7. Add checkout/customer-portal routes from server-owned price IDs.
8. Pass webhook, subscription, refund, dispute, cancellation, expiry, offline,
   and downgrade tests before setting `PAYMENTS_MODE=test`.
9. Live payments require a later, explicit owner authorization.

## Inputs still required from the owner

- final repository license;
- monitored support, privacy, and security addresses;
- legal entity/controller and approved legal terms;
- final paid feature list and price(s);
- cancellation, refund, tax, marketplace fee, and payout rules;
- dedicated Supabase project/region;
- Stripe test account and approved products/prices;
- entitlement signing-key custody and rotation operator;
- final public domain and indexing approval.

GitHub traffic, stars, and forks are useful public-interest signals only. They
are not user identity, analytics consent, payment state, or entitlement inputs.
