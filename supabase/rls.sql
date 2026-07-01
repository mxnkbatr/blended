-- Row Level Security for Supabase client (publishable key)
-- Run after `npm run db:push` if tables were created via Prisma

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
  using (in_stock = true);

drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert"
  on public.appointments for insert
  with check (true);

drop policy if exists "appointments_public_read" on public.appointments;
create policy "appointments_public_read"
  on public.appointments for select
  using (true);

-- appointments.id default for Supabase inserts
alter table public.appointments
  alter column id set default gen_random_uuid();
