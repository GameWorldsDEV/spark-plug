-- Public marketplace, forum, entitlement, and payment-event hardening.
--
-- This migration is intentionally clean-room and stores public account/catalog
-- state only. Local routes, output paths, prompts, credentials, and private
-- Spark Plug state must never be copied into this database.

do $$ begin
  create type public.creator_class as enum (
    'community',
    'verified_creator',
    'verified_business',
    'gameworlds_official'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.moderation_status as enum (
    'pending',
    'approved',
    'rejected',
    'removed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.risk_level as enum ('low', 'review', 'high');
exception when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists creator_class public.creator_class not null default 'community',
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null,
  add column if not exists verification_reviewed_at timestamptz,
  add column if not exists verification_expires_at timestamptz;

do $$
begin
  if exists (select 1 from public.profiles where is_verified = true) then
    raise exception 'existing verified profiles require an explicit creator-class review';
  end if;
end;
$$;

alter table public.profiles
  add constraint profile_creator_class_review_window check (
    (
      creator_class = 'community'
      and is_verified = false
      and verified_at is null
      and verified_by is null
      and verification_reviewed_at is null
      and verification_expires_at is null
    )
    or (
      creator_class in ('verified_creator', 'verified_business')
      and is_verified = true
      and verified_at is not null
      and verified_by is not null
      and verification_reviewed_at is not null
      and verification_expires_at > verification_reviewed_at
    )
    or (
      creator_class = 'gameworlds_official'
      and is_verified = true
      and verified_at is not null
      and verified_by is not null
      and verification_reviewed_at is not null
      and verification_expires_at is null
    )
  );

-- Keep the old boolean readable for existing clients, but make the class the
-- authority. Only the service role may change either managed field.
create or replace function public.protect_managed_profile_fields()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if auth.role() <> 'service_role' and (
    new.is_verified is distinct from old.is_verified
    or new.creator_class is distinct from old.creator_class
    or new.verified_at is distinct from old.verified_at
    or new.verified_by is distinct from old.verified_by
    or new.verification_reviewed_at is distinct from old.verification_reviewed_at
    or new.verification_expires_at is distinct from old.verification_expires_at
  ) then
    raise exception 'verification fields are managed by the service';
  end if;

  if auth.role() = 'service_role' then
    new.is_verified := new.creator_class <> 'community';
    if new.creator_class = 'community' then
      new.verified_at := null;
      new.verified_by := null;
      new.verification_reviewed_at := null;
      new.verification_expires_at := null;
    elsif new.verified_at is null then
      new.verified_at := now();
    end if;
    if new.creator_class <> 'community' and new.verification_reviewed_at is null then
      new.verification_reviewed_at := now();
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists "owners can create their profile" on public.profiles;
create policy "owners can create their profile"
  on public.profiles for insert to authenticated
  with check (
    (select auth.uid()) = id
    and is_verified = false
    and creator_class = 'community'
    and verified_at is null
    and verified_by is null
    and verification_reviewed_at is null
    and verification_expires_at is null
  );

create or replace function public.effective_creator_class(p_owner_id uuid)
returns public.creator_class
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce((
    select case
      when p.creator_class in ('verified_creator', 'verified_business')
        and (p.verification_expires_at is null or p.verification_expires_at <= now())
      then 'community'::public.creator_class
      else p.creator_class
    end
    from public.profiles p
    where p.id = p_owner_id
  ), 'community'::public.creator_class);
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_profile_updated_at on public.profiles;
create trigger touch_profile_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create table if not exists public.setup_profile_versions (
  id uuid primary key default extensions.gen_random_uuid(),
  listing_id uuid not null references public.setup_listings(id) on delete restrict,
  version integer not null check (version between 1 and 1000000),
  schema_version integer not null check (schema_version = 1),
  manifest jsonb not null,
  manifest_sha256 text not null check (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  hf_revisions jsonb not null check (jsonb_typeof(hf_revisions) = 'array'),
  validation_report jsonb not null default '{}'::jsonb check (jsonb_typeof(validation_report) = 'object'),
  risk_level public.risk_level not null default 'review',
  risk_labels text[] not null default '{}'::text[],
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (listing_id, version),
  unique (listing_id, manifest_sha256),
  constraint setup_profile_manifest_is_declarative check (
    jsonb_typeof(manifest) = 'object'
    and manifest ->> 'kind' = 'sparkplug.setup-profile'
    and manifest ->> 'schemaVersion' = '1'
    and octet_length(manifest::text) <= 65536
    and not (manifest ?| array[
      'command', 'commands', 'script', 'scripts', 'environment', 'env',
      'secret', 'secrets', 'token', 'tokens', 'credential', 'credentials',
      'localPath', 'outputPath', 'outputUrl'
    ])
  ),
  constraint setup_profile_risk_labels_are_bounded check (
    cardinality(risk_labels) <= 16
    and array_position(risk_labels, null) is null
  )
);

create index if not exists setup_profile_versions_listing_idx
  on public.setup_profile_versions(listing_id, version desc);

alter table public.setup_listings
  add column if not exists current_version_id uuid references public.setup_profile_versions(id) on delete restrict,
  add column if not exists moderation_status public.moderation_status not null default 'pending',
  add column if not exists risk_level public.risk_level not null default 'review',
  add column if not exists risk_labels text[] not null default '{}'::text[],
  add column if not exists moderated_at timestamptz,
  add column if not exists moderated_by uuid references auth.users(id) on delete set null;

create or replace function public.publisher_hosting_eligible(p_owner_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    exists (
      select 1 from public.profiles p
      where p.id = p_owner_id and p.creator_class = 'gameworlds_official'
    )
    or exists (
      select 1 from public.subscriptions s
      where s.user_id = p_owner_id
        and s.plan in ('pro', 'pro_plus')
        and s.status in ('active', 'trialing')
        and (s.current_period_end is null or s.current_period_end > now())
    );
$$;

drop policy if exists "published listings are readable" on public.setup_listings;
create policy "published listings are readable"
  on public.setup_listings for select
  using (
    status = 'published'
    and moderation_status = 'approved'
    and public.publisher_hosting_eligible(owner_id)
  );

create index if not exists setup_listings_catalog_idx
  on public.setup_listings(moderation_status, published_at desc)
  where status = 'published';

-- Inline manifests from the foundation are retired before any public launch.
-- The immutable versions table is the sole manifest authority so public
-- metadata grants can never accidentally expose a paid profile body.
do $$
begin
  if exists (select 1 from public.setup_listings where manifest <> '{}'::jsonb) then
    raise exception 'non-empty inline manifests require an explicit reviewed migration';
  end if;
end;
$$;

create or replace function public.protect_listing_managed_fields()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if new.manifest <> '{}'::jsonb then
    raise exception 'inline listing manifests are disabled';
  end if;

  if auth.role() <> 'service_role' then
    if tg_op = 'UPDATE' and (
      new.owner_id is distinct from old.owner_id
      or new.status is distinct from old.status
      or new.manifest_sha256 is distinct from old.manifest_sha256
      or new.current_version_id is distinct from old.current_version_id
      or new.moderation_status is distinct from old.moderation_status
      or new.risk_level is distinct from old.risk_level
      or new.risk_labels is distinct from old.risk_labels
      or new.moderated_at is distinct from old.moderated_at
      or new.moderated_by is distinct from old.moderated_by
      or new.published_at is distinct from old.published_at
    ) then
      raise exception 'listing publication and review fields are managed by the service';
    end if;
    if tg_op = 'INSERT' and (
      new.status <> 'draft'
      or new.manifest_sha256 is not null
      or new.current_version_id is not null
      or new.moderation_status <> 'pending'
      or new.moderated_at is not null
      or new.moderated_by is not null
      or new.published_at is not null
    ) then
      raise exception 'new client listings must be unreviewed drafts';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_listing_managed_fields on public.setup_listings;
create trigger protect_listing_managed_fields
before insert or update on public.setup_listings
for each row execute function public.protect_listing_managed_fields();

drop trigger if exists touch_listing_updated_at on public.setup_listings;
create trigger touch_listing_updated_at
before update on public.setup_listings
for each row execute function public.touch_updated_at();

create or replace function public.enforce_listing_quota_and_plan()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  active_pro boolean := false;
  official_publisher boolean := false;
begin
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = new.owner_id
      and s.plan in ('pro', 'pro_plus')
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  ) into active_pro;
  select exists (
    select 1 from public.profiles p
    where p.id = new.owner_id and p.creator_class = 'gameworlds_official'
  ) into official_publisher;

  if not active_pro and not official_publisher then
    raise exception 'an active Pro subscription is required for hosted profiles';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_listing_quota_and_plan on public.setup_listings;
create trigger enforce_listing_quota_and_plan
before insert or update of access, owner_id on public.setup_listings
for each row execute function public.enforce_listing_quota_and_plan();

create or replace function public.validate_listing_publication()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  version_matches boolean;
  active_pro boolean;
  official_publisher boolean;
  connect_ready boolean;
  published_count integer;
begin
  if new.status <> 'published' then
    return new;
  end if;

  if auth.role() <> 'service_role' then
    raise exception 'publication is service managed';
  end if;
  if new.moderation_status <> 'approved' or new.current_version_id is null then
    raise exception 'approved immutable profile version required';
  end if;

  select exists (
    select 1 from public.subscriptions s
    where s.user_id = new.owner_id
      and s.plan in ('pro', 'pro_plus')
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  ) into active_pro;
  select exists (
    select 1 from public.profiles p
    where p.id = new.owner_id and p.creator_class = 'gameworlds_official'
  ) into official_publisher;
  if not active_pro and not official_publisher then
    raise exception 'active Pro is required for hosted publication';
  end if;

  select count(*) into published_count
  from public.setup_listings l
  where l.owner_id = new.owner_id
    and l.status = 'published'
    and l.id <> new.id;
  if published_count >= 10 then
    raise exception 'ten hosted published profile slots are already in use';
  end if;

  select exists (
    select 1 from public.setup_profile_versions v
    where v.id = new.current_version_id
      and v.listing_id = new.id
      and v.manifest_sha256 = new.manifest_sha256
  ) into version_matches;
  if not version_matches then
    raise exception 'profile version digest does not match listing';
  end if;

  if new.access = 'paid' then
    select exists (
      select 1 from public.creator_payout_accounts a
      where a.user_id = new.owner_id
        and a.charges_enabled = true
        and a.payouts_enabled = true
    ) into connect_ready;
    if not connect_ready then
      raise exception 'paid publication requires ready payouts';
    end if;
  end if;

  new.published_at := coalesce(new.published_at, now());
  return new;
end;
$$;

drop trigger if exists validate_listing_publication on public.setup_listings;
create trigger validate_listing_publication
before insert or update of status, current_version_id, manifest_sha256, moderation_status, access
on public.setup_listings
for each row execute function public.validate_listing_publication();

-- Immutable moderation history. Client-visible status is projected onto the
-- target record; reviewer notes stay service-only.
create table if not exists public.moderation_actions (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  target_type text not null check (target_type in ('profile', 'forum_post', 'forum_comment')),
  target_id uuid not null,
  action text not null check (action in ('approve', 'reject', 'remove', 'restore', 'risk-label')),
  reason_code text not null check (reason_code ~ '^[a-z0-9][a-z0-9_-]{1,79}$'),
  notes text not null default '' check (char_length(notes) <= 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default extensions.gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  slug extensions.citext not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,99}$'),
  title text not null check (char_length(title) between 3 and 160),
  body text not null check (char_length(body) between 1 and 20000),
  moderation_status public.moderation_status not null default 'pending',
  risk_labels text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forum_posts_visible_idx
  on public.forum_posts(created_at desc)
  where moderation_status = 'approved';

create table if not exists public.forum_comments (
  id uuid primary key default extensions.gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete restrict,
  parent_comment_id uuid references public.forum_comments(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (char_length(body) between 1 and 8000),
  moderation_status public.moderation_status not null default 'pending',
  risk_labels text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists forum_comments_post_idx
  on public.forum_comments(post_id, created_at);

create table if not exists public.forum_votes (
  id uuid primary key default extensions.gen_random_uuid(),
  voter_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references public.forum_posts(id) on delete cascade,
  comment_id uuid references public.forum_comments(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint forum_vote_has_one_target check ((post_id is null) <> (comment_id is null)),
  unique nulls not distinct (voter_id, post_id, comment_id)
);

create index if not exists forum_votes_post_idx on public.forum_votes(post_id) where post_id is not null;
create index if not exists forum_votes_comment_idx on public.forum_votes(comment_id) where comment_id is not null;

create or replace function public.protect_forum_managed_fields()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if auth.role() <> 'service_role' then
    if tg_op = 'INSERT' and new.moderation_status <> 'pending' then
      raise exception 'new forum content must be pending';
    end if;
    if tg_op = 'UPDATE' then
      if new.author_id is distinct from old.author_id
        or new.id is distinct from old.id
        or new.created_at is distinct from old.created_at
        or new.risk_labels is distinct from old.risk_labels
        or to_jsonb(new) ->> 'post_id' is distinct from to_jsonb(old) ->> 'post_id'
        or to_jsonb(new) ->> 'parent_comment_id' is distinct from to_jsonb(old) ->> 'parent_comment_id' then
        raise exception 'forum ownership and risk fields are managed';
      end if;
      if to_jsonb(new) ->> 'title' is distinct from to_jsonb(old) ->> 'title'
        or new.body is distinct from old.body then
        new.moderation_status := 'pending';
      elsif new.moderation_status is distinct from old.moderation_status then
        raise exception 'forum moderation is service managed';
      end if;
      new.updated_at := now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_forum_post_fields on public.forum_posts;
create trigger protect_forum_post_fields
before insert or update on public.forum_posts
for each row execute function public.protect_forum_managed_fields();

drop trigger if exists protect_forum_comment_fields on public.forum_comments;
create trigger protect_forum_comment_fields
before insert or update on public.forum_comments
for each row execute function public.protect_forum_managed_fields();

create or replace function public.validate_forum_comment_parent()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if new.parent_comment_id is not null and not exists (
    select 1 from public.forum_comments parent
    where parent.id = new.parent_comment_id and parent.post_id = new.post_id
  ) then
    raise exception 'parent comment must belong to the same post';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_forum_comment_parent on public.forum_comments;
create trigger validate_forum_comment_parent
before insert or update of parent_comment_id, post_id on public.forum_comments
for each row execute function public.validate_forum_comment_parent();

-- Safe price IDs are configured out-of-band after an owner approves pricing.
-- No Stripe secret or price amount is stored in source.
create table if not exists public.billing_price_catalog (
  stripe_price_id text primary key check (stripe_price_id ~ '^price_[A-Za-z0-9_]{8,128}$'),
  plan public.sparkplug_plan not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_catalog_is_pro check (plan = 'pro')
);

create table if not exists public.stripe_webhook_receipts (
  event_id text primary key check (event_id ~ '^evt_[A-Za-z0-9_]{8,128}$'),
  event_type text not null check (char_length(event_type) between 1 and 120),
  payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
  state text not null default 'processing' check (state in ('processing', 'processed')),
  attempts integer not null default 1 check (attempts between 1 and 1000),
  lease_started_at timestamptz not null default now(),
  processed_at timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.claim_stripe_webhook_event(
  p_event_id text,
  p_event_type text,
  p_payload_sha256 text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  receipt public.stripe_webhook_receipts%rowtype;
  inserted boolean := false;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required';
  end if;
  if p_event_id !~ '^evt_[A-Za-z0-9_]{8,128}$'
    or char_length(p_event_type) not between 1 and 120
    or p_payload_sha256 !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid webhook receipt';
  end if;

  insert into public.stripe_webhook_receipts(event_id, event_type, payload_sha256)
  values (p_event_id, p_event_type, p_payload_sha256)
  on conflict (event_id) do nothing
  returning true into inserted;

  if inserted then
    return jsonb_build_object('state', 'claimed', 'attempt', 1);
  end if;

  select * into receipt
  from public.stripe_webhook_receipts
  where event_id = p_event_id
  for update;

  if receipt.payload_sha256 <> p_payload_sha256 or receipt.event_type <> p_event_type then
    raise exception 'webhook event id reuse detected';
  end if;
  if receipt.state = 'processed' then
    return jsonb_build_object('state', 'duplicate', 'attempt', receipt.attempts);
  end if;
  if receipt.lease_started_at > now() - interval '10 minutes' then
    return jsonb_build_object('state', 'in_progress', 'attempt', receipt.attempts);
  end if;

  update public.stripe_webhook_receipts
  set attempts = attempts + 1, lease_started_at = now(), updated_at = now()
  where event_id = p_event_id
  returning * into receipt;
  return jsonb_build_object('state', 'retry', 'attempt', receipt.attempts);
end;
$$;

create or replace function public.apply_stripe_webhook_projection(
  p_event_id text,
  p_event_type text,
  p_projection jsonb,
  p_attempt integer
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  projection_kind text := p_projection ->> 'kind';
  projection_user uuid;
  projection_plan public.sparkplug_plan;
  projection_status text;
  period_end timestamptz;
  receipt public.stripe_webhook_receipts%rowtype;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required';
  end if;
  select * into receipt
  from public.stripe_webhook_receipts r
  where r.event_id = p_event_id
  for update;
  if not found
    or receipt.event_type <> p_event_type
    or receipt.state <> 'processing'
    or receipt.attempts <> p_attempt
    or receipt.lease_started_at <= now() - interval '10 minutes' then
    raise exception 'webhook event was not claimed';
  end if;

  if projection_kind = 'subscription' then
    projection_user := nullif(p_projection ->> 'userId', '')::uuid;
    if projection_user is null then
      select s.user_id into projection_user
      from public.subscriptions s
      where s.stripe_customer_id = nullif(p_projection ->> 'customerId', '')
      limit 1;
    end if;
    if projection_user is null then
      raise exception 'subscription owner is unknown';
    end if;

    select c.plan into projection_plan
    from public.billing_price_catalog c
    where c.stripe_price_id = nullif(p_projection ->> 'priceId', '') and c.active = true;
    if projection_plan is null and p_event_type <> 'customer.subscription.deleted' then
      raise exception 'subscription price is not approved';
    end if;

    projection_status := case p_projection ->> 'status'
      when 'trialing' then 'trialing'
      when 'active' then 'active'
      when 'past_due' then 'past_due'
      when 'canceled' then 'canceled'
      when 'unpaid' then 'past_due'
      else 'inactive'
    end;
    if (p_projection ->> 'currentPeriodEnd') ~ '^[0-9]+$' then
      period_end := to_timestamp((p_projection ->> 'currentPeriodEnd')::double precision);
    end if;

    insert into public.subscriptions as s (
      user_id, plan, status, stripe_customer_id, stripe_subscription_id,
      current_period_end, updated_at
    ) values (
      projection_user, coalesce(projection_plan, 'community'), projection_status,
      nullif(p_projection ->> 'customerId', ''), p_projection ->> 'subscriptionId',
      period_end, now()
    )
    on conflict (user_id) do update set
      plan = coalesce(projection_plan, s.plan),
      status = projection_status,
      stripe_customer_id = coalesce(excluded.stripe_customer_id, s.stripe_customer_id),
      stripe_subscription_id = excluded.stripe_subscription_id,
      current_period_end = excluded.current_period_end,
      updated_at = now();

  elsif projection_kind = 'checkout' and p_projection ->> 'purpose' = 'profile' then
    update public.orders
    set stripe_checkout_session_id = p_projection ->> 'checkoutSessionId',
        stripe_payment_intent_id = nullif(p_projection ->> 'paymentIntentId', ''),
        status = 'paid',
        updated_at = now()
    where listing_id = nullif(p_projection ->> 'listingId', '')::uuid
      and buyer_id = nullif(p_projection ->> 'userId', '')::uuid
      and status = 'pending'
      and amount_cents = (p_projection ->> 'amountTotal')::integer
      and currency = p_projection ->> 'currency';
    if not found then
      raise exception 'matching pending order was not found';
    end if;

  elsif projection_kind = 'connect' then
    update public.creator_payout_accounts
    set charges_enabled = (p_projection ->> 'chargesEnabled')::boolean,
        payouts_enabled = (p_projection ->> 'payoutsEnabled')::boolean,
        updated_at = now()
    where stripe_connect_account_id = p_projection ->> 'accountId';
    if not found then
      raise exception 'Connect account is unknown';
    end if;

  elsif projection_kind = 'order-status' then
    update public.orders
    set status = p_projection ->> 'status', updated_at = now()
    where stripe_payment_intent_id = nullif(p_projection ->> 'paymentIntentId', '')
      and status in ('paid', 'disputed');
  elsif projection_kind <> 'ignored' then
    raise exception 'unsupported webhook projection';
  end if;

  update public.stripe_webhook_receipts
  set state = 'processed', processed_at = now(), updated_at = now()
  where event_id = p_event_id;
end;
$$;

create or replace function public.current_entitlement_claims()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'user_id', u.user_id,
    'plan', case
      when s.plan in ('pro', 'pro_plus')
        and s.status in ('active', 'trialing')
        and (s.current_period_end is null or s.current_period_end > now())
      then 'pro' else 'community' end,
    'status', coalesce(s.status, 'inactive'),
    'creator_class', public.effective_creator_class(u.user_id)::text
  )
  from (select auth.uid() as user_id) u
  left join public.subscriptions s on s.user_id = u.user_id
  where u.user_id is not null;
$$;

create or replace function public.submit_validated_profile_draft(
  p_owner_id uuid,
  p_slug text,
  p_title text,
  p_summary text,
  p_access public.listing_access,
  p_price_cents integer,
  p_currency text,
  p_manifest jsonb,
  p_manifest_sha256 text,
  p_hf_revisions jsonb,
  p_risk_labels text[],
  p_declared_bytes bigint
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  listing_id uuid := extensions.gen_random_uuid();
  version_id uuid := extensions.gen_random_uuid();
  active_pro boolean;
  official_publisher boolean;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required';
  end if;
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = p_owner_id
      and s.plan in ('pro', 'pro_plus')
      and s.status in ('active', 'trialing')
      and (s.current_period_end is null or s.current_period_end > now())
  ) into active_pro;
  select exists (
    select 1 from public.profiles p
    where p.id = p_owner_id and p.creator_class = 'gameworlds_official'
  ) into official_publisher;
  if not active_pro and not official_publisher then
    raise exception 'active Pro is required for hosted profiles';
  end if;
  if (
    p_manifest_sha256 !~ '^[0-9a-f]{64}$'
    or jsonb_typeof(p_hf_revisions) <> 'array'
    or cardinality(p_risk_labels) > 16
    or (p_declared_bytes is not null and (p_declared_bytes < 1 or p_declared_bytes > 2199023255552))
  ) then
    raise exception 'validated profile projection is invalid';
  end if;
  if (
    select count(*) >= 10
    from public.setup_profile_versions v
    where v.created_by = p_owner_id and v.created_at > now() - interval '1 hour'
  ) then
    raise exception 'profile validation budget exceeded';
  end if;

  insert into public.setup_listings(
    id, owner_id, slug, title, summary, access, price_cents, currency
  ) values (
    listing_id, p_owner_id, p_slug, p_title, p_summary,
    p_access, p_price_cents, p_currency
  );
  insert into public.setup_profile_versions(
    id, listing_id, version, schema_version, manifest, manifest_sha256,
    hf_revisions, validation_report, risk_level, risk_labels, created_by
  ) values (
    version_id, listing_id, 1, 1, p_manifest, p_manifest_sha256,
    p_hf_revisions,
    jsonb_build_object(
      'validator', 'setup-profile-v1',
      'declaredBytes', p_declared_bytes
    ),
    'review', p_risk_labels, p_owner_id
  );
  update public.setup_listings
  set current_version_id = version_id,
      manifest_sha256 = p_manifest_sha256,
      risk_level = 'review',
      risk_labels = p_risk_labels,
      updated_at = now()
  where id = listing_id;
  insert into public.security_audit_log(actor_id, action, target_type, target_id, metadata)
  values (
    p_owner_id, 'profile.submit', 'profile', listing_id::text,
    jsonb_build_object('manifestSha256', p_manifest_sha256, 'access', p_access)
  );
  return listing_id;
end;
$$;

create or replace function public.authorized_profile_manifest(p_listing_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  listing public.setup_listings%rowtype;
  version public.setup_profile_versions%rowtype;
begin
  select * into listing
  from public.setup_listings l
  where l.id = p_listing_id
    and l.status = 'published'
    and l.moderation_status = 'approved'
    and l.current_version_id is not null;
  if not found then
    raise exception 'profile unavailable';
  end if;

  if listing.access = 'free' and not public.publisher_hosting_eligible(listing.owner_id) then
    raise exception 'profile unavailable';
  end if;

  if listing.access = 'paid' and auth.role() <> 'service_role' then
    if auth.uid() is null or (
      listing.owner_id <> auth.uid()
      and not exists (
        select 1 from public.orders o
        where o.listing_id = listing.id
          and o.buyer_id = auth.uid()
          and o.status = 'paid'
      )
    ) then
      raise exception 'profile unavailable';
    end if;
  end if;

  select * into version
  from public.setup_profile_versions v
  where v.id = listing.current_version_id
    and v.listing_id = listing.id
    and v.manifest_sha256 = listing.manifest_sha256;
  if not found then
    raise exception 'profile unavailable';
  end if;

  return jsonb_build_object(
    'access', listing.access,
    'schemaVersion', version.schema_version,
    'manifest', version.manifest,
    'manifestSha256', version.manifest_sha256,
    'riskLevel', version.risk_level,
    'riskLabels', version.risk_labels
  );
end;
$$;

create or replace function public.authorized_profile_manifest_by_slug(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  listing_id uuid;
begin
  if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{2,79}$' then
    raise exception 'profile unavailable';
  end if;
  select l.id into listing_id
  from public.setup_listings l
  where l.slug = p_slug
  limit 1;
  if listing_id is null then
    raise exception 'profile unavailable';
  end if;
  return public.authorized_profile_manifest(listing_id);
end;
$$;

-- Public catalog exposes metadata only. Manifest delivery is a separate route
-- whose authorization depends on free publication, ownership, or a paid order.
create or replace view public.public_profile_catalog
with (security_invoker = true)
as
select
  l.id,
  l.slug::text as slug,
  l.title,
  l.summary,
  l.access,
  l.price_cents,
  l.currency,
  l.published_at,
  p.handle::text as creator_handle,
  p.display_name as creator_display_name,
  public.effective_creator_class(p.id)::text as creator_class,
  l.risk_level::text as risk_level,
  case
    when public.effective_creator_class(p.id) = 'community'
      and not ('unverified-creator' = any(l.risk_labels))
      then array_append(l.risk_labels, 'unverified-creator')
    else l.risk_labels
  end as risk_labels,
  l.manifest_sha256 as current_manifest_sha256
from public.setup_listings l
join public.profiles p on p.id = l.owner_id and p.is_public = true
where l.status = 'published'
  and l.moderation_status = 'approved'
  and public.publisher_hosting_eligible(l.owner_id)
  and l.current_version_id is not null;

-- Strict RLS applies even if table ownership changes later. Supabase's service
-- role retains BYPASSRLS for reviewed server routes.
alter table public.profiles force row level security;
alter table public.waitlist_signups force row level security;
alter table public.waitlist_rate_limits force row level security;
alter table public.subscriptions force row level security;
alter table public.creator_payout_accounts force row level security;
alter table public.setup_listings force row level security;
alter table public.setup_profile_versions enable row level security;
alter table public.setup_profile_versions force row level security;
alter table public.orders force row level security;
alter table public.stripe_events force row level security;
alter table public.security_audit_log force row level security;
alter table public.moderation_actions enable row level security;
alter table public.moderation_actions force row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_posts force row level security;
alter table public.forum_comments enable row level security;
alter table public.forum_comments force row level security;
alter table public.forum_votes enable row level security;
alter table public.forum_votes force row level security;
alter table public.billing_price_catalog enable row level security;
alter table public.billing_price_catalog force row level security;
alter table public.stripe_webhook_receipts enable row level security;
alter table public.stripe_webhook_receipts force row level security;

drop policy if exists "free versions are publicly readable" on public.setup_profile_versions;
create policy "free versions are publicly readable"
  on public.setup_profile_versions for select
  using (exists (
    select 1 from public.setup_listings l
    where l.id = setup_profile_versions.listing_id
      and l.status = 'published'
      and l.moderation_status = 'approved'
      and l.access = 'free'
      and public.publisher_hosting_eligible(l.owner_id)
      and l.current_version_id = setup_profile_versions.id
  ));

drop policy if exists "owners can read profile versions" on public.setup_profile_versions;
create policy "owners can read profile versions"
  on public.setup_profile_versions for select to authenticated
  using (exists (
    select 1 from public.setup_listings l
    where l.id = setup_profile_versions.listing_id and l.owner_id = (select auth.uid())
  ));

drop policy if exists "buyers can read purchased profile versions" on public.setup_profile_versions;
create policy "buyers can read purchased profile versions"
  on public.setup_profile_versions for select to authenticated
  using (exists (
    select 1
    from public.orders o
    join public.setup_listings l on l.id = o.listing_id
    where o.listing_id = setup_profile_versions.listing_id
      and o.buyer_id = (select auth.uid())
      and o.status = 'paid'
      and l.current_version_id = setup_profile_versions.id
  ));

drop policy if exists "visible forum posts are readable" on public.forum_posts;
create policy "visible forum posts are readable"
  on public.forum_posts for select
  using (moderation_status = 'approved');

drop policy if exists "authors can read own forum posts" on public.forum_posts;
create policy "authors can read own forum posts"
  on public.forum_posts for select to authenticated
  using (author_id = (select auth.uid()));

drop policy if exists "authors can create forum posts" on public.forum_posts;
create policy "authors can create forum posts"
  on public.forum_posts for insert to authenticated
  with check (author_id = (select auth.uid()) and moderation_status = 'pending');

drop policy if exists "authors can edit forum posts" on public.forum_posts;
create policy "authors can edit forum posts"
  on public.forum_posts for update to authenticated
  using (author_id = (select auth.uid()) and moderation_status <> 'removed')
  with check (author_id = (select auth.uid()));

drop policy if exists "visible forum comments are readable" on public.forum_comments;
create policy "visible forum comments are readable"
  on public.forum_comments for select
  using (moderation_status = 'approved');

drop policy if exists "authors can read own forum comments" on public.forum_comments;
create policy "authors can read own forum comments"
  on public.forum_comments for select to authenticated
  using (author_id = (select auth.uid()));

drop policy if exists "authors can create forum comments" on public.forum_comments;
create policy "authors can create forum comments"
  on public.forum_comments for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and moderation_status = 'pending'
    and exists (
      select 1 from public.forum_posts p
      where p.id = forum_comments.post_id and p.moderation_status = 'approved'
    )
  );

drop policy if exists "authors can edit forum comments" on public.forum_comments;
create policy "authors can edit forum comments"
  on public.forum_comments for update to authenticated
  using (author_id = (select auth.uid()) and moderation_status <> 'removed')
  with check (author_id = (select auth.uid()));

drop policy if exists "voters can read own votes" on public.forum_votes;
create policy "voters can read own votes"
  on public.forum_votes for select to authenticated
  using (voter_id = (select auth.uid()));

drop policy if exists "voters can create votes" on public.forum_votes;
create policy "voters can create votes"
  on public.forum_votes for insert to authenticated
  with check (
    voter_id = (select auth.uid())
    and (
      (post_id is not null and exists (
        select 1 from public.forum_posts p
        where p.id = forum_votes.post_id and p.moderation_status = 'approved'
      ))
      or (comment_id is not null and exists (
        select 1 from public.forum_comments c
        where c.id = forum_votes.comment_id and c.moderation_status = 'approved'
      ))
    )
  );

drop policy if exists "voters can change votes" on public.forum_votes;
create policy "voters can change votes"
  on public.forum_votes for update to authenticated
  using (voter_id = (select auth.uid()))
  with check (voter_id = (select auth.uid()));

drop policy if exists "voters can remove votes" on public.forum_votes;
create policy "voters can remove votes"
  on public.forum_votes for delete to authenticated
  using (voter_id = (select auth.uid()));

-- Remove broad foundation grants and grant only client-owned columns. Public
-- catalog reads flow through the metadata-only view; paid manifests never do.
revoke all on public.profiles from anon, authenticated;
grant select (id, handle, display_name, bio, avatar_path, is_public, created_at, updated_at)
  on public.profiles to anon, authenticated;
grant insert (id, handle, display_name, bio, avatar_path, is_public)
  on public.profiles to authenticated;
grant update (handle, display_name, bio, avatar_path, is_public)
  on public.profiles to authenticated;

revoke all on public.setup_listings from anon, authenticated;
grant select (
  id, owner_id, slug, title, summary, access, price_cents, currency, status,
  manifest_sha256, current_version_id, moderation_status, risk_level, risk_labels,
  published_at, created_at, updated_at
) on public.setup_listings to anon, authenticated;
grant insert (owner_id, slug, title, summary, access, price_cents, currency)
  on public.setup_listings to authenticated;
grant update (slug, title, summary, access, price_cents, currency)
  on public.setup_listings to authenticated;

grant select on public.setup_profile_versions to anon, authenticated;
revoke all on public.forum_posts from anon, authenticated;
grant select on public.forum_posts to anon;
grant select on public.forum_posts to authenticated;
grant insert (author_id, slug, title, body) on public.forum_posts to authenticated;
grant update (slug, title, body) on public.forum_posts to authenticated;
revoke all on public.forum_comments from anon, authenticated;
grant select on public.forum_comments to anon;
grant select on public.forum_comments to authenticated;
grant insert (post_id, parent_comment_id, author_id, body) on public.forum_comments to authenticated;
grant update (body) on public.forum_comments to authenticated;
revoke all on public.forum_votes from authenticated;
grant select on public.forum_votes to authenticated;
grant insert (voter_id, post_id, comment_id, value) on public.forum_votes to authenticated;
grant update (value) on public.forum_votes to authenticated;
grant delete on public.forum_votes to authenticated;
grant select on public.public_profile_catalog to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.subscriptions to service_role;
grant select, insert, update, delete on public.creator_payout_accounts to service_role;
grant select, insert, update, delete on public.setup_listings to service_role;
grant select, insert, update, delete on public.setup_profile_versions to service_role;
grant select, insert, update, delete on public.orders to service_role;
grant select, insert, update, delete on public.moderation_actions to service_role;
grant select, insert, update, delete on public.forum_posts to service_role;
grant select, insert, update, delete on public.forum_comments to service_role;
grant select, insert, update, delete on public.forum_votes to service_role;
grant select, insert, update, delete on public.billing_price_catalog to service_role;
grant select, insert, update, delete on public.stripe_webhook_receipts to service_role;
grant usage, select on sequence public.moderation_actions_id_seq to service_role;

revoke all on public.moderation_actions from anon, authenticated;
revoke all on public.billing_price_catalog from anon, authenticated;
revoke all on public.stripe_webhook_receipts from anon, authenticated;
revoke all on function public.claim_stripe_webhook_event(text, text, text) from public, anon, authenticated;
revoke all on function public.apply_stripe_webhook_projection(text, text, jsonb, integer) from public, anon, authenticated;
revoke all on function public.current_entitlement_claims() from public, anon;
revoke all on function public.effective_creator_class(uuid) from public;
revoke all on function public.publisher_hosting_eligible(uuid) from public;
revoke all on function public.submit_validated_profile_draft(uuid, text, text, text, public.listing_access, integer, text, jsonb, text, jsonb, text[], bigint) from public, anon, authenticated;
revoke all on function public.authorized_profile_manifest(uuid) from public;
revoke all on function public.authorized_profile_manifest_by_slug(text) from public;
revoke all on function public.enforce_listing_quota_and_plan() from public, anon, authenticated;
revoke all on function public.validate_listing_publication() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
grant execute on function public.claim_stripe_webhook_event(text, text, text) to service_role;
grant execute on function public.apply_stripe_webhook_projection(text, text, jsonb, integer) to service_role;
grant execute on function public.current_entitlement_claims() to authenticated;
grant execute on function public.effective_creator_class(uuid) to anon, authenticated, service_role;
grant execute on function public.publisher_hosting_eligible(uuid) to anon, authenticated, service_role;
grant execute on function public.submit_validated_profile_draft(uuid, text, text, text, public.listing_access, integer, text, jsonb, text, jsonb, text[], bigint) to service_role;
grant execute on function public.authorized_profile_manifest(uuid) to anon, authenticated, service_role;
grant execute on function public.authorized_profile_manifest_by_slug(text) to anon, authenticated, service_role;

comment on table public.setup_profile_versions is
  'Immutable, schema-validated public setup profiles. HF references require immutable revisions and SHA-256 checksums; executable code, secrets, local paths, and private outputs are prohibited.';
comment on view public.public_profile_catalog is
  'Cacheable public metadata only. Profile manifest delivery is separately authorized.';
comment on table public.stripe_webhook_receipts is
  'Idempotency receipts and safe hashes only. Raw Stripe webhook payloads are never persisted.';
