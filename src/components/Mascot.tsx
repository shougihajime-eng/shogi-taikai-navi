import { clsx } from "@/lib/clsx";

/**
 * 将棋駒のかわいいマスコット「ぽんちゃん」。
 * 顔つきの「歩」の駒。子どもが親しみやすいように。
 */
export function Mascot({
  className,
  label = "歩",
  bob = false,
}: {
  className?: string;
  label?: string;
  bob?: boolean;
}) {
  return (
    <span className={clsx("inline-block", bob && "animate-bob", className)} aria-hidden="true">
      <svg viewBox="0 0 100 112" className="h-full w-full">
        {/* 体（こま） */}
        <polygon
          points="50,5 86,32 78,106 22,106 14,32"
          fill="var(--color-koma)"
          stroke="var(--color-brand-dark)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* ほっぺ */}
        <circle cx="31" cy="74" r="6" fill="#e3589b" opacity="0.55" />
        <circle cx="69" cy="74" r="6" fill="#e3589b" opacity="0.55" />
        {/* 目 */}
        <ellipse cx="39" cy="60" rx="5" ry="7" fill="#3a2a12" />
        <ellipse cx="61" cy="60" rx="5" ry="7" fill="#3a2a12" />
        {/* きらり */}
        <circle cx="41" cy="57.5" r="1.6" fill="#fff" />
        <circle cx="63" cy="57.5" r="1.6" fill="#fff" />
        {/* 口（にっこり） */}
        <path
          d="M42 76 Q50 84 58 76"
          fill="none"
          stroke="#3a2a12"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* 文字（頭の上に小さく） */}
        <text
          x="50"
          y="34"
          textAnchor="middle"
          fontSize="18"
          fontWeight="900"
          fill="#3a2a12"
          fontFamily="var(--font-display)"
        >
          {label}
        </text>
      </svg>
    </span>
  );
}
