import { countdownLabel } from "@/lib/date";
import { clsx } from "@/lib/clsx";
import type { EventStatus } from "@/lib/types";

/** 「あと3日」「開催中！」「毎年開催」「終了」などのバッジ */
export function StatusBadge({
  eventDate,
  endDate,
  isRecurring,
  status,
}: {
  eventDate?: string;
  endDate?: string;
  isRecurring?: boolean;
  status: EventStatus;
}) {
  const label = countdownLabel(eventDate, endDate, isRecurring);
  const style =
    status === "finished"
      ? "bg-[var(--color-line)] text-done"
      : status === "ongoing"
        ? "bg-soon text-white animate-pulse"
        : status === "recurring"
          ? "bg-[var(--color-koma)]/25 text-brand-dark"
          : "bg-soon-soft text-soon";

  const icon =
    status === "upcoming" ? "⏳" : status === "ongoing" ? "🔥" : status === "recurring" ? "🔁" : null;

  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold", style)}>
      {icon && <span aria-hidden>{icon}</span>}
      {label}
    </span>
  );
}
