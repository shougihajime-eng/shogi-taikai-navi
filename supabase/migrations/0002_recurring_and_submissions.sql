-- =====================================================================
-- 本気版アップデート
--  1) 毎年開催（recurring）と全国規模に対応する列を追加
--  2) みんなの申請（submissions）テーブルを追加
--  3) 旧ダミーデータのお片付け
-- =====================================================================

-- --- 1) tournaments / classes に列を追加 ---
alter table shogi_taikai_navi.tournaments
  alter column event_date drop not null;

alter table shogi_taikai_navi.tournaments
  add column if not exists is_recurring   boolean not null default false,
  add column if not exists recurrence_note text,
  add column if not exists nationwide     boolean not null default false,
  add column if not exists source_kind    text    not null default 'system'; -- system | submission

alter table shogi_taikai_navi.classes
  add column if not exists source_kind    text    not null default 'system';

-- --- 2) 申請（submissions）テーブル ---
create table if not exists shogi_taikai_navi.submissions (
  id                uuid primary key default gen_random_uuid(),
  kind              text not null,                       -- 'tournament' | 'class'
  status            text not null default 'pending',     -- pending | approved | rejected
  payload           jsonb not null default '{}'::jsonb,
  submitter_name    text,
  submitter_contact text,
  created_at        timestamptz not null default now(),
  reviewed_at       timestamptz
);
create index if not exists submissions_status_idx
  on shogi_taikai_navi.submissions (status);

-- 申請は公開で読み書きさせない。書き込みも読み取りも APIサーバ（service_role）経由のみ。
alter table shogi_taikai_navi.submissions enable row level security;
-- anon / authenticated 用のポリシーは作らない（＝RLSで全拒否）。
grant all on shogi_taikai_navi.submissions to service_role;

-- --- 3) 旧ダミーデータのお片付け（一回きり） ---
delete from shogi_taikai_navi.tournaments where id like 't-%';
delete from shogi_taikai_navi.classes     where id like 'c-%';
