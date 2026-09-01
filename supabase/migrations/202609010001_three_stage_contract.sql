-- Spark Plug staged-launch contract.
-- The first commercial stage sells Pro subscriptions only. Marketplace profiles
-- are free to download, Pro-gated to publish, and always service moderated.

do $$
begin
  if exists (select 1 from public.setup_listings where access = 'paid') then
    raise exception 'paid listings must be resolved before the staged-launch contract is applied';
  end if;
  if exists (select 1 from public.orders) then
    raise exception 'marketplace orders must be resolved before paid marketplace is disabled';
  end if;
end;
$$;

create or replace function public.enforce_free_marketplace_only()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if new.access <> 'free' or new.price_cents <> 0 or new.currency <> 'usd' then
    raise exception 'the first public marketplace accepts free profiles only';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_free_marketplace_only on public.setup_listings;
create trigger enforce_free_marketplace_only
before insert or update of access, price_cents, currency on public.setup_listings
for each row execute function public.enforce_free_marketplace_only();

-- Community Leader is earned independently from billing. The public projection
-- exposes only recognition status and dates; reviewer notes remain service-only.
create table if not exists public.community_leader_recognitions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  contribution_summary text not null check (char_length(contribution_summary) between 20 and 1000),
  reviewed_by uuid not null references auth.users(id) on delete restrict,
  reviewed_at timestamptz not null,
  expires_at timestamptz not null check (expires_at > reviewed_at),
  removal_reason text check (removal_reason is null or char_length(removal_reason) between 10 and 1000),
  appeal_status text not null default 'none' check (appeal_status in ('none', 'pending', 'accepted', 'denied')),
  updated_at timestamptz not null default now()
);

alter table public.community_leader_recognitions enable row level security;
alter table public.community_leader_recognitions force row level security;
revoke all on public.community_leader_recognitions from anon, authenticated;
grant select, insert, update, delete on public.community_leader_recognitions to service_role;

create or replace function public.is_active_community_leader(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.community_leader_recognitions l
    where l.user_id = p_user_id
      and l.status = 'active'
      and l.expires_at > now()
  );
$$;

revoke all on function public.is_active_community_leader(uuid) from public, anon, authenticated;
grant execute on function public.is_active_community_leader(uuid) to service_role;

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
    )
    or public.is_active_community_leader(p_owner_id);
$$;

create or replace view public.public_community_leaders
with (security_invoker = true)
as
select p.handle, p.display_name, l.reviewed_at, l.expires_at
from public.community_leader_recognitions l
join public.profiles p on p.id = l.user_id
where l.status = 'active' and l.expires_at > now() and p.is_public = true;

grant select on public.public_community_leaders to anon, authenticated;

-- Optional end-to-end encrypted profile snapshots. The service never receives
-- a plaintext profile, prompt, output, credential, route, or node identifier.
create table if not exists public.private_profile_snapshots (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  profile_key uuid not null,
  version integer not null check (version between 1 and 1000000),
  ciphertext text not null check (char_length(ciphertext) between 24 and 524288),
  nonce text not null check (char_length(nonce) between 16 and 128),
  cipher_suite text not null check (cipher_suite in ('xchacha20-poly1305-v1')),
  ciphertext_sha256 text not null check (ciphertext_sha256 ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  unique (owner_id, profile_key, version)
);

alter table public.private_profile_snapshots enable row level security;
alter table public.private_profile_snapshots force row level security;
create policy "owners manage encrypted profile snapshots"
  on public.private_profile_snapshots for all to authenticated
  using ((select auth.uid()) = owner_id and public.publisher_hosting_eligible(owner_id))
  with check ((select auth.uid()) = owner_id and public.publisher_hosting_eligible(owner_id));
grant select, insert, delete on public.private_profile_snapshots to authenticated;
revoke update on public.private_profile_snapshots from authenticated;

create table if not exists public.marketplace_collections (
  owner_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.setup_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (owner_id, listing_id)
);

alter table public.marketplace_collections enable row level security;
alter table public.marketplace_collections force row level security;
create policy "owners manage their marketplace collection"
  on public.marketplace_collections for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
grant select, insert, delete on public.marketplace_collections to authenticated;

create table if not exists public.profile_download_totals (
  listing_id uuid primary key references public.setup_listings(id) on delete cascade,
  download_count bigint not null default 0 check (download_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.profile_download_totals enable row level security;
alter table public.profile_download_totals force row level security;
revoke all on public.profile_download_totals from anon, authenticated;
grant select, insert, update, delete on public.profile_download_totals to service_role;

-- Leader recognition grants the same complimentary Pro projection without ever
-- changing the Stripe subscription row or implying that payment bought a badge.
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
      when (
        s.plan in ('pro', 'pro_plus')
        and s.status in ('active', 'trialing')
        and (s.current_period_end is null or s.current_period_end > now())
      ) or public.is_active_community_leader(u.user_id)
      then 'pro' else 'community' end,
    'status', case
      when public.is_active_community_leader(u.user_id) then 'active'
      else coalesce(s.status, 'inactive') end,
    'creator_class', public.effective_creator_class(u.user_id)::text,
    'community_leader', public.is_active_community_leader(u.user_id)
  )
  from (select auth.uid() as user_id) u
  left join public.subscriptions s on s.user_id = u.user_id
  where u.user_id is not null;
$$;

-- The dormant paid-marketplace tables remain service-only for migration safety,
-- but no user or app route may create new orders or payout state.
revoke all on public.creator_payout_accounts from anon, authenticated;
revoke all on public.orders from anon, authenticated;

create or replace function public.current_billing_context()
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select jsonb_build_object(
    'user_id', u.user_id,
    'stripe_customer_id', s.stripe_customer_id,
    'plan', coalesce(s.plan::text, 'community'),
    'status', coalesce(s.status, 'inactive')
  )
  from (select auth.uid() as user_id) u
  left join public.subscriptions s on s.user_id = u.user_id
  where u.user_id is not null;
$$;

revoke all on function public.current_billing_context() from public, anon;
grant execute on function public.current_billing_context() to authenticated;
