# Public launch clean-room boundary

This repository is a new, history-free launch surface. It is not a fork of the
private Spark Plug product and it must not become a mirror of that repository.

## Allowed

- Original public marketing copy, CSS, motion, and illustrative demo UI.
- Public capability descriptions verified against the open-core contract.
- A scrubbed setup-manifest format that contains no runtime values.
- Public, declarative community-profile schemas and examples.
- Deployment templates containing placeholders only.

## Prohibited

- Private Git objects, commit history, branches, patches, or file copies.
- Private product UI source, CSS tokens, themes, animations, screenshots, icons,
  logos, or generated media.
- User/session data, chats, prompts, outputs, logs, credentials, keys,
  certificates, production hostnames, container paths, model weights, caches,
  databases, or deployment topology.
- Hosted account, subscription, billing, entitlement, private-profile, payout,
  or mandatory telemetry code.

## Release gate

Before creating any public remote, run secret scanning, inspect every binary
asset, verify repository history begins with the clean launch commit, and have
an owner review every route and manifest example. A clean build is not enough.
