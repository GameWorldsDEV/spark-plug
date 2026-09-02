# Security design and release checklist

Spark Plug keeps authority on the user-owned node. The public website is a
documentation and download surface, not a remote control plane, identity
provider, telemetry service, or store for prompts and outputs.

## Protected boundaries

- Pairing and node credentials authenticate clients; discovery only finds a node.
- GW Broker remains authoritative for admission, active profiles, routes,
  queues, runtime state, and output provenance.
- Community profiles are declarative, schema validated, revision pinned,
  checksummed, licensed, and reviewed before publication.
- The repository excludes credentials, private profiles, prompts, outputs,
  histories, node identities, private routes, host paths, model weights, logs,
  personal data, and deployment topology.
- Optional Stripe and GitHub support never receives node credentials and never
  changes software capability.

## Installer gate

Every website download must match a tagged GitHub commit and include an HTTPS
artifact URL, SHA-256 checksum, detached signature, third-party notices,
release notes, known issues, supported-platform evidence, clean-install result,
upgrade path, rollback path, uninstall steps, and publication timestamp.
Missing or inconsistent evidence keeps the button disabled.

## Validation

Run lint, typecheck, unit tests, the production build, Playwright/axe,
dependency audit, secret scanning, broken-link checks, responsive overflow
checks, reduced-motion checks, CSP/header checks, and a clean installation on
every claimed platform. Record the exact commit and artifacts in the release.

Report suspected vulnerabilities to security@gameworlds.ai without live
credentials, private user data, or destructive proof.
