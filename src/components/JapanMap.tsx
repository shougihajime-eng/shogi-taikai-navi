import Link from "next/link";
import { PREF_SLUG, regionOf, shortPref } from "@/lib/prefectures";
import { clsx } from "@/lib/clsx";

/**
 * 日本の形をしたタイル地図。県をタップすると、その県のページ（/chiiki/◯◯）へ。
 * 地方ごとに色分け。地理に厳密ではなく、子どもにも分かりやすい「かんたん日本地図」。
 */

// 12列のタイル配置（"."は空き）。北海道が右上、沖縄が左下。
const GRID: (string | null)[][] = [
  [null, null, null, null, null, null, null, null, null, null, null, "北海道"],
  [null, null, null, null, null, null, null, null, null, null, "青森県", null],
  [null, null, null, null, null, null, null, null, null, "秋田県", "岩手県", null],
  [null, null, null, null, null, null, null, null, null, "山形県", "宮城県", null],
  [null, null, null, null, null, null, null, null, "新潟県", null, "福島県", null],
  [null, null, null, null, null, null, "石川県", "富山県", "長野県", "群馬県", "栃木県", "茨城県"],
  [null, null, "鳥取県", null, "京都府", "滋賀県", "福井県", "岐阜県", "山梨県", "埼玉県", "東京都", "千葉県"],
  [null, "島根県", "岡山県", "兵庫県", "大阪府", "奈良県", "三重県", "愛知県", "静岡県", "神奈川県", null, null],
  ["山口県", "広島県", null, "香川県", "徳島県", "和歌山県", null, null, null, null, null, null],
  ["福岡県", null, null, "愛媛県", "高知県", null, null, null, null, null, null, null],
  ["佐賀県", "大分県", null, null, null, null, null, null, null, null, null, null],
  ["長崎県", "熊本県", null, null, null, null, null, null, null, null, null, null],
  [null, "宮崎県", null, null, null, null, null, null, null, null, null, null],
  ["鹿児島県", null, null, null, null, null, null, null, null, null, null, null],
  ["沖縄県", null, null, null, null, null, null, null, null, null, null, null],
];

const REGION_TILE: Record<string, string> = {
  "北海道・東北": "bg-brand-soft text-brand-dark hover:bg-brand hover:text-white",
  関東: "bg-sky-soft text-sky-dark hover:bg-sky hover:text-white",
  中部: "bg-soon-soft text-soon hover:bg-soon hover:text-white",
  近畿: "bg-hs-soft text-hs hover:bg-hs hover:text-white",
  "中国・四国": "bg-lemon/30 text-ink hover:bg-lemon hover:text-ink",
  "九州・沖縄": "bg-girls-soft text-girls hover:bg-girls hover:text-white",
};

const REGION_LEGEND: { name: string; dot: string }[] = [
  { name: "北海道・東北", dot: "bg-brand" },
  { name: "関東", dot: "bg-sky" },
  { name: "中部", dot: "bg-soon" },
  { name: "近畿", dot: "bg-hs" },
  { name: "中国・四国", dot: "bg-lemon" },
  { name: "九州・沖縄", dot: "bg-girls" },
];

export function JapanMap() {
  return (
    <div>
      <div className="mx-auto grid max-w-2xl grid-cols-12 gap-0.5 sm:gap-1">
        {GRID.flatMap((row, r) =>
          row.map((pref, c) => {
            if (!pref) return <div key={`${r}-${c}`} className="aspect-square" aria-hidden />;
            const region = regionOf(pref) ?? "";
            return (
              <Link
                key={`${r}-${c}`}
                href={`/chiiki/${PREF_SLUG[pref]}`}
                title={pref}
                className={clsx(
                  "flex aspect-square items-center justify-center rounded-md p-0.5 text-center font-bold leading-none transition",
                  "text-[8px] sm:text-[11px]",
                  REGION_TILE[region] ?? "bg-line text-ink",
                )}
              >
                {shortPref(pref)}
              </Link>
            );
          }),
        )}
      </div>

      {/* 地方の色の説明 */}
      <div className="mx-auto mt-3 flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-1">
        {REGION_LEGEND.map((l) => (
          <span key={l.name} className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-soft">
            <span className={clsx("h-2.5 w-2.5 rounded-full", l.dot)} aria-hidden />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}
