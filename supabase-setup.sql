-- Before Trip to Japan : Supabase setup
-- Supabase ダッシュボード → SQL Editor に貼り付けて「Run」を押してください。

-- 1. ページ保存用テーブル
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  flag text not null default '🌏',
  native_name text not null default '',
  sort integer not null default 100,
  published boolean not null default false,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. 更新日時を自動で記録
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- 3. 管理者リスト
--    サイトを編集できるのは、この表に登録されたユーザーだけです。
--    最後の「管理者の登録」セクションで自分を登録してください。
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_admins enable row level security;

-- 自分が管理者かどうかは本人だけ確認できる（編集は SQL Editor からのみ）
drop policy if exists "read own admin row" on public.site_admins;
create policy "read own admin row"
  on public.site_admins for select
  to authenticated using (user_id = auth.uid());

-- 管理者判定用の関数
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.site_admins where user_id = auth.uid()
  );
$$;

-- 4. トップページなどの文章保存用テーブル
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

drop policy if exists "public read site content" on public.site_content;
create policy "public read site content"
  on public.site_content for select
  using (true);

drop policy if exists "authenticated write site content" on public.site_content;
drop policy if exists "admin insert site content" on public.site_content;
create policy "admin insert site content"
  on public.site_content for insert
  to authenticated with check (public.is_admin());

drop policy if exists "authenticated update site content" on public.site_content;
drop policy if exists "admin update site content" on public.site_content;
create policy "admin update site content"
  on public.site_content for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. アクセス制御（RLS）
--    誰でも「公開済みページ」を読める / 書き込みは登録済み管理者のみ
alter table public.pages enable row level security;

drop policy if exists "public read published" on public.pages;
create policy "public read published"
  on public.pages for select
  using (published = true or public.is_admin());

drop policy if exists "authenticated insert" on public.pages;
drop policy if exists "admin insert" on public.pages;
create policy "admin insert"
  on public.pages for insert
  to authenticated with check (public.is_admin());

drop policy if exists "authenticated update" on public.pages;
drop policy if exists "admin update" on public.pages;
create policy "admin update"
  on public.pages for update
  to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "authenticated delete" on public.pages;
drop policy if exists "admin delete" on public.pages;
create policy "admin delete"
  on public.pages for delete
  to authenticated using (public.is_admin());

-- 6. 管理者の登録（★必ず実行してください★）
--    下の 'YOUR_EMAIL@example.com' を管理者アカウントのメールアドレスに
--    書き換えてから実行すると、そのユーザーが管理者になります。
-- insert into public.site_admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL@example.com'
--   on conflict (user_id) do nothing;
