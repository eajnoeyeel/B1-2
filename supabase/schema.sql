-- 책갈피(독서 기록) 테이블. Supabase SQL Editor에서 그대로 실행하면 된다.
create table if not exists public.books (
  id         bigint generated always as identity primary key,
  title      text not null check (char_length(title) between 1 and 100),
  author     text not null check (char_length(author) between 1 and 50),
  status     text not null default 'reading' check (status in ('reading', 'done', 'wish')),
  rating     smallint not null default 3 check (rating between 1 and 5),
  review     text not null check (char_length(review) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 수정 시 updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists books_set_updated_at on public.books;
create trigger books_set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();

-- 로그인 없는 학습용 서비스라 anon 역할에 CRUD를 모두 허용한다.
-- (RLS를 끄는 대신 켜 두고 정책으로 명시 — 인증을 붙이면 이 정책만 바꾸면 된다.)
alter table public.books enable row level security;

drop policy if exists "books are public" on public.books;
create policy "books are public" on public.books
  for all to anon, authenticated
  using (true) with check (true);
