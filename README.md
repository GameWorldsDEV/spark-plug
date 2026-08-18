# Spark Plug public launch site

An original, clean-room Next.js launch site for Spark Plug: a local-first model
broker that connects agents to owner-controlled models, tools, queues, and media
outputs.

This repository intentionally has no inherited private or open-core Git history.
It contains no private product UI, themes, animations, screenshots, user/session
data, production configuration, credentials, or private generated assets. See
[`docs/PUBLIC_BOUNDARY.md`](docs/PUBLIC_BOUNDARY.md).

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The waitlist form returns a safe setup message until isolated Supabase staging
values are configured. Do not use private-product database credentials.

## Validation

```bash
npm test
npm run lint
npm run build
```

## Architecture

- Vercel / Next.js frontend and server routes
- Supabase Auth + Postgres with Row Level Security
- Stripe Checkout/Connect interface specification (not activated)
- Local Spark Plug remains the model-capability and output authority

Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/ENTITLEMENTS.md`](docs/ENTITLEMENTS.md), and
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) before creating a hosted project.

## Status

Prepared for local/private preview only. No deployment, DNS, payment, or
production database changes are performed by this repository.
