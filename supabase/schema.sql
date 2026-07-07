-- Achira Artist / Blended barbershop — Supabase schema
-- Run in Supabase Dashboard → SQL Editor

create extension if not exists "pgcrypto";

do $$ begin
  create type appointment_status as enum (
    'AWAITING_PAYMENT',
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED',
    'NO_SHOW'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.barbers (
  id text primary key,
  name text not null,
  title text not null,
  image_url text,
  bio text,
  active boolean not null default true,
  schedule jsonb not null default '{
    "0": {"off": true, "start": 10, "end": 22},
    "1": {"off": false, "start": 10, "end": 22},
    "2": {"off": false, "start": 10, "end": 22},
    "3": {"off": false, "start": 10, "end": 22},
    "4": {"off": false, "start": 10, "end": 22},
    "5": {"off": false, "start": 10, "end": 22},
    "6": {"off": false, "start": 10, "end": 22}
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  price_mnt integer not null check (price_mnt >= 0),
  image_url text,
  in_stock boolean not null default true,
  always_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  barber_id text not null references public.barbers (id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appointment_status not null default 'PENDING',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_barber_starts_idx
  on public.appointments (barber_id, starts_at);

alter table public.barbers enable row level security;
alter table public.products enable row level security;
alter table public.appointments enable row level security;

drop policy if exists "barbers_public_read" on public.barbers;
create policy "barbers_public_read"
  on public.barbers for select
  using (active = true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (in_stock = true or always_visible = true);

drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert"
  on public.appointments for insert
  with check (true);

drop policy if exists "appointments_public_read" on public.appointments;
create policy "appointments_public_read"
  on public.appointments for select
  using (true);

-- Seed barbers
insert into public.barbers (id, name, title, image_url) values
  (
    'b1',
    'Энхбат',
    'Senior Barber',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&h=920&crop=faces'
  ),
  (
    'b2',
    'Батбаяр',
    'Master Stylist',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&h=920&crop=faces'
  ),
  (
    'b3',
    'Төмөр',
    'Barber',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=700&h=920&crop=faces'
  )
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  image_url = excluded.image_url,
  updated_at = now();

-- Seed products
insert into public.products (slug, name, description, price_mnt, image_url) values
  (
    'blended-classic-wax',
    'Blended Classic Wax',
    'Өндөр гялалт, удаан хугацаанд хэлбэрээ хадгалах үсний вакс. Бүх үсний төрөлд тохирно.',
    89000,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop'
  ),
  (
    'matte-texture-clay',
    'Matte Texture Clay',
    'Мат гадар, байгалийн харагдах байдал. Дунд барьцалтай, амархан угаагдана.',
    95000,
    'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=800&fit=crop'
  ),
  (
    'daily-fortify-shampoo',
    'Daily Fortify Shampoo',
    'Өдөр тутмын цэвэрлэгээ, чийгшүүлэлт. Хуурай, гэмтсэн үсийг сэргээнэ.',
    72000,
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop'
  ),
  (
    'beard-conditioning-oil',
    'Beard Conditioning Oil',
    'Сахалын арьс болон үсийг зөөлрүүлж, цочролыг багасгана. Хөнгөн үнэртэй.',
    68000,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop'
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price_mnt = excluded.price_mnt,
  image_url = excluded.image_url,
  updated_at = now();
