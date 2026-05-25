import Link from "next/link";
import type { Tournament } from "@/lib/types";
import { ORGANIZER_LABEL } from "@/lib/types";
import { formatJPDate } from "@/lib/date";
import { AgeBadges } from "./AgeBadge";
import { StatusBadge } from "./StatusBadge";
import { GirlsBadge } from "./GirlsBadge";
import { clsx } from "@/lib/clsx";

export function TournamentCard({ t }: { t: Tournament }) {
  const accent = t.girlsOnly ? "before:bg-girls" : "before:bg-brand";
  return (
    <Link
      href={`/taikai/${t.id}`}
      className={clsx(
        "group relative flex flex-col gap-3 overflow-hidden rounded-[var(--radius-card)] border-2 border-line bg-card p-5 pt-6",
        "shadow-sm transition hover:-translate-y-1.5 hover:border-brand hover:shadow-lg",
        // 上ふちに色のアクセント帯
        "before:absolute before:inset-x-0 before:top-0 before:h-2 before:content-['']",
        accent,
        t.status === "finished" && "opacity-70",
      )}
    >
      {/* 上の段：状態と主催 */}
      <div className="flex items-center justify-between gap-2">
        <StatusBadge
          eventDate={t.eventDate}
          endDate={t.endDate}
          isRecurring={t.isRecurring}
          status={t.status}
        />
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-dark">
          {ORGANIZER_LABEL[t.organizerType]}
        </span>
      </div>

      {/* タイトル */}
      <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-brand-dark">
        {t.title}
      </h3>

      {/* 日付・場所 */}
      <dl className="space-y-1 text-sm text-ink-soft">
        <div className="flex items-start gap-2">
          <span aria-hidden>📅</span>
          <span className="font-semibold text-ink">
            {t.status === "recurring"
              ? (t.recurrenceNote ?? (t.isRecurring ? "毎年開催" : "日程は未定"))
              : formatJPDate(t.eventDate)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span aria-hidden>📍</span>
          <span>
            {t.prefecture}
            {t.city ? ` ${t.city}` : ""}
            {t.venue ? `・${t.venue}` : ""}
          </span>
        </div>
      </dl>

      {/* 学年バッジ＋女子バッジ */}
      <div className="flex flex-wrap items-center gap-1.5">
        <AgeBadges groups={t.ageGroups} size="sm" />
        <GirlsBadge girlsOnly={t.girlsOnly} hasGirlsDivision={t.hasGirlsDivision} size="sm" />
      </div>

      <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-brand-dark">
        くわしく見る
        <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </span>
    </Link>
  );
}
