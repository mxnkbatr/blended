-- Per-barber appointment booking fee (₮)
alter table public.barbers
  add column if not exists booking_price_mnt integer not null default 50000
    check (booking_price_mnt >= 0);

update public.barbers
set booking_price_mnt = 50000
where booking_price_mnt is null;
