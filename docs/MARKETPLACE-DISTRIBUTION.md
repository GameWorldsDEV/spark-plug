# Marketplace distribution and cost boundary

The website is the commercial authority. It handles Google authentication, Pro,
creator publishing, Stripe checkout and Connect, support cases, refunds,
moderation, and immutable marketplace packages.

The local Spark Plug app stays useful without an account or backend connection.
Its optional marketplace view reads the canonical
`/api/v1/catalog/snapshot` endpoint through browser,
OS, and CDN caching. A successful response advertises a one-hour refresh period
and an ETag. The app must retain the last valid snapshot, issue a conditional
request no more than once per hour, and never refresh because a user changed a
local page, profile, engine, model, queue, or job. Manual refresh may bypass the
local timer but remains rate limited at the edge.

Purchases and publishing open the website. Free packages may download from the
cacheable public route. Paid packages require an explicit sign-in and purchase
check, then receive a short-lived URL. No marketplace token is required for
local inference or an already imported profile.

Profiles contain configuration and pinned model references, never bundled model
weights. Publication requires an exact repository, immutable revision, license,
and administrator review record. Paid publication fails closed unless that
record permits a paid configuration reference. Unknown, expired,
noncommercial, or blocked decisions cannot publish as paid. Restricted models
carry conspicuous safety labels; illegal, deceptive, or policy-blocked content
is not listed.

This design makes 100,000 clients primarily a CDN/browser-cache problem rather
than 100,000 direct Supabase readers. Supabase is queried on cache misses and
user-driven mutations, not on local application activity.
