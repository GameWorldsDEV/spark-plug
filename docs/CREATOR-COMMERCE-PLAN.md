# Spark Plug Pro and creator marketplace plan

Status: approved product direction; implementation remains gated and disabled.

## Product contract

Spark Plug uses an open-core-services model without weakening the open-source
local application.

### Community — free forever

- complete local control app and verified updates;
- unlimited local profiles and local history;
- all qualified engines, routing, queues, ComfyUI, remote clients, pairing,
  diagnostics, and accessibility;
- local Unsloth and LoRA workflows on supported hardware;
- bundled Cartridge, Compact Disc, and six color themes;
- browse and install approved free marketplace releases;
- no account or network heartbeat required for local use.

### Pro — planned at $5 monthly or $48 annually

- premium themes and motion packs;
- Google sign-in and a creator storefront;
- publish approved free or paid creator assets;
- listing version history plus creator download and sales analytics;
- optional private profile sync and restoration;
- opt-in beta and early-release channels.

Pro expiry removes hosted and premium service access only. It never disables,
corrupts, or deletes the local core or local work.

## Creator marketplace

Allowed listing types are declarative Spark Plug profiles, theme packs, motion
packs, and rights-cleared LoRA adapters. A listing may be $0.00 or use an
approved one-time price. Pro is required to publish, not to browse or install
approved free listings.

The GameWorlds platform fee is fixed at **5% (500 basis points)** of each paid
sale. Before seller onboarding, the owner must still approve minimum/maximum price, Stripe
fee allocation, refund/chargeback allocation, payout schedule, reserve policy,
currency, and tax approach. Each value is server-owned; a browser never submits
a trusted fee, price, seller, entitlement, or payout destination.

Profiles are configuration rather than executable plug-ins. They cannot contain
scripts, commands, credentials, secrets, environment values, private paths,
embedded model weights, prompts, outputs, or node telemetry. Model references
must be revision pinned and checksummed.

Every paid technical listing must include the creator's tested compatibility
matrix: computer maker/model, operating system, architecture, memory, applicable
GPU/VRAM, engine and version, model revision, and test date. Creators own
first-line questions, troubleshooting, and revisions. Unresolved cases retain
their version and support history before escalation to GameWorlds administrators.

A refund may be approved when mandatory law requires it; when GameWorlds
reproduces a material defect on a declared-supported configuration and the
creator cannot correct it after a reasonable cure opportunity; or when the
creator abandons the listing or support case. Failure on unlisted hardware is
not by itself proof of a defect. Effective time limits and legal language require
counsel approval before live sales.

LoRA sellers must document rights to training data, permitted base-model use,
adapter output, artwork, and commercial distribution. The listing must separate
the adapter from any model or engine the customer obtains under another license.

## Hosted data boundary

The commercial service may store account identity, subscription projection,
seller onboarding state, public listing metadata, immutable reviewed package
versions, orders, download grants, payout projection, reports, moderation
records, and narrow creator analytics.

It must not receive local prompts, conversations, generated outputs, model
inventory, model weights unless explicitly sold as a rights-cleared asset,
node credentials, private routes, filesystem paths, agent sessions, or local
telemetry. Hosted training is excluded from the first commercial release.

The website uses a dedicated Supabase backend for Google-authenticated Pro
accounts, listings, immutable versions, purchases, moderation, and the narrow
billing projection. The marketplace service and its database can remain a
privately operated GameWorlds service even while the local Spark Plug client and
its public import contract remain open source.

The website remains the marketplace authority. The app may present the same
catalog from a CDN/browser-cached read-only snapshot with a one-hour refresh
period and ETag. Local navigation, profiles, engines, models, queues, prompts,
and jobs never trigger marketplace calls. Sign-in is needed only for explicit
hosted actions such as purchasing a paid package or publishing as a creator.

## Profile builder, export, and one-click import

