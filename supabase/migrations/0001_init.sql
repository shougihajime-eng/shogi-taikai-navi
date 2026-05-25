-- =====================================================================
-- 将棋大会ナビ — データの保管場所（スキーマ shogi_taikai_navi）
-- 共有 Supabase 上に専用スキーマを作り、他プロジェクトと混ざらないようにする。
-- =====================================================================

create schema if not exists shogi_taikai_navi;

-- ---------------------------------------------------------------------
-- 将棋大会
-- ---------------------------------------------------------------------
create table if not exists shogi_taikai_navi.tournaments (
  id              text primary key,
  title           text not null,
  organizer       text not null default '',
  organizer_type  text not null default 'other',   -- jsa / municipal / private / other
  prefecture      text not null default '',
  city            text,
  venue           text,
  event_date      date not null,
  end_date        date,
  entry_deadline  date,
  age_groups      text[] not null default '{}',     -- elementary / junior / high
  grade_detail    text,
  fee             text,
  capacity        text,
  official_url    text,
  description     text,
  source_name     text not null default '',
  source_url      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists tournaments_event_date_idx
  on shogi_taikai_navi.tournaments (event_date);
create index if not exists tournaments_prefecture_idx
  on shogi_taikai_navi.tournaments (prefecture);

-- ---------------------------------------------------------------------
-- 将棋教室
-- ---------------------------------------------------------------------
create table if not exists shogi_taikai_navi.classes (
  id            text primary key,
  name          text not null,
  prefecture    text not null default '',
  city          text,
  address       text,
  schedule      text,
  target        text,
  age_groups    text[] not null default '{}',
  fee           text,
  contact       text,
  official_url  text,
  description   text,
  source_name   text not null default '',
  source_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists classes_prefecture_idx
  on shogi_taikai_navi.classes (prefecture);

-- ---------------------------------------------------------------------
-- 自動収集の取得元（毎朝ここを見に行く）
-- ---------------------------------------------------------------------
create table if not exists shogi_taikai_navi.sources (
  id              text primary key,
  name            text not null,
  url             text not null,
  type            text not null default 'tournament',  -- tournament / class
  enabled         boolean not null default true,
  last_fetched_at timestamptz,
  note            text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- RLS（行ごとの権限）
--   ・だれでも「読む」のはOK（公開サイトなので）
--   ・「書く」のは service_role（毎朝の自動更新）だけ。anon には書き込みポリシーを作らない。
-- ---------------------------------------------------------------------
alter table shogi_taikai_navi.tournaments enable row level security;
alter table shogi_taikai_navi.classes     enable row level security;
alter table shogi_taikai_navi.sources     enable row level security;

drop policy if exists "public read tournaments" on shogi_taikai_navi.tournaments;
create policy "public read tournaments"
  on shogi_taikai_navi.tournaments for select
  to anon, authenticated
  using (true);

drop policy if exists "public read classes" on shogi_taikai_navi.classes;
create policy "public read classes"
  on shogi_taikai_navi.classes for select
  to anon, authenticated
  using (true);

-- sources は管理用なので公開しない（service_role だけが読み書き＝ポリシー無し）

-- ---------------------------------------------------------------------
-- ロールへの権限付与（カスタムスキーマでは明示的に必要）
--   anon / authenticated … 読み取り（RLS の範囲内）
--   service_role          … 読み書き（毎朝の自動更新が使う）
-- ---------------------------------------------------------------------
grant usage on schema shogi_taikai_navi to anon, authenticated, service_role;
grant select on all tables in schema shogi_taikai_navi to anon, authenticated;
grant all on all tables in schema shogi_taikai_navi to service_role;
grant all on all sequences in schema shogi_taikai_navi to service_role;
alter default privileges in schema shogi_taikai_navi grant select on tables to anon, authenticated;
alter default privileges in schema shogi_taikai_navi grant all on tables to service_role;

-- ---------------------------------------------------------------------
-- updated_at を自動更新するトリガー
-- ---------------------------------------------------------------------
create or replace function shogi_taikai_navi.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_tournaments on shogi_taikai_navi.tournaments;
create trigger trg_touch_tournaments
  before update on shogi_taikai_navi.tournaments
  for each row execute function shogi_taikai_navi.touch_updated_at();

drop trigger if exists trg_touch_classes on shogi_taikai_navi.classes;
create trigger trg_touch_classes
  before update on shogi_taikai_navi.classes
  for each row execute function shogi_taikai_navi.touch_updated_at();
