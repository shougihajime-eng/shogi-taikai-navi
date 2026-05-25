"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { REGIONS } from "@/lib/prefectures";
import { AGE_LABEL, type AgeGroup } from "@/lib/types";
import { clsx } from "@/lib/clsx";

const AGE_OPTIONS: AgeGroup[] = ["elementary", "junior", "high"];

// 学年ごとの絵文字と、えらんだときの色
const AGE_EMOJI: Record<AgeGroup, string> = {
  elementary: "🎒",
  junior: "📘",
  high: "🎓",
};
const AGE_ACTIVE: Record<AgeGroup, string> = {
  elementary: "border-elem bg-elem text-white",
  junior: "border-jhs bg-jhs text-white",
  high: "border-hs bg-hs text-white",
};

/** 都道府県と学年で絞り込むメニュー（選ぶとURLが変わって一覧が更新される） */
export function FilterBar({
  accent = "brand",
  showGirls = false,
  girlsLabel = "女子の部・女子大会だけ",
}: {
  accent?: "brand" | "sky";
  showGirls?: boolean;
  girlsLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const pref = params.get("pref") ?? "";
  const age = (params.get("age") ?? "") as AgeGroup | "";
  const girls = params.get("girls") === "1";
  const hasAny = Boolean(pref || age || girls);

  function update(key: "pref" | "age" | "girls", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeAll =
    accent === "brand" ? "border-brand bg-brand text-white" : "border-sky bg-sky text-white";

  return (
    <div className="rounded-[var(--radius-card)] border-2 border-line bg-card p-4 shadow-sm sm:p-6">
      {/* かんたんな使い方の説明 */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-brand-soft/60 px-4 py-2.5">
        <span className="text-xl" aria-hidden>🔎</span>
        <p className="text-sm font-bold text-ink">
          下の<span className="text-brand-dark">①②③</span>をえらぶだけ。
          えらんだ分だけ自動でしぼりこまれるよ。
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* ① 学年で選ぶ */}
        <div>
          <p className="mb-2 flex items-center gap-2 text-base font-black text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-black text-white">
              1
            </span>
            学年でえらぶ
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update("age", "")}
              aria-pressed={age === ""}
              className={clsx(
                "rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5",
                age === "" ? activeAll : "border-line bg-white text-ink hover:border-ink-soft",
              )}
            >
              ぜんぶ
            </button>
            {AGE_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update("age", g)}
                aria-pressed={age === g}
                className={clsx(
                  "rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5",
                  age === g ? AGE_ACTIVE[g] : "border-line bg-white text-ink hover:border-ink-soft",
                )}
              >
                <span className="mr-1" aria-hidden>{AGE_EMOJI[g]}</span>
                {AGE_LABEL[g]}
              </button>
            ))}
          </div>
        </div>

        {/* ② 女子でしぼる（大会・教室ページだけ） */}
        {showGirls && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-base font-black text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-black text-white">
                2
              </span>
              女子でさがす（えらばなくてもOK）
            </p>
            <button
              type="button"
              onClick={() => update("girls", girls ? "" : "1")}
              aria-pressed={girls}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5",
                girls
                  ? "border-girls bg-girls text-white"
                  : "border-girls/40 bg-girls-soft text-girls hover:border-girls",
              )}
            >
              <span aria-hidden>👧</span>
              {girlsLabel}
            </button>
          </div>
        )}

        {/* ③ 都道府県で選ぶ */}
        <div>
          <label
            htmlFor="pref"
            className="mb-2 flex items-center gap-2 text-base font-black text-ink"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-black text-white">
              {showGirls ? 3 : 2}
            </span>
            地域（都道府県）でえらぶ
          </label>
          <select
            id="pref"
            value={pref}
            onChange={(e) => update("pref", e.target.value)}
            className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3.5 text-base font-bold text-ink focus:border-sky"
          >
            <option value="">📍 全国（ぜんぶ）</option>
            {REGIONS.map((r) => (
              <optgroup key={r.name} label={r.name}>
                {r.prefectures.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* いま選んでいる条件＋リセット */}
        {hasAny && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-paper/60 px-4 py-3">
            <span className="text-sm font-black text-ink">いまの条件：</span>
            {age && (
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink shadow-sm">
                {AGE_EMOJI[age as AgeGroup]} {AGE_LABEL[age as AgeGroup]}
              </span>
            )}
            {girls && (
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-girls shadow-sm">
                👧 女子
              </span>
            )}
            {pref && (
              <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-ink shadow-sm">
                📍 {pref}
              </span>
            )}
            <button
              type="button"
              onClick={() => router.push(pathname, { scroll: false })}
              className="ml-auto rounded-full bg-ink px-4 py-1.5 text-sm font-black text-white transition hover:opacity-80"
            >
              ✕ ぜんぶ消す
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
