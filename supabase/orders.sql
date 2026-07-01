-- Orders for e-commerce checkout (run after prisma db push or standalone)

create table if not exists public.shop_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  status text not null default 'AWAITING_PAYMENT',
  total_mnt integer not null check (total_mnt >= 0),
  currency text not null default 'MNT',
  payment_method text,
  payment_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.shop_orders (id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_mnt integer not null check (unit_price_mnt >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists shop_orders_user_idx on public.shop_orders (user_id, created_at desc);
create index if not exists shop_order_items_order_idx on public.shop_order_items (order_id);

alter table public.shop_orders enable row level security;
alter table public.shop_order_items enable row level security;

drop policy if exists "shop_orders_insert" on public.shop_orders;
create policy "shop_orders_insert"
  on public.shop_orders for insert
  with check (true);

drop policy if exists "shop_orders_read_own" on public.shop_orders;
create policy "shop_orders_read_own"
  on public.shop_orders for select
  using (auth.uid() = user_id or user_id is null);

drop policy if exists "shop_order_items_insert" on public.shop_order_items;
create policy "shop_order_items_insert"
  on public.shop_order_items for insert
  with check (true);

drop policy if exists "shop_order_items_read" on public.shop_order_items;
create policy "shop_order_items_read"
  on public.shop_order_items for select
  using (
    exists (
      select 1 from public.shop_orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );
