begin;
select no_plan();

select is(
  (
    select count(*)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'setup_profile_versions', 'moderation_actions', 'forum_posts',
        'forum_comments', 'forum_votes', 'billing_price_catalog',
        'stripe_webhook_receipts'
      )
      and c.relrowsecurity
      and c.relforcerowsecurity
  ),
  7::bigint,
  'every new public table enables and forces RLS'
);

select is(
  (
    select count(*)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'community_leader_recognitions', 'private_profile_snapshots',
        'marketplace_collections', 'profile_download_totals'
      )
      and c.relrowsecurity
      and c.relforcerowsecurity
  ),
  4::bigint,
  'every staged-launch table enables and forces RLS'
);

select ok(
  not has_column_privilege('anon', 'public.setup_listings', 'manifest', 'SELECT'),
  'anonymous catalog access cannot select an inline manifest'
);
select ok(
  not has_column_privilege('anon', 'public.profiles', 'creator_class', 'SELECT'),
  'raw or expired creator classes are not exposed outside effective projections'
);
select ok(
  not has_table_privilege('authenticated', 'public.moderation_actions', 'SELECT'),
  'reviewer notes are not client readable'
);
select ok(
  not has_table_privilege('authenticated', 'public.billing_price_catalog', 'SELECT'),
  'the Stripe price allowlist is service only'
);
select ok(
  not has_table_privilege('authenticated', 'public.community_leader_recognitions', 'SELECT'),
  'leader review records are service only'
);
select ok(
  not has_table_privilege('authenticated', 'public.orders', 'INSERT'),
  'authenticated users cannot create marketplace orders'
);
select ok(
  not has_table_privilege('authenticated', 'public.creator_payout_accounts', 'INSERT'),
  'authenticated users cannot create payout state'
);

insert into auth.users(id, email) values
  ('00000000-0000-4000-8000-000000000001', 'community@example.invalid'),
  ('00000000-0000-4000-8000-000000000002', 'pro@example.invalid'),
  ('00000000-0000-4000-8000-000000000003', 'buyer@example.invalid'),
  ('00000000-0000-4000-8000-000000000004', 'other@example.invalid'),
  ('00000000-0000-4000-8000-000000000005', 'official@example.invalid');

insert into public.profiles(
  id, handle, display_name, is_public, creator_class, is_verified,
  verified_at, verified_by, verification_reviewed_at
)
values
  ('00000000-0000-4000-8000-000000000001', 'community-user', 'Community', true, 'community', false, null, null, null),
  ('00000000-0000-4000-8000-000000000002', 'pro-user', 'Pro Publisher', true, 'community', false, null, null, null),
  ('00000000-0000-4000-8000-000000000003', 'buyer-user', 'Buyer', true, 'community', false, null, null, null),
  ('00000000-0000-4000-8000-000000000004', 'other-user', 'Other', true, 'community', false, null, null, null),
  (
    '00000000-0000-4000-8000-000000000005', 'gameworlds-official',
    'GameWorlds Official', true, 'gameworlds_official', true,
    now(), '00000000-0000-4000-8000-000000000005', now()
  );

insert into public.subscriptions(user_id, plan, status, current_period_end)
values ('00000000-0000-4000-8000-000000000002', 'pro', 'active', now() + interval '30 days');

insert into public.community_leader_recognitions(
  user_id, contribution_summary, reviewed_by, reviewed_at, expires_at
) values (
  '00000000-0000-4000-8000-000000000003',
  'Sustained reviewed community documentation and testing contributions.',
  '00000000-0000-4000-8000-000000000005', now(), now() + interval '180 days'
);

select is(
  public.publisher_hosting_eligible('00000000-0000-4000-8000-000000000001'),
  false,
  'Community has no hosted marketplace eligibility'
);
select is(
  public.publisher_hosting_eligible('00000000-0000-4000-8000-000000000002'),
  true,
  'active Pro has hosted marketplace eligibility'
);
select is(
  public.publisher_hosting_eligible('00000000-0000-4000-8000-000000000005'),
  true,
  'GameWorlds Official has the service-managed exception'
);
select is(
  public.publisher_hosting_eligible('00000000-0000-4000-8000-000000000003'),
  true,
  'an active Community Leader receives complimentary Pro publishing capacity'
);

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';

