// データの「かたち」をここで決める（大会・教室・収集元）

/** 学年のグループ */
export type AgeGroup = "elementary" | "junior" | "high";

export const AGE_LABEL: Record<AgeGroup, string> = {
  elementary: "小学生",
  junior: "中学生",
  high: "高校生",
};

/** 主催の種類 */
export type OrganizerType = "jsa" | "municipal" | "private" | "other";

export const ORGANIZER_LABEL: Record<OrganizerType, string> = {
  jsa: "日本将棋連盟",
  municipal: "自治体・公共",
  private: "民間・道場",
  other: "その他",
};

/** 大会の開催ぐあい */
export type EventStatus = "upcoming" | "ongoing" | "finished";

/** 将棋大会 */
export interface Tournament {
  id: string;
  title: string;
  organizer: string;
  organizerType: OrganizerType;
  prefecture: string;
  city?: string;
  venue?: string;
  /** 開催日（YYYY-MM-DD） */
  eventDate: string;
  /** 何日かにわたる場合の最終日 */
  endDate?: string;
  /** 申し込みのしめ切り */
  entryDeadline?: string;
  ageGroups: AgeGroup[];
  /** 学年の細かい対象（例：小1〜小3） */
  gradeDetail?: string;
  fee?: string;
  capacity?: string;
  officialUrl?: string;
  description?: string;
  /** どこから集めた情報か */
  sourceName: string;
  sourceUrl?: string;
  status: EventStatus;
}

/** 将棋教室 */
export interface ShogiClass {
  id: string;
  name: string;
  prefecture: string;
  city?: string;
  address?: string;
  /** いつやっているか（例：毎週土曜 10:00-12:00） */
  schedule?: string;
  /** 対象（例：年長〜中学生） */
  target?: string;
  ageGroups: AgeGroup[];
  fee?: string;
  contact?: string;
  officialUrl?: string;
  description?: string;
  sourceName: string;
  sourceUrl?: string;
}

/** 自動収集の取得元 */
export interface SourceConfig {
  id: string;
  name: string;
  url: string;
  type: "tournament" | "class";
  enabled: boolean;
  lastFetchedAt?: string;
  note?: string;
}