The canonical transfer format is a versioned, declarative
`application/vnd.gameworlds.sparkplug-profile+json` document using
`schemas/setup-profile.v1.schema.json`. It carries the profile settings, engine
requirements, pinned model repository/revision/file checksums, license and
provenance, minimum Spark Plug version, creator identity class, marketplace
version ID, canonical digest, and service signature. It never carries secrets,
commands, private paths, prompts, outputs, or executable hooks.

Pro creators can produce the same document in either of two ways:

1. export a scrubbed profile from the local Spark Plug app; or
2. use a website profile builder that shares the exact schema and validator.

Publishing always creates an immutable candidate version and sends it to review.
Editing a live listing creates a new version rather than mutating a package a
buyer already received.

Buyer flow:

1. The listing shows price, included files, creator, engine/model requirements,
   license, risk label, compatibility, version, and checksum.
2. A free download or completed purchase creates a short-lived download grant.
3. **Open in Spark Plug** uses an HTTPS universal/app link when supported; the
   ordinary fallback downloads a `.sparkplug-profile` document registered to
   open with the desktop client.
4. The client validates schema, signature, digest, version, and safety rules
   before showing an import review. The user can change any editable setting.
5. GW Broker checks local engine capabilities and model inventory. Present
   items are confirmed; missing models become an explicit acquisition plan.
6. For each missing Hugging Face model, Spark Plug shows repository, pinned
   revision/files, size, license/gating, engine fit, memory estimate, and target
   location. Nothing downloads until the user approves.
7. Downloaded bytes are checksummed, capacity is rechecked, and only then can
   the user save or activate the profile. Import never starts a model or job by
   itself.

Paid links never expose a permanent storage URL. A purchase grants access to an
immutable version; whether later major versions are included must be declared by
the listing before checkout.

## Low-call sync design

The local app has no background marketplace heartbeat. It calls the hosted
service only when the user signs in, browses/refreshes the marketplace, buys or
downloads an asset, publishes, opens creator analytics, manually refreshes Pro,
or reaches the final entitlement stale window.

- catalog pages use CDN caching, ETags, pagination, and `updated_since` deltas;
- app catalog snapshots refresh no more than once per hour unless the user
  explicitly asks; the last valid snapshot remains usable offline;
- public $0 listings use cacheable metadata and packages;
- paid downloads use one short entitlement check followed by a short-lived
  signed object URL;
- subscription state changes arrive through Stripe webhooks rather than app
  polling;
- signed Pro snapshots are verified locally and cached for at most seven days,
  with refresh only on demand or near expiry;
- Supabase Realtime is not enabled globally; creator dashboards may use a
  user-initiated refresh instead of persistent sockets;
- analytics are aggregated asynchronously from bounded events rather than a
  request per screen or local model action.

This reduces Supabase, Vercel, storage, and egress cost while keeping revocation,
purchase access, and marketplace freshness understandable.

## Service architecture

1. **Identity:** a dedicated public Supabase project with Google OAuth using
   authorization-code/PKCE, secure HTTP-only sessions, an explicit redirect
   allowlist, account recovery, session revocation, and deletion.
2. **Subscriptions:** Stripe Billing Checkout and Customer Portal created only
   by server routes from fixed monthly and annual Price IDs.
3. **Seller payouts:** Stripe Connect onboarding. A creator cannot list a paid
   asset until the connected account is payout-capable and marketplace terms
   are accepted.
4. **Marketplace payments:** start with one seller per checkout. Use the Stripe
   Connect charge model selected with counsel/accounting after responsibility
   for fees, disputes, refunds, negative balances, and merchant-of-record duties
   is understood. Do not add a multi-seller cart initially.
5. **Entitlements:** Stripe is authoritative for payment events. A narrow
   Supabase projection drives signed Ed25519 Pro snapshots cached locally for no
   more than seven days. Missing or expired state falls back to Community.
6. **Content:** immutable, checksummed versions; malware scanning/quarantine;
   schema and license validation; human moderation before publication; signed or
   short-lived download URLs for paid assets.

