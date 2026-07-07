-- Promo codes + in-app notifications

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
  barber_ids text[] not null default '{}',
  product_slugs text[] not null default '{}',
  applies_shop boolean not null default true,
  applies_booking boolean not null default false,
  active boolean not null default true,
  max_uses integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists promo_codes_code_idx on public.promo_codes (upper(code));

alter table public.shop_orders
  add column if not exists subtotal_mnt integer,
  add column if not exists discount_mnt integer not null default 0,
  add column if not exists promo_code text,
  add column if not exists promo_id uuid references public.promo_codes (id) on delete set null;

alter table public.appointments
  add column if not exists promo_code text;

alter table public.promo_codes enable row level security;

drop policy if exists "promo_codes_admin_all" on public.promo_codes;
create policy "promo_codes_admin_all"
  on public.promo_codes for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.app_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  notification_id uuid not null references public.app_notifications (id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, notification_id)
);

create index if not exists user_notifications_user_idx
  on public.user_notifications (user_id, created_at desc);

alter table public.app_notifications enable row level security;
alter table public.user_notifications enable row level security;

drop policy if exists "app_notifications_admin_all" on public.app_notifications;
create policy "app_notifications_admin_all"
  on public.app_notifications for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "user_notifications_read_own" on public.user_notifications;
create policy "user_notifications_read_own"
  on public.user_notifications for select
  using (auth.uid() = user_id);

drop policy if exists "user_notifications_update_own" on public.user_notifications;
create policy "user_notifications_update_own"
  on public.user_notifications for update
  using (auth.uid() = user_id);

drop policy if exists "user_notifications_admin_insert" on public.user_notifications;
create policy "user_notifications_admin_insert"
  on public.user_notifications for insert
  with check (public.is_admin());

-- Users can read notification content for their inbox rows
drop policy if exists "app_notifications_read_via_inbox" on public.app_notifications;
create policy "app_notifications_read_via_inbox"
  on public.app_notifications for select
  using (
    exists (
      select 1 from public.user_notifications un
      where un.notification_id = app_notifications.id
        and un.user_id = auth.uid()
    )
  );
