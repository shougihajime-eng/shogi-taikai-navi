import type { getAdminClient } from "../supabase/admin";
import { SEED_TOURNAMENTS, SEED_CLASSES } from "../seed";
import { todayJST } from "../date";

/** 書き込み用 Supabase 接続の型（スキーマ付き） */
type AdminClient = NonNullable<ReturnType<typeof getAdminClient>>;

/**
 * 毎朝の自動更新の中身。
 *
 * 【正直な前提】
 *  日本将棋連盟のサイトなど、多くの公式ページは「ロボットによる自動取得」を
 *  止めています（アクセスすると 503 などで断られる）。これを無理に突破するのは
 *  規約違反なので行いません。
 *
 * そこで自動更新では、次の「確実にできること」を毎朝行います：
 *  1) 厳選した全国の有名なこども大会・教室の一覧（curated）を最新の状態に保つ（upsert）
 *  2) 終わって古くなった大会を自動でお片付け（cleanup）
 *  3) 将来、機械が読める形（RSS / iCal / 公開API）で情報を出している取得元を
 *     `sources` テーブルに足せば、ここから安全に取り込めるようにする（拡張ポイント）
 */

export interface RefreshResult {
  ok: boolean;
  upsertedTournaments: number;
  upsertedClasses: number;
  deletedOldTournaments: number;
  startedAt: string;
  note: string;
}

// 見本（curated）データを DB の行（snake_case）に変換
function tournamentRows() {
  return SEED_TOURNAMENTS.map((t) => ({
    id: t.id,
    title: t.title,
    organizer: t.organizer,
    organizer_type: t.organizerType,
    prefecture: t.prefecture,
    city: t.city ?? null,
    venue: t.venue ?? null,
    event_date: t.eventDate,
    end_date: t.endDate ?? null,
    entry_deadline: t.entryDeadline ?? null,
    age_groups: t.ageGroups,
    grade_detail: t.gradeDetail ?? null,
    fee: t.fee ?? null,
    capacity: t.capacity ?? null,
    official_url: t.officialUrl ?? null,
    description: t.description ?? null,
    source_name: t.sourceName,
    source_url: t.sourceUrl ?? null,
  }));
}

function classRows() {
  return SEED_CLASSES.map((c) => ({
    id: c.id,
    name: c.name,
    prefecture: c.prefecture,
    city: c.city ?? null,
    address: c.address ?? null,
    schedule: c.schedule ?? null,
    target: c.target ?? null,
    age_groups: c.ageGroups,
    fee: c.fee ?? null,
    contact: c.contact ?? null,
    official_url: c.officialUrl ?? null,
    description: c.description ?? null,
    source_name: c.sourceName,
    source_url: c.sourceUrl ?? null,
  }));
}

/** 何日より前の「終わった大会」を消すか */
const CLEANUP_AFTER_DAYS = 60;

export async function runDailyRefresh(admin: AdminClient): Promise<RefreshResult> {
  const startedAt = new Date().toISOString();

  // 1) 厳選データを upsert（あれば更新・なければ追加）
  const tRows = tournamentRows();
  const { error: tErr } = await admin
    .from("tournaments")
    .upsert(tRows, { onConflict: "id" });
  if (tErr) throw new Error(`大会の保存に失敗: ${tErr.message}`);

  const cRows = classRows();
  const { error: cErr } = await admin
    .from("classes")
    .upsert(cRows, { onConflict: "id" });
  if (cErr) throw new Error(`教室の保存に失敗: ${cErr.message}`);

  // 2) 古い大会のお片付け（開催日が CLEANUP_AFTER_DAYS 日より前）
  const cutoff = new Date(todayJST() + "T00:00:00Z");
  cutoff.setUTCDate(cutoff.getUTCDate() - CLEANUP_AFTER_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const { data: deleted, error: dErr } = await admin
    .from("tournaments")
    .delete()
    .lt("event_date", cutoffStr)
    .select("id");
  if (dErr) throw new Error(`お片付けに失敗: ${dErr.message}`);

  // 3) 取得元の最終実行時刻を記録（あれば）
  await admin
    .from("sources")
    .update({ last_fetched_at: startedAt })
    .eq("enabled", true);

  return {
    ok: true,
    upsertedTournaments: tRows.length,
    upsertedClasses: cRows.length,
    deletedOldTournaments: deleted?.length ?? 0,
    startedAt,
    note: "厳選データを最新化し、古い大会をお片付けしました。",
  };
}
