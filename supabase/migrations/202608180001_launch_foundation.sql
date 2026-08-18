-- Spark Plug public launch foundation.
-- Apply through the Supabase migration workflow; never paste production secrets here.

create extension if not exists citext with schema extensions;
create extension if not exists pgcrypto with schema extensions;

do $$ begin
  create type public.sparkplug_plan as enum ('community', 'pro', 'pro_plus');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_access as enum ('free', 'paid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_status as enum ('draft', 'published', 'blocked');
exception when duplicate_object then null;
end $$;

create table if not exists public.waitlist_signups (
  id uuid primary key default extensions.gen_random_uuid(),
  email extensions.citext not null unique,
  source text not null default 'launch-site' check (char_length(source) between 1 and 40),
  consented_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.waitlist_rate_limits (
  requester_hash text primary key check (requester_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  attempts integer not null default 1 check (attempts > 0),
  updated_at timestamptz not null default now()
);

create or replace function public.claim_waitlist_slot(p_requester_hash text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  allowed boolean;
begin
  if p_requester_hash is null or p_requester_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  insert into public.waitlist_rate_limits as limits (
    requester_hash,
    window_started_at,
    attempts,
    updated_at
  ) values (p_requester_hash, now(), 1, now())
  on conflict (requester_hash) do update set
    attempts = case
      when limits.window_started_at < now() - interval '15 minutes' then 1
      else limits.attempts + 1
    end,
    window_started_at = case
      when limits.window_started_at < now() - interval '15 minutes' then now()
      else limits.window_started_at
    end,
    updated_at = now()
  returning attempts <= 5 into allowed;

  return allowed;
end;
$$;

revoke all on function public.claim_waitlist_slot(text) from public, anon, authenticated;
grant execute on function public.claim_waitlist_slot(text) to service_role;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle extensions.citext not null unique check (handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 600),
  avatar_path text,
  is_public boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan public.sparkplug_plan not null default 'community',
  status text not null default 'inactive' check (status in ('inactive', 'trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_payout_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_connect_account_id text not null unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.setup_listings (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug extensions.citext not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,79}$'),
  title text not null check (char_length(title) between 1 and 100),
  summary text not null check (char_length(summary) between 1 and 500),
  access public.listing_access not null default 'free',
  price_cents integer not null default 0,
  currency text not null default 'usd' check (currency = lower(currency) and char_length(currency) = 3),
  status public.listing_status not null default 'draft',
  manifest jsonb not null default '{}'::jsonb,
  manifest_sha256 text check (manifest_sha256 is null or manifest_sha256 ~ '^[0-9a-f]{64}$'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint setup_listing_price_matches_access check (
    (access = 'free' and price_cents = 0)
    or (access = 'paid' and price_cents >= 100)
  ),
  constraint published_listing_has_digest check (
    status <> 'published'
    or (manifest_sha256 is not null and published_at is not null)
  )
);

create index if not exists setup_listings_owner_idx on public.setup_listings(owner_id);
create index if not exists setup_listings_published_idx
  on public.setup_listings(published_at desc)
  where status = 'published';

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete restrict,
  listing_id uuid not null references public.setup_listings(id) on delete restrict,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null check (currency = lower(currency) and char_length(currency) = 3),
  status text not null check (status in ('pending', 'paid', 'refunded', 'disputed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_buyer_idx on public.orders(buyer_id, created_at desc);
create index if not exists orders_listing_idx on public.orders(listing_id, created_at desc);

create table if not exists public.stripe_events (
  event_id text primary key,
  event_type text not null,
  payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
  processed_at timestamptz not null default now()
);

create table if not exists public.security_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 1 and 80),
  target_type text not null check (char_length(target_type) between 1 and 40),
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;
alter table public.waitlist_rate_limits enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.creator_payout_accounts enable row level security;
alter table public.setup_listings enable row level security;
alter table public.orders enable row level security;
alter table public.stripe_events enable row level security;
alter table public.security_audit_log enable row level security;

-- Waitlist, rate limits, payment events, and audit rows are service-only. RLS has no
-- client policies on purpose; the server route uses the service role.
revoke all on public.waitlist_signups from anon, authenticated;
revoke all on public.waitlist_rate_limits from anon, authenticated;
revoke all on public.stripe_events from anon, authenticated;
revoke all on public.security_audit_log from anon, authenticated;

drop policy if exists "public profiles are readable" on public.profiles;
create policy "public profiles are readable"
  on public.profiles for select
  using (is_public = true);

drop policy if exists "owners can read their profile" on public.profiles;
create policy "owners can read their profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "owners can create their profile" on public.profiles;
create policy "owners can create their profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id and is_verified = false);

drop policy if exists "owners can update their profile" on public.profiles;
create policy "owners can update their profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.protect_managed_profile_fields()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if auth.role() <> 'service_role' and new.is_verified is distinct from old.is_verified then
    raise exception 'is_verified is managed by the service';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_managed_profile_fields on public.profiles;
create trigger protect_managed_profile_fields
before update on public.profiles
for each row execute function public.protect_managed_profile_fields();

drop policy if exists "owners can read their subscription" on public.subscriptions;
create policy "owners can read their subscription"
  on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "owners can read their payout state" on public.creator_payout_accounts;
create policy "owners can read their payout state"
  on public.creator_payout_accounts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "published listings are readable" on public.setup_listings;
create policy "published listings are readable"
  on public.setup_listings for select
  using (status = 'published');

drop policy if exists "owners can read their listings" on public.setup_listings;
create policy "owners can read their listings"
  on public.setup_listings for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "owners can create drafts" on public.setup_listings;
create policy "owners can create drafts"
  on public.setup_listings for insert to authenticated
  with check ((select auth.uid()) = owner_id and status = 'draft');

drop policy if exists "owners can update drafts" on public.setup_listings;
create policy "owners can update drafts"
  on public.setup_listings for update to authenticated
  using ((select auth.uid()) = owner_id and status = 'draft')
  with check ((select auth.uid()) = owner_id and status = 'draft');

drop policy if exists "buyers can read their orders" on public.orders;
create policy "buyers can read their orders"
  on public.orders for select to authenticated
  using ((select auth.uid()) = buyer_id);

drop policy if exists "creators can read sales for their listings" on public.orders;
create policy "creators can read sales for their listings"
  on public.orders for select to authenticated
  using (
    exists (
      select 1 from public.setup_listings
      where setup_listings.id = orders.listing_id
        and setup_listings.owner_id = (select auth.uid())
    )
  );

-- Authenticated users need table privileges in addition to RLS. Mutations that
-- change verification, subscriptions, payments, order state, or publication state
-- are intentionally reserved for service-owned server routes.
grant select, insert, update on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;
grant select on public.creator_payout_accounts to authenticated;
grant select on public.setup_listings to anon;
grant select, insert, update on public.setup_listings to authenticated;
grant select on public.orders to authenticated;

-- Keep anonymous access narrow: only rows admitted by public SELECT policies.
revoke insert, update, delete on public.profiles from anon;
revoke insert, update, delete on public.setup_listings from anon;

comment on table public.setup_listings is
  'Public setup manifests only. Credentials, host paths, session data, and private output references are prohibited.';
