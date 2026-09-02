<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Spark Plug public-launch guardrails

- This repository is a clean-room public marketing/account surface with new Git
  history. Never import from or copy private Spark Plug repositories.
- Never add private UI source, themes, animations, screenshots, media, customer
  or session data, credentials, production hosts, container paths, logs, model
  weights, or deployment topology.
- Public setup manifests must be scrubbed and declarative. Never publish secrets,
  absolute host paths, private output references, or session history.
- Spark Plug remains free and accountless. Do not add subscriptions, feature
  paywalls, hosted entitlements, paid profile listings, or payment-gated source.
- GitHub is the source and release authority. Website executables and installers
  must match a tagged commit and publish verification evidence before activation.
- Do not deploy, publish, change DNS, activate payments, or mutate production
  hosted databases or Vercel resources without explicit owner authorization.
