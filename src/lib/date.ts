import type { EventStatus } from "./types";

/** 日本時間（JST）での「今日」を YYYY-MM-DD で返す */
export function todayJST(): string {
  const now = new Date();
  // 日本時間にそろえる
  const jst = new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60_000);
  return jst.toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" を数値の日数に（比べやすくする） */
function toNum(dateStr: string): number {
  return Number(dateStr.replaceAll("-", ""));
}

/** 開催ぐあい（毎年開催／これから／開催中／終了）を計算する */
export function computeStatus(
  eventDate?: string,
  endDate?: string,
  isRecurring?: boolean,
): EventStatus {
  // 具体的な日付がない（毎年開催など）→ いつでも表示する「毎年開催」あつかい
  if (!eventDate) return "recurring";
  const today = toNum(todayJST());
  const start = toNum(eventDate);
  const end = toNum(endDate ?? eventDate);
  if (end < today) return isRecurring ? "recurring" : "finished";
  if (start <= today && today <= end) return "ongoing";
  return "upcoming";
}

/** 今日から開催日まであと何日か（過去ならマイナス） */
export function daysUntil(dateStr: string): number {
  const today = new Date(todayJST() + "T00:00:00Z").getTime();
  const target = new Date(dateStr + "T00:00:00Z").getTime();
  return Math.round((target - today) / 86_400_000);
}

/** 30日以内なら「もうすぐ」 */
export function isSoon(eventDate: string): boolean {
  const d = daysUntil(eventDate);
  return d >= 0 && d <= 30;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** "2026-08-09" → "2026年8月9日（日）" のように読みやすく */
export function formatJPDate(dateStr?: string): string {
  if (!dateStr) return "日程は未定";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${y}年${m}月${d}日（${wd}）`;
}

/** あと何日かを「あと3日」「今日」などの言葉に */
export function countdownLabel(eventDate?: string, endDate?: string, isRecurring?: boolean): string {
  const status = computeStatus(eventDate, endDate, isRecurring);
  if (status === "recurring") return isRecurring ? "毎年開催" : "日程は未定";
  if (status === "finished") return "終了しました";
  if (status === "ongoing") return "開催中！";
  const d = daysUntil(eventDate!);
  if (d === 0) return "今日です！";
  if (d === 1) return "あした！";
  return `あと${d}日`;
}
