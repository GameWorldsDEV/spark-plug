# First public release plan

The working product and the public release are separate deliverables. This plan
defines the slot the product task will fill when its source is ready.

## Current repository state

- clean-room Git history with no private repository ancestry;
- public website deployed as a no-index preview;
- product, release-metadata, setup-manifest, and security contracts;
- no public product binaries or download claim;
- no active account, subscription, paid marketplace, hosted entitlement, or product checkout;
- planned commercial services are separately gated by `docs/CREATOR-COMMERCE-PLAN.md`.

## Product-source handoff package

The product task should deliver a reviewed package containing:

1. public-core source with a file allowlist and provenance receipt;
2. node and client build instructions for each claimed target;
3. versioned broker/client API contract;
4. installer preflight, mutation, rollback, and uninstall behavior;
5. runtime capability table and known limitations;
6. dependency and third-party license inventory;
7. unit, integration, installer, accessibility, and real-node canary results;
8. release notes and checksums for every binary artifact.

It must not include private history, profiles, prompts, outputs, credentials,
routes, addresses, Tailnet details, account pools, local paths, model weights,
caches, logs, customer data, or private deployment topology.

## Repository landing zones

The final source layout may be refined during handoff, but public code should
arrive through explicit top-level boundaries:

```text
apps/          public browser and approved native client source
broker/        node authority and public API implementation
installer/     supported-target preflight, install, rollback, uninstall
contracts/     versioned broker, setup, and release-metadata contracts
docs/          user, operator, contributor, security, and release documentation
tests/         clean-room unit, integration, installation, and canary tests
```

The existing website and hosted-service code must not be mixed into the node
runtime merely for convenience. They have different trust, data, and release
boundaries.

## Release gates

### Gate 1 — clean source

- start from the public repository history only;
- review the complete file allowlist and every binary;
- run `gitleaks git --redact .` and a second secret scanner;
- scan committed history, generated artifacts, and dependency lockfiles;
- confirm the third-party license inventory and Apache-2.0 notices.

### Gate 2 — supported installation

- install on a clean Ubuntu 24.04 ARM64 DGX Spark;
- verify OS, architecture, drivers, storage, physical memory, and dependency
  versions before mutation;
- prove rollback and uninstall without removing models, profiles, or outputs;
- record hashes for the exact installer and packages tested.

### Gate 3 — runtime truth

- pair a fresh client over the supported HTTPS path;
- build, validate, save, and apply a profile;
- reject an over-capacity single-node profile;
- prove distinct accepted, loading, ready, busy, and failed states;
- test vLLM, Colibri, ComfyUI, memory, queues, and output return;
- keep unqualified Switchyard, cluster, Colibri vision, and Colibri tools out of
  release claims.

### Gate 4 — public artifacts

- publish source, supported installers, documentation, release notes, checksums,
  and measured compatibility results together;
- activate the prepared website download card only for verified repository and
  package destinations;
- publish the matching `/releases/current.json` entry only when its HTTPS artifact
  URL and SHA-256 checksum agree with the signed GitHub Release;
- keep optional support links separate from downloads and product capabilities;
- authorize indexing only after metadata, legal, and public files are final.

## Versioning

Use semantic versions after the first stable public contract. Before that,
release candidates may use `0.x.y-rc.n`. Every installer, client, broker,
contract, and release note must name the versions it was tested with; “latest”
is not a compatibility contract.
