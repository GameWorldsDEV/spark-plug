# Marketplace distribution and cost boundary

The website is the commercial authority. It handles Google authentication, Pro,
creator publishing, Stripe checkout and Connect, support cases, refunds,
moderation, and immutable marketplace packages.

The local Spark Plug app stays useful without an account or backend connection.
Its optional marketplace view reads `/catalog/app/current.json`, a static CDN
file that points to an immutable monthly snapshot such as
`/catalog/app/2026-09.1.json`. Neither URL invokes Supabase or a server function.
The pointer declares `validUntil`; the app retains the snapshot and does not
check again before that date. It never refreshes because a user changed a local
page, profile, engine, model, queue, or job.

The website catalog is separate and current. Newly approved releases appear on
creator/listing pages there first. A user who wants a mid-month release visits
the website and imports it directly. At the start of the next catalog period,
GameWorlds generates, validates, checksums, and deploys one new immutable snapshot,
then updates the static pointer. The app receives those additions on its next
monthly check or with the next app build.

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

This design makes 100,000 clients static-file/CDN consumers rather than 100,000
Supabase readers. The monthly app path creates zero database queries. Supabase
is used by the live website and user-driven mutations, not local application
activity.
