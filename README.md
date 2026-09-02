# Spark Plug

Spark Plug is a free, open-source local AI control app and node broker. It pairs
authorized clients to a machine, saves engines and models as editable profiles,
checks those profiles against available memory, supervises runtime queues, and
reports real loading and readiness state.

- Website: <https://sparkplug.gameworlds.ai>
- Source and releases: <https://github.com/GameWorldsDEV/spark-plug>
- License: [Apache License 2.0](LICENSE)
- Current status: source preview; verified installers coming soon
- First node target: NVIDIA DGX Spark, Ubuntu 24.04 ARM64

Spark Plug&rsquo;s local core, source packages, executables, and verified installers
remain free and open source without an account or network heartbeat. A separate,
privately operated Pro service and moderated creator marketplace are planned but
disabled: Google-authenticated Pro creators will be able to publish approved free
or paid profiles, themes, motion packs, and rights-cleared LoRA adapters.

## How it works

1. Install Spark Plug on a supported node and pair an authorized client.
2. Add compatible engines and model revisions for the work you intend to run.
3. Save memory, context, queues, routes, and engine settings as editable profiles.
4. Validate and load a complete profile without confusing accepted, loading, and ready states.
5. Submit work through stable broker routes while local state remains observable.

Compatibility with OpenClaw, Hermes, Paperclip, Codex, Claude Code, Hugging
Face, and other named tools does not imply partnership or endorsement.

## Free downloads

GitHub tags and Releases are the source of truth. The website reads the same
versioned manifest at `/releases/current.json` and may offer convenient
platform-specific installers or executables. A button activates only when its
GitHub HTTPS artifact URL, SHA-256 checksum, detached signature, release notes,
compatibility evidence, and publication timestamp all describe the same tagged
commit.

Until then, installer buttons stay labeled **Coming soon**. Browser detection
only highlights a likely platform and never overrides the release gate.

## Community profiles

The [profiles](profiles/README.md) directory will hold schema-validated,
declarative profiles contributed through pull requests. Every approved profile
is free and editable. Profiles cannot contain executable scripts, commands,
credentials, secrets, private paths, prompts, outputs, or personal data.

## Repository map

| Area | Purpose |
| --- | --- |
| `src/app` | Public website and release pages |
| `contracts` | Small public release metadata contract |
| `schemas` | Deny-by-default setup profile schema |
| `profiles` | Free community profile contribution boundary |
| `docs/PRODUCT.md` | Product workflow and current limits |
| `docs/CONNECTIONS.md` | Broker, routing, harness, and remote-device boundaries |
| `docs/PUBLIC_BOUNDARY.md` | Material that may and may not enter this repository |
| `docs/RELEASE-PLAN.md` | Source and verified-installer release gates |
| `docs/SECURITY.md` | Security design and release checklist |

## Local development

```bash
npm ci
npm run dev
```

The site fails closed to `NEXT_PUBLIC_SITE_STAGE=preview` and
`NEXT_PUBLIC_SITE_INDEXABLE=false`. Use `release` only after verified
artifacts and public metadata pass review.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Read [Contributing](CONTRIBUTING.md), the [community code](CODE_OF_CONDUCT.md),
and [Security](SECURITY.md) before opening a report or pull request.
