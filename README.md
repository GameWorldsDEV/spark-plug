# Spark Plug

Spark Plug is a local control app and node broker for a dedicated AI machine. It
pairs authorized clients to one node, saves models and engine settings as
profiles, admits those profiles against available memory, supervises separate
runtime queues, and reports real loading and readiness state.

The public software release is being prepared. This repository currently holds
the reviewed public website, release contracts, security boundaries, hosted
entitlement foundation, and documentation that the product source will join
after clean-room extraction and qualification.

- Website: <https://sparkplug-public-launch-site.vercel.app>
- Release state: pre-release; no public product download yet
- First node target: NVIDIA DGX Spark, Ubuntu 24.04 ARM64
- Public indexing, accounts, payments, and marketplace: disabled

## How the product works

1. **Pair** — enroll a browser, Mac, iPhone, or iPad client to one node over its
   HTTPS authentication path.
2. **Build** — select models and save vLLM, Colibri, ComfyUI, memory, context,
   streaming, concurrency, residency, media, and allowed routing settings as a
   profile.
3. **Apply** — validate the profile against the selected compute target, then
   start or stop the required services without confusing accepted, loading, and
   ready states.
4. **Work** — authorized apps and agents submit work through stable broker
   routes while engine-specific queues, memory, failures, and results remain
   observable.

Compatible clients can include OpenClaw, Hermes, Paperclip, Codex through an
OpenAI-compatible endpoint, Claude Code through its supported gateway, and other
tools that implement the published endpoint contracts. Compatibility does not
imply partnership or endorsement.

## Release buttons

The homepage reads the same versioned manifest served at
`/releases/current.json`. It highlights the visitor's likely platform locally in
the browser, but an installer button becomes active only when the manifest has a
HTTPS artifact URL and a SHA-256 checksum. The GitHub repository remains available
while Linux/DGX Spark, macOS, Windows, and Android packages are still preparing.

See [Product contract](docs/PRODUCT.md) for current capability truth and
[Release plan](docs/RELEASE-PLAN.md) for the path from the private working build
to the first public package.

## Repository map

| Area | Purpose |
| --- | --- |
| `src/app` | Public website and inactive hosted-service routes |
| `contracts` | Versioned public API contracts |
| `schemas` | Deny-by-default setup and entitlement schemas |
| `supabase` | Dedicated public-service migrations and RLS tests; not activated |
| `docs/PRODUCT.md` | Actual product workflow, support target, and current limits |
| `docs/CONNECTIONS.md` | Broker, Switchyard, harness, remote-device, and Rabbit R1 boundaries |
| `docs/BRAND-ASSETS.md` | Third-party compatibility-mark provenance and usage boundary |
| `docs/RELEASE-PLAN.md` | Clean-room code handoff and release gates |
| `docs/BILLING.md` | Supabase/Stripe/entitlement separation and activation checklist |
| `docs/GITHUB.md` | Repository automation, traffic/stars policy, and release use |
| `docs/HANDOFF.md` | Exact product-code and hosted-service delivery sequence |
| `docs/PUBLIC_BOUNDARY.md` | Material that may and may not enter the public repository |
| `docs/SECURITY.md` | Security design and release checklist |

## Local development

```bash
npm ci
npm run dev
```

The source defaults to `PAYMENTS_MODE=disabled` and
`NEXT_PUBLIC_SITE_INDEXABLE=false`. Never point local development at a private
product database or reuse private product credentials.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Before any public product-source push, also run the clean-room history, binary,
license, dependency, and secret checks in [Release plan](docs/RELEASE-PLAN.md).

## Community and licensing status

Issues and pull requests may be used for public website and documentation work.
The product source and its final license are not published yet. Until a license
file is added, no license to copy, modify, or redistribute repository source is
granted beyond rights provided by law. This avoids silently choosing a license
before the owner completes the release review.

See [Contributing](CONTRIBUTING.md) and [Security](SECURITY.md) before opening a
report.
