-- =====================================================================
-- 女子の部・女子大会で検索できるようにする列を追加
-- =====================================================================

alter table shogi_taikai_navi.tournaments
  add column if not exists girls_only          boolean not null default false,  -- 女子限定の大会
  add column if not exists has_girls_division  boolean not null default false;  -- 男女OKだが女子の部あり
