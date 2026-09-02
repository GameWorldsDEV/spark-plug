-- Creator commerce extension: paid listings, required compatibility evidence,
-- creator-first support, GameWorlds escalation, and auditable refund review.

drop trigger if exists enforce_free_marketplace_only on public.setup_listings;
drop function if exists public.enforce_free_marketplace_only();

alter table public.setup_listings
  add column if not exists asset_type text not null default 'profile'
    check (asset_type in ('profile', 'theme', 'motion-pack', 'lora-adapter')),
  add column if not exists support_status text not null default 'active'
    check (support_status in ('active', 'maintenance', 'abandoned')),
  add column if not exists creator_support_url text,
  add column if not exists platform_fee_bps integer not null default 500
    check (platform_fee_bps = 500),
  add column if not exists stripe_price_id text unique;

alter table public.setup_listings
  add constraint setup_listings_creator_support_url_https
  check (creator_support_url is null or creator_support_url ~ '^https://');

create table if not exists public.listing_compatibility (
  id uuid primary key default extensions.gen_random_uuid(),
  listing_id uuid not null references public.setup_listings(id) on delete cascade,
  listing_version integer not null check (listing_version between 1 and 1000000),
  device_maker text not null check (char_length(device_maker) between 1 and 100),
  device_model text not null check (char_length(device_model) between 1 and 160),
  operating_system text not null check (char_length(operating_system) between 1 and 120),
  architecture text not null check (architecture in ('arm64', 'x86_64')),
  memory_gb numeric(8,2) not null check (memory_gb > 0),
  gpu text check (gpu is null or char_length(gpu) between 1 and 160),
  vram_gb numeric(8,2) check (vram_gb is null or vram_gb >= 0),
  engine text not null check (char_length(engine) between 1 and 100),
  engine_version text not null check (char_length(engine_version) between 1 and 100),
  model_revision text not null check (char_length(model_revision) between 1 and 200),
  evidence_url text check (evidence_url is null or evidence_url ~ '^https://'),
  tested_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (listing_id, listing_version, device_maker, device_model, operating_system, engine, engine_version, model_revision)
);

