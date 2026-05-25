import { clsx } from "@/lib/clsx";

/** 将棋の駒（五角形）の形のアイコン。中に文字を入れられる。 */
export function KomaIcon({
  label = "歩",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-display font-black select-none",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 110" className="h-full w-full">
        <polygon
          points="50,4 84,30 76,104 24,104 16,30"
          fill="var(--color-koma)"
          stroke="var(--color-brand-dark)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <text
          x="50"
          y="74"
          textAnchor="middle"
          fontSize="46"
          fill="#3a2a12"
          fontFamily="var(--font-display)"
          fontWeight="900"
        >
          {label}
        </text>
      </svg>
    </span>
  );
}
