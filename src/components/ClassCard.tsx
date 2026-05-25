import Link from "next/link";
import type { ShogiClass } from "@/lib/types";
import { AgeBadges } from "./AgeBadge";

export function ClassCard({ c }: { c: ShogiClass }) {
  return (
    <Link
      href={`/kyoshitsu/${c.id}`}
      className="group flex flex-col gap-3 rounded-[var(--radius-card)] border-2 border-line bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky hover:shadow-lg"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-soft px-2.5 py-0.5 text-xs font-bold text-sky-dark">
          将棋教室
        </span>
        {c.forGirls && (
          <span className="inline-flex items-center gap-1 rounded-full bg-girls-soft px-2.5 py-0.5 text-xs font-bold text-girls">
            <span aria-hidden>👧</span>女子も安心
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink group-hover:text-sky-dark">
        {c.name}
      </h3>

      <dl className="space-y-1 text-sm text-ink-soft">
        <div className="flex items-start gap-2">
          <span aria-hidden>📍</span>
          <span>
            {c.prefecture}
            {c.city ? ` ${c.city}` : ""}
          </span>
        </div>
        {c.schedule && (
          <div className="flex items-start gap-2">
            <span aria-hidden>🕒</span>
            <span>{c.schedule}</span>
          </div>
        )}
        {c.target && (
          <div className="flex items-start gap-2">
            <span aria-hidden>🧒</span>
            <span>{c.target}</span>
          </div>
        )}
      </dl>

      <AgeBadges groups={c.ageGroups} size="sm" />

      <span className="mt-1 text-sm font-bold text-sky-dark opacity-0 transition group-hover:opacity-100">
        くわしく見る →
      </span>
    </Link>
  );
}
