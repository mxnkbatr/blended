-- News / announcements for Achira app

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body text not null,
  cover_image_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_posts_published_idx
  on public.news_posts (published, published_at desc);

alter table public.news_posts enable row level security;

drop policy if exists "news_posts_public_read" on public.news_posts;
create policy "news_posts_public_read"
  on public.news_posts for select
  using (published = true);

drop policy if exists "news_posts_admin_all" on public.news_posts;
create policy "news_posts_admin_all"
  on public.news_posts for all
  using (public.is_admin())
  with check (public.is_admin());
