import { AGE_LABEL, type AgeGroup } from "@/lib/types";
import { clsx } from "@/lib/clsx";

const STYLE: Record<AgeGroup, string> = {
  elementary: "bg-elem-soft text-elem",
  junior: "bg-jhs-soft text-jhs",
  high: "bg-hs-soft text-hs",
};

/** 小学生／中学生／高校生 の色つきバッジ */
export function AgeBadge({ group, size = "md" }: { group: AgeGroup; size?: "sm" | "md" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-bold",
        STYLE[group],
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      {AGE_LABEL[group]}
    </span>
  );
}

/** バッジを横に並べる */
export function AgeBadges({ groups, size = "md" }: { groups: AgeGroup[]; size?: "sm" | "md" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {groups.map((g) => (
        <AgeBadge key={g} group={g} size={size} />
      ))}
    </div>
  );
}