select throws_ok(
  $$
    insert into public.setup_listings(owner_id, slug, title, summary)
    values (
      '00000000-0000-4000-8000-000000000001', 'community-hosted',
      'Community hosted', 'Community has no hosted publishing slot.'
    )
  $$,
  'P0001',
  'an active Pro subscription is required for hosted profiles',
  'Community cannot create a hosted marketplace listing'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';

select is(
  public.current_entitlement_claims() ->> 'plan',
  'pro',
  'the caller can read only their effective Pro projection'
);
select is(
  (public.current_entitlement_claims() ->> 'community_leader')::boolean,
  false,
  'buying Pro does not grant the Community Leader role'
);

select lives_ok(
  $$
    insert into public.setup_listings(owner_id, slug, title, summary) values (
      '00000000-0000-4000-8000-000000000002',
      'pro-free-one', 'Pro free one', 'A free declarative profile.'
    )
  $$,
  'active Pro can create a hosted free draft'
);

select throws_ok(
  $$
    insert into public.setup_listings(
      owner_id, slug, title, summary, access, price_cents
    ) values (
      '00000000-0000-4000-8000-000000000002',
      'paid-is-disabled', 'Paid is disabled', 'Paid marketplace is deferred.', 'paid', 500
    )
  $$,
  'P0001',
  'the first public marketplace accepts free profiles only',
  'the first Commercial stage rejects paid marketplace listings'
);

select throws_ok(
  $$ update public.profiles set creator_class = 'verified_creator'
     where id = '00000000-0000-4000-8000-000000000002' $$,
  '42501',
  'permission denied for table profiles',
  'authenticated users cannot self-verify'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000005","role":"authenticated"}';

select lives_ok(
  $$
    insert into public.setup_listings(
      owner_id, slug, title, summary
    ) values (
      '00000000-0000-4000-8000-000000000005',
      'official-free-one', 'Official free one', 'A free official profile.'
    )
  $$,
  'GameWorlds Official is the service-managed Pro exception'
);

reset role;
set local role service_role;
set local "request.jwt.claims" = '{"role":"service_role"}';

update public.setup_listings
set id = '10000000-0000-4000-8000-000000000001'
where slug = 'pro-free-one';
update public.setup_listings
set id = '50000000-0000-4000-8000-000000000001'
where slug = 'official-free-one';

insert into public.setup_profile_versions(
  id, listing_id, version, schema_version, manifest, manifest_sha256,
  hf_revisions, risk_level, risk_labels
) values
  (
    '11000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001', 1, 1,
    '{"kind":"sparkplug.setup-profile","schemaVersion":1}'::jsonb,
    repeat('a', 64), '[]'::jsonb, 'low', '{}'::text[]
  ),
  (
    '51000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001', 1, 1,
    '{"kind":"sparkplug.setup-profile","schemaVersion":1}'::jsonb,
    repeat('b', 64), '[]'::jsonb, 'low', '{}'::text[]
  );

update public.setup_listings
set current_version_id = '11000000-0000-4000-8000-000000000001',
    manifest_sha256 = repeat('a', 64),
    moderation_status = 'approved',
    risk_level = 'low',
    status = 'published'
where id = '10000000-0000-4000-8000-000000000001';

update public.setup_listings
set current_version_id = '51000000-0000-4000-8000-000000000001',
    manifest_sha256 = repeat('b', 64),
    moderation_status = 'approved',
    risk_level = 'low',
    status = 'published'
where id = '50000000-0000-4000-8000-000000000001';

-- Fill the remaining nine Pro published slots through the reviewed service path.
do $slots$
declare
  slot integer;
  listing uuid;
  profile_version uuid;
  digest text;
begin
  for slot in 2..10 loop
    listing := ('10000000-0000-4000-8000-' || lpad(slot::text, 12, '0'))::uuid;
    profile_version := ('11000000-0000-4000-8000-' || lpad(slot::text, 12, '0'))::uuid;
    digest := lpad(to_hex(slot), 64, '0');
    insert into public.setup_listings(id, owner_id, slug, title, summary)
    values (
      listing, '00000000-0000-4000-8000-000000000002',
      'pro-slot-' || slot, 'Pro slot ' || slot, 'A reviewed declarative profile.'
    );
    insert into public.setup_profile_versions(
      id, listing_id, version, schema_version, manifest, manifest_sha256,
      hf_revisions, risk_level
    ) values (
      profile_version, listing, 1, 1,
      '{"kind":"sparkplug.setup-profile","schemaVersion":1}'::jsonb,
      digest, '[]'::jsonb, 'low'
    );
    update public.setup_listings
    set current_version_id = profile_version,
        manifest_sha256 = digest,
        moderation_status = 'approved',
        risk_level = 'low',
        status = 'published'
    where id = listing;
  end loop;
end;
$slots$;

insert into public.setup_listings(id, owner_id, slug, title, summary)
values (
  '10000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000002',
  'pro-slot-11', 'Pro slot 11', 'The eleventh reviewed profile.'
);
insert into public.setup_profile_versions(
  id, listing_id, version, schema_version, manifest, manifest_sha256,
  hf_revisions, risk_level
) values (
  '11000000-0000-4000-8000-000000000011',
  '10000000-0000-4000-8000-000000000011', 1, 1,
  '{"kind":"sparkplug.setup-profile","schemaVersion":1}'::jsonb,
  repeat('c', 64), '[]'::jsonb, 'low'
);

select throws_ok(
  $$
    update public.setup_listings
    set current_version_id = '11000000-0000-4000-8000-000000000011',
        manifest_sha256 = repeat('c', 64),
        moderation_status = 'approved',
        risk_level = 'low',
        status = 'published'
    where id = '10000000-0000-4000-8000-000000000011'
  $$,
  'P0001',
  'ten hosted published profile slots are already in use',
  'an active Pro account cannot publish an eleventh hosted profile'
);

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';

select is(
  (select count(*) from public.setup_profile_versions
   where listing_id = '10000000-0000-4000-8000-000000000001'),
  0::bigint,
  'anonymous table reads cannot bypass the manifest delivery function'
);
select lives_ok(
  $$ select public.authorized_profile_manifest('50000000-0000-4000-8000-000000000001') $$,
  'anonymous users can download an approved free manifest'
);
select lives_ok(
  $$ select public.authorized_profile_manifest('10000000-0000-4000-8000-000000000001') $$,
  'anonymous users can download an approved free Pro-published manifest'
);
select ok(
  coalesce((
    select 'unverified-creator' = any(risk_labels)
    from public.public_profile_catalog
    where id = '10000000-0000-4000-8000-000000000001'
  ), false),
  'an unverified Pro publisher receives the catalog warning'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000004","role":"authenticated"}';
select lives_ok(
  $$ select public.authorized_profile_manifest('10000000-0000-4000-8000-000000000001') $$,
  'an authenticated non-owner can download an approved free manifest'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select lives_ok(
  $$
    insert into public.forum_posts(author_id, slug, title, body)
    values (
      '00000000-0000-4000-8000-000000000001',
      'safe-local-routing', 'Safe local routing', 'A pending community discussion.'
    )
  $$,
  'an authenticated author can submit a pending forum post'
);
select is(
  (select count(*) from public.forum_posts where slug = 'safe-local-routing'),
  1::bigint,
  'the author can read their own pending post'
);

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';
select is(
  (select count(*) from public.forum_posts where slug = 'safe-local-routing'),
  0::bigint,
  'anonymous readers cannot see pending forum posts'
);

reset role;
set local role service_role;
set local "request.jwt.claims" = '{"role":"service_role"}';
update public.forum_posts
set moderation_status = 'approved'
where slug = 'safe-local-routing';

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';
select is(
  (select count(*) from public.forum_posts where slug = 'safe-local-routing'),
  1::bigint,
  'anonymous readers can see an approved forum post'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated"}';
select is(
  public.current_entitlement_claims() ->> 'plan',
  'pro',
  'an active Community Leader receives complimentary Pro'
);
select is(
  (public.current_entitlement_claims() ->> 'community_leader')::boolean,
  true,
  'Community Leader recognition remains separate from payment state'
);
select lives_ok(
  $$
    insert into public.forum_comments(post_id, author_id, body)
    select id, '00000000-0000-4000-8000-000000000003', 'A pending reply.'
    from public.forum_posts where slug = 'safe-local-routing'
  $$,
  'an authenticated author can comment on an approved post'
);
select lives_ok(
  $$
    insert into public.forum_votes(voter_id, post_id, value)
    select '00000000-0000-4000-8000-000000000003', id, 1
    from public.forum_posts where slug = 'safe-local-routing'
  $$,
  'an authenticated user can vote once on an approved post'
);
select is(
  (select count(*) from public.forum_votes),
  1::bigint,
  'a voter can read their own vote'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000004","role":"authenticated"}';
select is(
  (select count(*) from public.forum_votes),
  0::bigint,
  'another authenticated user cannot read voter identities'
);

reset role;
set local role service_role;
set local "request.jwt.claims" = '{"role":"service_role"}';
update public.forum_comments
set moderation_status = 'approved'
where post_id = (select id from public.forum_posts where slug = 'safe-local-routing');

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';
select is(
  (select count(*) from public.forum_comments),
  1::bigint,
  'anonymous readers can see an approved comment'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
update public.forum_posts
set body = 'An edited discussion that must be reviewed again.'
where slug = 'safe-local-routing';

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';
select is(
  (select count(*) from public.forum_posts where slug = 'safe-local-routing'),
  0::bigint,
  'editing approved forum content returns it to pending moderation'
);

reset role;
set local role service_role;
set local "request.jwt.claims" = '{"role":"service_role"}';

select lives_ok(
  $$
    select public.submit_validated_profile_draft(
      '00000000-0000-4000-8000-000000000005',
      'official-validated-draft',
      'Official validated draft',
      'A route-validated immutable setup profile.',
      'free', 0, 'usd',
      '{
        "schemaVersion": 1,
        "kind": "sparkplug.setup-profile",
        "name": "Official validated draft",
        "summary": "A route-validated immutable setup profile.",
        "models": [{
          "repoId": "gameworlds/example-model",
          "revision": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "licenseId": "Apache-2.0",
          "gated": false,
          "files": [{
            "filename": "model.safetensors",
            "sha256": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "sizeBytes": 1024
          }],
          "runtime": { "alias": "main-model", "engine": "vllm" }
        }]
      }'::jsonb,
      repeat('e', 64),
      '[{"repoId":"gameworlds/example-model","revision":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}]'::jsonb,
      '{}'::text[], 1024
    )
  $$,
  'the service path stores a validated immutable pending draft'
);
select is(
  (
    select count(*) from public.setup_profile_versions v
    join public.setup_listings l on l.id = v.listing_id
    where l.slug = 'official-validated-draft'
      and l.status = 'draft'
      and l.moderation_status = 'pending'
  ),
  1::bigint,
  'validated submission remains a single pending immutable version'
);

select is(
  public.claim_stripe_webhook_event(
    'evt_architecture_0001', 'unknown.test', repeat('d', 64)
  ) ->> 'state',
  'claimed',
  'the first webhook delivery claims an idempotency lease'
);
select is(
  public.claim_stripe_webhook_event(
    'evt_architecture_0001', 'unknown.test', repeat('d', 64)
  ) ->> 'state',
  'in_progress',
  'a concurrent webhook delivery asks the provider to retry'
);
select lives_ok(
  $$
    select public.apply_stripe_webhook_projection(
      'evt_architecture_0001', 'unknown.test', '{"kind":"ignored"}'::jsonb, 1
    )
  $$,
  'a claimed safe projection can be completed'
);
select is(
  public.claim_stripe_webhook_event(
    'evt_architecture_0001', 'unknown.test', repeat('d', 64)
  ) ->> 'state',
  'duplicate',
  'a processed webhook remains idempotent'
);

reset role;
select * from finish();
rollback;
