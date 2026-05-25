import { getReadClient } from "./supabase/server";
import { SEED_TOURNAMENTS, SEED_CLASSES } from "./seed";
import { computeStatus } from "./date";
import type {
  Tournament,
  ShogiClass,
  AgeGroup,
  EventStatus,
  OrganizerType,
} from "./types";

/** 大会の絞り込み条件 */
export interface TournamentFilter {
  prefecture?: string;
  ageGroup?: AgeGroup;
  /** 女子向け（女子限定 or 女子の部あり）だけにしぼる */
  girlsOnly?: boolean;
  /** 終了したものも含めるか（既定は含めない） */
  includeFinished?: boolean;
}

/** 教室の絞り込み条件 */
export interface ClassFilter {
  prefecture?: string;
  ageGroup?: AgeGroup;
}

// ---- DB の行（snake_case）→ アプリの型（camelCase）に変換 ----

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapTournament(row: any): Tournament {
  const eventDate: string | undefined = row.event_date ?? undefined;
  const endDate: string | undefined = row.end_date ?? undefined;
  const isRecurring: boolean = row.is_recurring ?? false;
  return {
    id: String(row.id),
    title: row.title,
    organizer: row.organizer ?? "",
    organizerType: (row.organizer_type ?? "other") as OrganizerType,
    prefecture: row.prefecture ?? "",
    city: row.city ?? undefined,
    venue: row.venue ?? undefined,
    eventDate,
    endDate,
    entryDeadline: row.entry_deadline ?? undefined,
    ageGroups: (row.age_groups ?? []) as AgeGroup[],
    gradeDetail: row.grade_detail ?? undefined,
    fee: row.fee ?? undefined,
    capacity: row.capacity ?? undefined,
    officialUrl: row.official_url ?? undefined,
    description: row.description ?? undefined,
    isRecurring,
    recurrenceNote: row.recurrence_note ?? undefined,
    nationwide: row.nationwide ?? false,
    girlsOnly: row.girls_only ?? false,
    hasGirlsDivision: row.has_girls_division ?? false,
    sourceName: row.source_name ?? "",
    sourceUrl: row.source_url ?? undefined,
    status: computeStatus(eventDate, endDate, isRecurring),
  };
}

function mapClass(row: any): ShogiClass {
  return {
    id: String(row.id),
    name: row.name,
    prefecture: row.prefecture ?? "",
    city: row.city ?? undefined,
    address: row.address ?? undefined,
    schedule: row.schedule ?? undefined,
    target: row.target ?? undefined,
    ageGroups: (row.age_groups ?? []) as AgeGroup[],
    fee: row.fee ?? undefined,
    contact: row.contact ?? undefined,
    officialUrl: row.official_url ?? undefined,
    description: row.description ?? undefined,
    sourceName: row.source_name ?? "",
    sourceUrl: row.source_url ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---- 見本データに status を付ける ----
function seedTournaments(): Tournament[] {
  return SEED_TOURNAMENTS.map((t) => ({
    ...t,
    status: computeStatus(t.eventDate, t.endDate, t.isRecurring),
  }));
}

// 並び：開催中→日付が近いこれから→毎年開催→終了
function sortTournaments(list: Tournament[]): Tournament[] {
  const order: Record<EventStatus, number> = {
    ongoing: 0,
    upcoming: 1,
    recurring: 2,
    finished: 3,
  };
  return [...list].sort((a, b) => {
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    if (a.status === "finished") return (a.eventDate ?? "") < (b.eventDate ?? "") ? 1 : -1;
    if (a.status === "recurring") return a.title < b.title ? -1 : 1;
    return (a.eventDate ?? "") < (b.eventDate ?? "") ? -1 : 1;
  });
}

function applyTournamentFilter(list: Tournament[], f: TournamentFilter): Tournament[] {
  let out = list;
  if (!f.includeFinished) out = out.filter((t) => t.status !== "finished");
  // 全国規模の大会は、どの都道府県でしぼっても表示する
  if (f.prefecture) out = out.filter((t) => t.prefecture === f.prefecture || t.nationwide);
  if (f.ageGroup) out = out.filter((t) => t.ageGroups.includes(f.ageGroup!));
  // 女子向け（女子限定 or 女子の部あり）
  if (f.girlsOnly) out = out.filter((t) => t.girlsOnly || t.hasGirlsDivision);
  return sortTournaments(out);
}

function applyClassFilter(list: ShogiClass[], f: ClassFilter): ShogiClass[] {
  let out = list;
  if (f.prefecture) out = out.filter((c) => c.prefecture === f.prefecture);
  if (f.ageGroup) out = out.filter((c) => c.ageGroups.includes(f.ageGroup!));
  return out;
}

// =================== 公開する関数 ===================

export async function getTournaments(filter: TournamentFilter = {}): Promise<Tournament[]> {
  const db = getReadClient();
  if (db) {
    const { data, error } = await db.from("tournaments").select("*");
    if (!error && data) {
      return applyTournamentFilter(data.map(mapTournament), filter);
    }
    // DB で失敗したら見本データに切り替え（サイトは止めない）
  }
  return applyTournamentFilter(seedTournaments(), filter);
}

export async function getTournamentById(id: string): Promise<Tournament | null> {
  const db = getReadClient();
  if (db) {
    const { data, error } = await db.from("tournaments").select("*").eq("id", id).maybeSingle();
    if (!error && data) return mapTournament(data);
  }
  return seedTournaments().find((t) => t.id === id) ?? null;
}

export async function getClasses(filter: ClassFilter = {}): Promise<ShogiClass[]> {
  const db = getReadClient();
  if (db) {
    const { data, error } = await db.from("classes").select("*");
    if (!error && data) return applyClassFilter(data.map(mapClass), filter);
  }
  return applyClassFilter(SEED_CLASSES, filter);
}

export async function getClassById(id: string): Promise<ShogiClass | null> {
  const db = getReadClient();
  if (db) {
    const { data, error } = await db.from("classes").select("*").eq("id", id).maybeSingle();
    if (!error && data) return mapClass(data);
  }
  return SEED_CLASSES.find((c) => c.id === id) ?? null;
}

/** いま使えるデータが「見本」か「本物（DB）」かを知らせる */
export function isUsingLiveData(): boolean {
  return getReadClient() !== null;
}
