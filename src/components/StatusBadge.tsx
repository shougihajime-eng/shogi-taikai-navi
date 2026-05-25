import { countdownLabel } from "@/lib/date";
import { clsx } from "@/lib/clsx";
import type { EventStatus } from "@/lib/types";

/** 「あと3日」「開催中！」「終了」などのバッジ */
export function StatusBadge({
  eventDate,
  endDate,
  status,
}: {
  eventDate: string;
  endDate?: string;
  status: EventStatus;
}) {
  const label = countdownLabel(eventDate, endDate);
  const style =
    status === "finished"
      ? "bg-[var(--color-line)] text-done"
      : status === "ongoing"
        ? "bg-soon text-white animate-pulse"
        : "bg-soon-soft text-soon";

  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold", style)}>
      {status === "upcoming" && <span aria-hidden>⏳</span>}
      {status === "ongoing" && <span aria-hidden>🔥</span>}
      {label}
    </span>
  );
}
