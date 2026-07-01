import { config } from "dotenv";
import { prisma } from "../lib/prisma";

config({ path: ".env.local" });
config();

async function main() {
  await prisma.$executeRawUnsafe(`
    create table if not exists public.profiles (
      id uuid primary key references auth.users (id) on delete cascade,
      full_name text,
      phone text,
      role text not null default 'customer' check (role in ('customer', 'admin')),
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);

  await prisma.$executeRawUnsafe(`
    alter table public.profiles add column if not exists phone text;
  `);

  await prisma.$executeRawUnsafe(`
    create unique index if not exists profiles_phone_unique
    on public.profiles (phone)
    where phone is not null;
  `);

  await prisma.$executeRawUnsafe(`
    create or replace function public.is_admin()
    returns boolean
    language sql
    stable
    security definer
    set search_path = public
    as $$
      select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
      );
    $$;
  `);

  await prisma.$executeRawUnsafe(`
    create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer
    set search_path = public
    as $$
    begin
      insert into public.profiles (id, full_name, phone, role)
      values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'phone', ''),
        'customer'
      )
      on conflict (id) do update set
        full_name = excluded.full_name,
        phone = coalesce(excluded.phone, public.profiles.phone),
        updated_at = now();
      return new;
    end;
    $$;
  `);

  await prisma.$executeRawUnsafe(`
    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  `);

  await prisma.$executeRawUnsafe(`
    alter table public.profiles enable row level security;
  `);

  const profilePolicies = [
    `drop policy if exists "profiles_read_own" on public.profiles`,
    `create policy "profiles_read_own" on public.profiles for select using (auth.uid() = id)`,
    `drop policy if exists "profiles_insert_own" on public.profiles`,
    `create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id)`,
    `drop policy if exists "profiles_update_own" on public.profiles`,
    `create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id)`,
    `drop policy if exists "profiles_admin_all" on public.profiles`,
    `create policy "profiles_admin_all" on public.profiles for all using (public.is_admin()) with check (public.is_admin())`,
  ];

  const adminPolicies = [
    `drop policy if exists "barbers_admin_all" on public.barbers`,
    `create policy "barbers_admin_all" on public.barbers for all using (public.is_admin()) with check (public.is_admin())`,
    `drop policy if exists "products_admin_all" on public.products`,
    `create policy "products_admin_all" on public.products for all using (public.is_admin()) with check (public.is_admin())`,
    `drop policy if exists "appointments_admin_all" on public.appointments`,
    `create policy "appointments_admin_all" on public.appointments for all using (public.is_admin()) with check (public.is_admin())`,
    `drop policy if exists "shop_orders_admin_all" on public.shop_orders`,
    `create policy "shop_orders_admin_all" on public.shop_orders for all using (public.is_admin()) with check (public.is_admin())`,
    `drop policy if exists "shop_order_items_admin_all" on public.shop_order_items`,
    `create policy "shop_order_items_admin_all" on public.shop_order_items for all using (public.is_admin()) with check (public.is_admin())`,
  ];

  for (const sql of [...profilePolicies, ...adminPolicies]) {
    await prisma.$executeRawUnsafe(`${sql};`);
  }

  await prisma.$executeRawUnsafe(`
    insert into public.profiles (id, full_name, role)
    select
      u.id,
      coalesce(u.raw_user_meta_data->>'full_name', ''),
      'customer'
    from auth.users u
    where not exists (
      select 1 from public.profiles p where p.id = u.id
    );
  `);

  console.log("Profiles + admin RLS applied.");
  console.log(
    "First admin: Supabase → Authentication → Users → copy UUID, then run:",
  );
  console.log(
    "  update public.profiles set role = 'admin' where id = '<USER_UUID>';",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
