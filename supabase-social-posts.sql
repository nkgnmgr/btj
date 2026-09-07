-- 公開SNSリンク投稿機能の追加
-- Supabase Dashboard → SQL Editor に貼り付けて Run を押してください。

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  caption text not null default '' check (char_length(caption) <= 500),
  added_at timestamptz not null default now(),
  constraint social_posts_https check (url ~ '^https://'),
  constraint social_posts_supported_host check (
    url ~ '^https://(www\.|m\.|mobile\.)?(x\.com|twitter\.com|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch|threads\.net|threads\.com|bsky\.app)/'
  )
);

alter table public.social_posts enable row level security;

drop policy if exists "public read social posts" on public.social_posts;
create policy "public read social posts"
  on public.social_posts for select
  using (true);

drop policy if exists "public add social posts" on public.social_posts;
create policy "public add social posts"
  on public.social_posts for insert
  to anon, authenticated
  with check (
    char_length(url) <= 2048
    and char_length(caption) <= 500
  );

drop policy if exists "admin delete social posts" on public.social_posts;
create policy "admin delete social posts"
  on public.social_posts for delete
  to authenticated using (public.is_admin());