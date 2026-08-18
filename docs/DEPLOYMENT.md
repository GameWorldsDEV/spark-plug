# Vercel and Supabase deployment runbook

This repository is prepared for deployment but must not be published from an
automated audit or delegated task.

## 1. Owner review

- Review the public-boundary checklist and repository history.
- Confirm the product name, contact addresses, $5 Pro price, annual discount,
  creator rules, and non-affiliation text.
- Keep `NEXT_PUBLIC_SITE_INDEXABLE=false` through private previews.

## 2. Supabase staging

- Create a new project dedicated to the public launch; do not reuse a private
  product database.
- Apply migrations through the Supabase CLI in staging.
- Run RLS tests across anonymous, owner, non-owner, creator, and service roles.
- Copy the project URL and service-role key into Vercel encrypted environment
  settings. Never put the service-role key in browser code.
- Generate a new random waitlist HMAC secret and store it only in Vercel.

## 3. Vercel preview

- Import this clean repository as a new Vercel project.
- Use `npm ci` and `npm run build` (already declared in `vercel.json`).
- Set `NEXT_PUBLIC_SITE_URL` to the exact preview/production origin appropriate
  to the environment.
- Validate headers, metadata, forms, legal routes, responsive layout, keyboard
  navigation, and reduced motion on the generated preview URL.

## 4. Payments (later gate)

- Obtain owner-approved final prices, marketplace fee, refund, tax, and payout
  terms.
- Add Stripe products/prices and Connect only after those terms are published.
- Implement signed, idempotent webhook handling and integration tests before
  setting Stripe environment values.

## 5. Public launch

- Attach an approved domain or subdomain when ready; a Vercel project URL is
  sufficient for prelaunch review.
- Switch `NEXT_PUBLIC_SITE_INDEXABLE=true` only after legal, security, and content
  approval.
- Rebuild, verify canonical/OG URLs on the production host, then publish.
- DNS changes, production deployment, purchases, and payment activation require
  direct owner action or explicit authorization.
