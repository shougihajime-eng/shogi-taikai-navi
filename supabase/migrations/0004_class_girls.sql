-- =====================================================================
-- 教室にも「女子向け（女子が安心して通える）」の列を追加
-- =====================================================================

alter table shogi_taikai_navi.classes
  add column if not exists for_girls boolean not null default false;