create table if not exists public.marketplace_support_cases (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  buyer_id uuid not null references auth.users(id) on delete restrict,
  creator_id uuid not null references auth.users(id) on delete restrict,
  listing_version integer not null check (listing_version between 1 and 1000000),
  status text not null default 'creator_review'
    check (status in ('creator_review', 'creator_cure', 'resolved', 'admin_review', 'refund_approved', 'refund_denied', 'closed')),
  compatibility_record_id uuid references public.listing_compatibility(id) on delete restrict,
  buyer_preflight_sha256 text check (buyer_preflight_sha256 is null or buyer_preflight_sha256 ~ '^[0-9a-f]{64}$'),
  creator_response_due_at timestamptz,
  escalated_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_case_events (
  id bigint generated always as identity primary key,
  case_id uuid not null references public.marketplace_support_cases(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text not null check (actor_role in ('buyer', 'creator', 'gameworlds_admin', 'system')),
  event_type text not null check (event_type in ('opened', 'message', 'revision', 'creator_cure_started', 'creator_cure_completed', 'escalated', 'admin_test', 'abandoned', 'refund_decision', 'closed')),
  public_note text check (public_note is null or char_length(public_note) between 1 and 4000),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_refund_reviews (
  id uuid primary key default extensions.gen_random_uuid(),
  case_id uuid not null unique references public.marketplace_support_cases(id) on delete restrict,
  reason text not null check (reason in ('mandatory_law', 'verified_unfixable_defect', 'creator_abandonment')),
  gameworlds_verified boolean not null default false,
  creator_cure_attempted boolean not null default false,
  decision text not null check (decision in ('approved', 'denied')),
  decision_note text not null check (char_length(decision_note) between 10 and 4000),
  decided_by uuid not null references auth.users(id) on delete restrict,
  decided_at timestamptz not null default now()
);

create table if not exists public.marketplace_admins (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('moderator', 'refund_admin', 'platform_admin')),
  granted_by uuid references auth.users(id) on delete restrict,
  granted_at timestamptz not null default now()
);

create table if not exists public.marketplace_seller_terms_acceptances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  terms_version text not null check (terms_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}(?:\.[0-9]+)?$'),
  terms_sha256 text not null check (terms_sha256 ~ '^[0-9a-f]{64}$'),
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.model_license_reviews (
  repo_id text not null check (repo_id ~ '^[A-Za-z0-9][A-Za-z0-9._-]{0,95}/[A-Za-z0-9][A-Za-z0-9._-]{0,95}$'),
  revision text not null check (revision ~ '^[a-f0-9]{40}$'),
  license_id text not null check (license_id ~ '^[A-Za-z0-9][A-Za-z0-9.+-]{0,63}$'),
  distribution_policy text not null check (distribution_policy in ('paid_reference_allowed', 'free_reference_only', 'blocked')),
  safety_tier text not null default 'standard' check (safety_tier in ('standard', 'restricted', 'blocked')),
  source_url text not null check (source_url ~ '^https://'),
  decision_note text not null check (char_length(decision_note) between 10 and 2000),
  reviewed_by uuid not null references auth.users(id) on delete restrict,
  reviewed_at timestamptz not null default now(),
  expires_at timestamptz not null check (expires_at > reviewed_at),
  primary key (repo_id, revision, license_id)
);

create unique index if not exists one_open_support_case_per_order
  on public.marketplace_support_cases(order_id)
  where status <> 'closed';

alter table public.orders
  add column if not exists platform_fee_bps integer not null default 500 check (platform_fee_bps = 500),
  add column if not exists platform_fee_cents integer check (platform_fee_cents is null or platform_fee_cents >= 0),
  add column if not exists creator_transfer_cents integer check (creator_transfer_cents is null or creator_transfer_cents >= 0);

alter table public.listing_compatibility enable row level security;
alter table public.listing_compatibility force row level security;
alter table public.marketplace_support_cases enable row level security;
alter table public.marketplace_support_cases force row level security;
alter table public.marketplace_case_events enable row level security;
alter table public.marketplace_case_events force row level security;
alter table public.marketplace_refund_reviews enable row level security;
alter table public.marketplace_refund_reviews force row level security;
alter table public.marketplace_admins enable row level security;
alter table public.marketplace_admins force row level security;
alter table public.marketplace_seller_terms_acceptances enable row level security;
alter table public.marketplace_seller_terms_acceptances force row level security;
alter table public.model_license_reviews enable row level security;
alter table public.model_license_reviews force row level security;

create policy "published compatibility is public"
  on public.listing_compatibility for select to anon, authenticated
  using (exists (
    select 1 from public.setup_listings l
    where l.id = listing_id and l.status = 'published'
  ));

create policy "case parties can read support cases"
  on public.marketplace_support_cases for select to authenticated
  using ((select auth.uid()) in (buyer_id, creator_id));

create policy "buyers can open purchased support cases"
  on public.marketplace_support_cases for insert to authenticated
  with check (
    (select auth.uid()) = buyer_id
    and exists (
      select 1 from public.orders o
      where o.id = order_id and o.buyer_id = (select auth.uid()) and o.status = 'paid'
    )
  );

create policy "case parties can read events"
  on public.marketplace_case_events for select to authenticated
  using (exists (
    select 1 from public.marketplace_support_cases c
    where c.id = case_id and (select auth.uid()) in (c.buyer_id, c.creator_id)
  ));

revoke all on public.listing_compatibility, public.marketplace_support_cases,
  public.marketplace_case_events, public.marketplace_refund_reviews,
  public.marketplace_admins, public.marketplace_seller_terms_acceptances,
  public.model_license_reviews from anon, authenticated;
grant select on public.listing_compatibility to anon, authenticated;
grant select, insert on public.marketplace_support_cases to authenticated;
grant select on public.marketplace_case_events to authenticated;
grant select, insert, update, delete on public.listing_compatibility,
  public.marketplace_support_cases, public.marketplace_case_events,
  public.marketplace_refund_reviews, public.marketplace_admins to service_role;
grant select, insert, update, delete on public.marketplace_seller_terms_acceptances to service_role;
grant select, insert, update, delete on public.model_license_reviews to service_role;

comment on table public.marketplace_support_cases is
  'Creator-first support workflow; GameWorlds admin actions occur through service-owned audited operations.';
comment on table public.marketplace_refund_reviews is
  'Refund decisions preserve mandatory law and require an allowed reason plus an auditable administrator decision.';
comment on table public.model_license_reviews is
  'Exact pinned model-license and safety decisions. Unknown or expired rows fail closed during marketplace publication.';

create or replace function public.submit_creator_profile_draft(
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
  p_declared_bytes bigint,
  p_compatibility jsonb,
  p_creator_support_url text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  listing_id uuid;
  version_number integer := 1;
  item jsonb;
  license_risk_labels text[] := '{}';
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  if jsonb_typeof(p_compatibility) <> 'array' or jsonb_array_length(p_compatibility) < 1 or jsonb_array_length(p_compatibility) > 24 then
    raise exception 'compatibility evidence is required';
  end if;
  if jsonb_typeof(p_hf_revisions) <> 'array' or exists (
    select 1
    from jsonb_array_elements(p_hf_revisions) model
    left join public.model_license_reviews review
      on review.repo_id = model->>'repoId'
      and review.revision = model->>'revision'
      and review.license_id = model->>'licenseId'
      and review.expires_at > now()
    where review.repo_id is null
      or review.distribution_policy = 'blocked'
      or review.safety_tier = 'blocked'
      or (p_access = 'paid' and review.distribution_policy <> 'paid_reference_allowed')
  ) then
    raise exception 'a current model license review does not permit this listing';
  end if;
  select coalesce(array_agg(distinct 'model-safety-' || review.safety_tier), '{}')
  into license_risk_labels
  from jsonb_array_elements(p_hf_revisions) model
  join public.model_license_reviews review
    on review.repo_id = model->>'repoId'
    and review.revision = model->>'revision'
    and review.license_id = model->>'licenseId'
  where review.safety_tier = 'restricted';
  listing_id := public.submit_validated_profile_draft(
    p_owner_id, p_slug, p_title, p_summary, p_access, p_price_cents,
    p_currency, p_manifest, p_manifest_sha256, p_hf_revisions,
    p_risk_labels || license_risk_labels, p_declared_bytes
  );
  update public.setup_listings
  set creator_support_url = p_creator_support_url,
      platform_fee_bps = 500,
      updated_at = now()
  where id = listing_id;
  for item in select value from jsonb_array_elements(p_compatibility)
  loop
    insert into public.listing_compatibility(
      listing_id, listing_version, device_maker, device_model,
      operating_system, architecture, memory_gb, gpu, vram_gb,
      engine, engine_version, model_revision, evidence_url, tested_at
    ) values (
      listing_id, version_number, item->>'deviceMaker', item->>'deviceModel',
      item->>'operatingSystem', item->>'architecture', (item->>'memoryGb')::numeric,
      nullif(item->>'gpu', ''), nullif(item->>'vramGb', '')::numeric,
      item->>'engine', item->>'engineVersion', item->>'modelRevision',
      nullif(item->>'evidenceUrl', ''), (item->>'testedAt')::timestamptz
    );
  end loop;
  return listing_id;
end;
$$;

revoke all on function public.submit_creator_profile_draft(uuid, text, text, text, public.listing_access, integer, text, jsonb, text, jsonb, text[], bigint, jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_creator_profile_draft(uuid, text, text, text, public.listing_access, integer, text, jsonb, text, jsonb, text[], bigint, jsonb, text) to service_role;

create or replace function public.prepare_marketplace_checkout(
  p_buyer_id uuid,
  p_listing_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  listing public.setup_listings%rowtype;
  payout public.creator_payout_accounts%rowtype;
  order_id uuid := extensions.gen_random_uuid();
  fee_cents integer;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  select * into listing
  from public.setup_listings l
  where l.id = p_listing_id
    and l.status = 'published'
    and l.moderation_status = 'approved'
    and l.access = 'paid'
    and l.support_status = 'active'
    and l.platform_fee_bps = 500
    and l.stripe_price_id ~ '^price_[A-Za-z0-9_]{8,128}$'
    and exists (
      select 1 from public.listing_compatibility c
      where c.listing_id = l.id
    )
  for update;
  if not found or listing.owner_id = p_buyer_id then
    raise exception 'listing is unavailable';
  end if;

  select * into payout
  from public.creator_payout_accounts p
  where p.user_id = listing.owner_id
    and p.charges_enabled = true
    and p.payouts_enabled = true;
  if not found then raise exception 'seller payout is unavailable'; end if;

  fee_cents := round(listing.price_cents * 500.0 / 10000.0);
  insert into public.orders(
    id, buyer_id, listing_id, amount_cents, currency, status,
    platform_fee_bps, platform_fee_cents, creator_transfer_cents
  ) values (
    order_id, p_buyer_id, listing.id, listing.price_cents, listing.currency,
    'pending', 500, fee_cents, listing.price_cents - fee_cents
  );

  insert into public.security_audit_log(actor_id, action, target_type, target_id, metadata)
  values (p_buyer_id, 'marketplace.checkout.prepare', 'order', order_id::text,
    jsonb_build_object('listingId', listing.id, 'amountCents', listing.price_cents, 'platformFeeBps', 500));

  return jsonb_build_object(
    'orderId', order_id,
    'listingId', listing.id,
    'priceId', listing.stripe_price_id,
    'connectedAccountId', payout.stripe_connect_account_id,
    'amountCents', listing.price_cents,
    'currency', listing.currency
  );
end;
$$;

revoke all on function public.prepare_marketplace_checkout(uuid, uuid) from public, anon, authenticated;
grant execute on function public.prepare_marketplace_checkout(uuid, uuid) to service_role;

create or replace function public.create_marketplace_support_case(
  p_buyer_id uuid,
  p_order_id uuid,
  p_compatibility_id uuid,
  p_preflight_sha256 text,
  p_summary text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  purchased public.orders%rowtype;
  creator_id uuid;
  case_id uuid := extensions.gen_random_uuid();
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  if p_preflight_sha256 !~ '^[0-9a-f]{64}$' or char_length(p_summary) not between 10 and 4000 then
    raise exception 'support evidence is invalid';
  end if;
  select * into purchased from public.orders o
  where o.id = p_order_id and o.buyer_id = p_buyer_id and o.status = 'paid';
  if not found then raise exception 'paid order is unavailable'; end if;
  select l.owner_id into creator_id from public.setup_listings l
  where l.id = purchased.listing_id and exists (
    select 1 from public.listing_compatibility c
    where c.id = p_compatibility_id and c.listing_id = l.id
  );
  if creator_id is null then raise exception 'compatibility declaration is unavailable'; end if;
  insert into public.marketplace_support_cases(
    id, order_id, buyer_id, creator_id, listing_version,
    compatibility_record_id, buyer_preflight_sha256
  ) values (
    case_id, purchased.id, p_buyer_id, creator_id, 1,
    p_compatibility_id, p_preflight_sha256
  );
  insert into public.marketplace_case_events(case_id, actor_id, actor_role, event_type, public_note)
  values (case_id, p_buyer_id, 'buyer', 'opened', p_summary);
  return case_id;
end;
$$;

create or replace function public.append_marketplace_case_event(
  p_actor_id uuid,
  p_case_id uuid,
  p_event_type text,
  p_note text,
  p_evidence jsonb
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  support_case public.marketplace_support_cases%rowtype;
  actor_role text;
begin
  if auth.role() <> 'service_role' then raise exception 'service role required'; end if;
  select * into support_case from public.marketplace_support_cases c
  where c.id = p_case_id for update;
  if not found or support_case.status in ('closed', 'refund_approved', 'refund_denied') then
    raise exception 'case is unavailable';
  end if;
  actor_role := case
    when p_actor_id = support_case.buyer_id then 'buyer'
    when p_actor_id = support_case.creator_id then 'creator'
    else null
  end;
  if actor_role is null or p_event_type not in ('message', 'revision', 'creator_cure_started', 'creator_cure_completed', 'escalated') then
    raise exception 'case action is not authorized';
  end if;
  if p_event_type in ('revision', 'creator_cure_started', 'creator_cure_completed') and actor_role <> 'creator' then
    raise exception 'creator action required';
  end if;
  if char_length(p_note) not between 1 and 4000 or jsonb_typeof(p_evidence) <> 'object' or octet_length(p_evidence::text) > 6000 then
    raise exception 'case event is invalid';
  end if;
  insert into public.marketplace_case_events(case_id, actor_id, actor_role, event_type, public_note, evidence)
  values (p_case_id, p_actor_id, actor_role, p_event_type, p_note, p_evidence);
  update public.marketplace_support_cases
  set status = case
      when p_event_type = 'creator_cure_started' then 'creator_cure'
      when p_event_type = 'creator_cure_completed' then 'resolved'
      when p_event_type = 'escalated' then 'admin_review'
      else status end,
      escalated_at = case when p_event_type = 'escalated' then now() else escalated_at end,
      resolved_at = case when p_event_type = 'creator_cure_completed' then now() else resolved_at end,
      updated_at = now()
  where id = p_case_id;
end;
$$;

create or replace function public.decide_marketplace_refund(
  p_admin_id uuid,
  p_case_id uuid,
  p_reason text,
  p_gameworlds_verified boolean,
  p_creator_cure_attempted boolean,
  p_decision text,
  p_decision_note text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  support_case public.marketplace_support_cases%rowtype;
begin
  if auth.role() <> 'service_role' or not exists (
    select 1 from public.marketplace_admins a
    where a.user_id = p_admin_id and a.role in ('refund_admin', 'platform_admin')
  ) then raise exception 'refund administrator required'; end if;
  select * into support_case from public.marketplace_support_cases c
  where c.id = p_case_id and c.status = 'admin_review' for update;
  if not found then raise exception 'case is not ready for refund review'; end if;
  if p_reason not in ('mandatory_law', 'verified_unfixable_defect', 'creator_abandonment') or p_decision not in ('approved', 'denied') or char_length(p_decision_note) not between 10 and 4000 then
    raise exception 'refund decision is invalid';
  end if;
  if p_decision = 'approved' and p_reason = 'verified_unfixable_defect' and (not p_gameworlds_verified or not p_creator_cure_attempted) then
    raise exception 'verified defect and creator cure are required';
  end if;
  insert into public.marketplace_refund_reviews(
    case_id, reason, gameworlds_verified, creator_cure_attempted,
    decision, decision_note, decided_by
  ) values (
    p_case_id, p_reason, p_gameworlds_verified, p_creator_cure_attempted,
    p_decision, p_decision_note, p_admin_id
  );
  update public.marketplace_support_cases
  set status = case when p_decision = 'approved' then 'refund_approved' else 'refund_denied' end,
      resolved_at = now(), updated_at = now()
  where id = p_case_id;
  insert into public.marketplace_case_events(case_id, actor_id, actor_role, event_type, public_note)
  values (p_case_id, p_admin_id, 'gameworlds_admin', 'refund_decision', p_decision_note);
end;
$$;

revoke all on function public.create_marketplace_support_case(uuid, uuid, uuid, text, text) from public, anon, authenticated;
revoke all on function public.append_marketplace_case_event(uuid, uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.decide_marketplace_refund(uuid, uuid, text, boolean, boolean, text, text) from public, anon, authenticated;
grant execute on function public.create_marketplace_support_case(uuid, uuid, uuid, text, text) to service_role;
grant execute on function public.append_marketplace_case_event(uuid, uuid, text, text, jsonb) to service_role;
grant execute on function public.decide_marketplace_refund(uuid, uuid, text, boolean, boolean, text, text) to service_role;

create or replace function public.creator_payout_context(p_user_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select case when auth.role() <> 'service_role' then null else jsonb_build_object(
    'connectedAccountId', p.stripe_connect_account_id,
    'eligible', public.publisher_hosting_eligible(p_user_id),
    'sellerTermsAccepted', exists (
      select 1 from public.marketplace_seller_terms_acceptances t
      where t.user_id = p_user_id and t.revoked_at is null
    )
  ) end
  from (select 1) seed
  left join public.creator_payout_accounts p on p.user_id = p_user_id;
$$;

create or replace function public.register_creator_payout_account(p_user_id uuid, p_account_id text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.role() <> 'service_role' or p_account_id !~ '^acct_[A-Za-z0-9_]{8,128}$' then
    raise exception 'service role and a valid Connect account are required';
  end if;
  if not public.publisher_hosting_eligible(p_user_id) or not exists (
    select 1 from public.marketplace_seller_terms_acceptances t
    where t.user_id = p_user_id and t.revoked_at is null
  ) then raise exception 'creator is not eligible for seller onboarding'; end if;
  insert into public.creator_payout_accounts(user_id, stripe_connect_account_id)
  values (p_user_id, p_account_id)
  on conflict (user_id) do update set
    stripe_connect_account_id = excluded.stripe_connect_account_id,
    charges_enabled = false, payouts_enabled = false, updated_at = now();
end;
$$;

revoke all on function public.creator_payout_context(uuid) from public, anon, authenticated;
revoke all on function public.register_creator_payout_account(uuid, text) from public, anon, authenticated;
grant execute on function public.creator_payout_context(uuid) to service_role;
grant execute on function public.register_creator_payout_account(uuid, text) to service_role;
