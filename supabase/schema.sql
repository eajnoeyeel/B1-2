-- 다음화(숏드라마 작품) 테이블. Supabase SQL Editor에서 그대로 실행하면 된다.
create table if not exists public.series (
  id            bigint generated always as identity primary key,
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

-- 로그인 없는 학습용 서비스라 anon 역할에 CRUD를 모두 허용한다.
-- (RLS를 끄는 대신 켜 두고 정책으로 명시 — 인증을 붙이면 이 정책만 바꾸면 된다.)
alter table public.series enable row level security;

drop policy if exists "series are public" on public.series;
create policy "series are public" on public.series
  for all to anon, authenticated
  using (true) with check (true);
