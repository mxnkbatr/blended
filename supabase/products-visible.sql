-- Keep products visible in shop even when out of stock
alter table public.products
  add column if not exists always_visible boolean not null default true;

update public.products
set always_visible = true
where always_visible is null;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  using (in_stock = true or always_visible = true);
