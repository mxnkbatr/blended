alter table public.barbers
  add column if not exists schedule jsonb not null default '{
    "0": {"off": true, "start": 10, "end": 22},
    "1": {"off": false, "start": 10, "end": 22},
    "2": {"off": false, "start": 10, "end": 22},
    "3": {"off": false, "start": 10, "end": 22},
    "4": {"off": false, "start": 10, "end": 22},
    "5": {"off": false, "start": 10, "end": 22},
    "6": {"off": false, "start": 10, "end": 22}
  }'::jsonb;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'barber-images',
  'barber-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "barber_images_public_read" on storage.objects;
create policy "barber_images_public_read"
  on storage.objects for select
  using (bucket_id = 'barber-images');

drop policy if exists "barber_images_admin_insert" on storage.objects;
create policy "barber_images_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'barber-images' and public.is_admin());

drop policy if exists "barber_images_admin_update" on storage.objects;
create policy "barber_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'barber-images' and public.is_admin());

drop policy if exists "barber_images_admin_delete" on storage.objects;
create policy "barber_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'barber-images' and public.is_admin());
