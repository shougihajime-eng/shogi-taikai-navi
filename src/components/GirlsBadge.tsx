import { clsx } from "@/lib/clsx";

/** 女子限定 / 女子の部あり をあらわすピンクのバッジ */
export function GirlsBadge({
  girlsOnly,
  hasGirlsDivision,
  size = "md",
}: {
  girlsOnly?: boolean;
  hasGirlsDivision?: boolean;
  size?: "sm" | "md";
}) {
  if (!girlsOnly && !hasGirlsDivision) return null;
  const label = girlsOnly ? "女子大会" : "女子の部あり";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-girls-soft font-bold text-girls",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      <span aria-hidden>👧</span>
      {label}
    </span>
  );
}
