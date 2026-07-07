-- Bootstrap admin users by Mongolia mobile (8 digits)
update public.profiles
set
  role = 'admin',
  updated_at = now()
where phone in ('99918122', '88668612')
   or phone in ('+97699918122', '+97688668612')
   or right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 8) in ('99918122', '88668612');

-- Match auth.users created via phone email if profile.phone is empty
update public.profiles p
set
  role = 'admin',
  updated_at = now()
from auth.users u
where p.id = u.id
  and p.role <> 'admin'
  and (
    split_part(u.email, '@', 1) in ('99918122', '88668612')
    or coalesce(u.raw_user_meta_data->>'phone', '') in ('99918122', '88668612')
  );
