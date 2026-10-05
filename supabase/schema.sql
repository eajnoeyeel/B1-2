-- 다음화(숏드라마 작품) 테이블. Supabase SQL Editor에서 그대로 실행하면 된다.
create table if not exists public.series (
  id            bigint generated always as identity primary key,
  -- 등록한 사용자. insert 때 로그인한 사용자 id가 자동으로 들어간다. (샘플 데이터는 null = 읽기 전용)
  user_id       uuid references auth.users(id) on delete cascade default auth.uid(),
  title         text not null check (char_length(title) between 1 and 40),
  creator       text not null check (char_length(creator) between 1 and 30),
  genre         text not null check (genre in ('romance', 'fantasy', 'regression', 'thriller', 'horror', 'mystery', 'action', 'scifi', 'comedy')),
  status        text not null default 'ongoing' check (status in ('ongoing', 'completed', 'hiatus')),
  release_day   text check (release_day in ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')),
  orientation   text not null default 'vertical' check (orientation in ('vertical', 'horizontal')),
  episode_count integer not null default 0 check (episode_count between 0 and 500),
  cover_url     text check (cover_url ~ '^https?://'),
  description   text not null check (char_length(description) between 1 and 600),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- 연재 중인 작품은 연재 요일이 있어야 한다 (프런트 검증과 같은 규칙)
  constraint ongoing_needs_day check (status <> 'ongoing' or release_day is not null)
);

-- 수정 시 updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists series_set_updated_at on public.series;
create trigger series_set_updated_at
  before update on public.series
  for each row execute function public.set_updated_at();

create index if not exists series_user_id_idx on public.series(user_id);

-- 권한: 조회는 누구나, 등록은 로그인한 사용자, 수정/삭제는 등록한 본인만
alter table public.series enable row level security;

drop policy if exists "series are readable by everyone" on public.series;
create policy "series are readable by everyone" on public.series
  for select to anon, authenticated using (true);

drop policy if exists "users insert own series" on public.series;
create policy "users insert own series" on public.series
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "owners update series" on public.series;
create policy "owners update series" on public.series
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "owners delete series" on public.series;
create policy "owners delete series" on public.series
  for delete to authenticated using ((select auth.uid()) = user_id);
