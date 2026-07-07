-- Ensure appointments timestamps always have defaults
alter table public.appointments
  alter column created_at set default now(),
  alter column updated_at set default now();

update public.appointments
set
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where created_at is null or updated_at is null;