Official implementation references:

- <https://supabase.com/docs/guides/auth/social-login/auth-google>
- <https://docs.stripe.com/connect/marketplace>
- <https://docs.stripe.com/connect/charges>
- <https://docs.stripe.com/webhooks>
- <https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting>

## Abuse and cost controls

- Vercel Firewall/WAF rules for volumetric filtering and per-route rate limits;
- separate strict limits for OAuth start/callback, checkout, listing mutation,
  upload initiation, paid downloads, reports, and entitlement refresh;
- CAPTCHA or bot challenge on abusive anonymous and account-creation paths;
- request-body, file-count, package-size, MIME, archive-depth, and decompression
  limits before durable storage;
- quarantine, antivirus/static scanning, schema validation, license/provenance
  validation, and manual review before publication;
- forced RLS and least-privilege service roles, with seller/buyer/moderator/admin
  adversarial tests;
- exact raw-body Stripe signature verification, timestamp tolerance, event
  allowlist, payload hash, leased idempotency, replay tests, and out-of-order
  subscription handling;
- generic authorization failures, token/body redaction, audit logs, dependency
  and secret scanning, CSP/security headers, key rotation, alerts, budgets, and
  emergency commerce kill switches;
- download bandwidth, storage, email, database, auth, and Stripe cost alerts,
  with per-plan quotas approved before activation.

Rate limiting reduces abusive traffic but does not replace authorization,
idempotency, content validation, or spending alerts.

## Staged delivery

### Stage A — commercial preview (current target)

- publish the product boundary, prices, asset types, and truthful coming-soon UI;
- keep Google sign-in, subscriptions, uploads, sales, and payouts disabled;
- add a separate server-only `SPARKPLUG_COMMERCE_READY` kill switch;
- finalize commission and legal/operational decisions.

### Stage B — private test mode

- provision a dedicated Supabase project and Google OAuth application;
- restore and adapt the reviewed RLS, webhook, billing, entitlement, catalog,
  moderation, and audit components in a disposable environment;
- configure Stripe test products, Billing, Connect, portal, and webhooks;
- test Community offline behavior, auth, cancellation, refunds, disputes,
  payout onboarding, replay/order/idempotency, paid download authorization,
  RLS, deletion, rate limiting, and failure modes.

### Stage C — limited creator beta

- invite a small reviewed seller group;
- allow free listings first, then low-price paid listings;
- manually review every package and payout;
- measure support, dispute, storage, bandwidth, and moderation costs;
- keep one seller per checkout and hosted training disabled.

### Stage D — public commercial launch

- require counsel-approved buyer, seller, billing, refund, privacy, IP/takedown,
  tax, venue, and dispute language;
- require production security review, monitoring, incident runbooks, support
  coverage, backups, restore test, custom-domain health, and owner approval;
- enable both `NEXT_PUBLIC_SITE_STAGE=commercial` and the private commerce-ready
  switch only after every promotion gate passes.

## Owner decisions still required

- marketplace commission percentage — decided: 5% / 500 basis points;
- seller and buyer countries/currencies at launch;
- minimum and maximum listing price;
- who absorbs Stripe processing, refunds, disputes, and negative balances;
- exact creator response/cure deadlines for the approved refund reasons;
- storage and bandwidth quotas for profiles, themes, motion, and LoRA adapters;
- whether private sync ships with the first Pro release;
- final GameWorlds LLC address and counsel-approved commercial terms.

## NVIDIA and Hugging Face claim boundary

As of September 2, 2026, the reviewed official sources show active NVIDIA and
Hugging Face partnerships and integrations, including DGX/Jetson work, but no
official NVIDIA acquisition of Hugging Face. Public copy may describe verified
compatibility and the model-source workflow; it must not claim an acquisition,
ownership, endorsement, or partnership with Spark Plug without an official
announcement and permission.
