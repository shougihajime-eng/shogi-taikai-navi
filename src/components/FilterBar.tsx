"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { REGIONS } from "@/lib/prefectures";
import { AGE_LABEL, type AgeGroup } from "@/lib/types";
import { clsx } from "@/lib/clsx";

const AGE_OPTIONS: AgeGroup[] = ["elementary", "junior", "high"];

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
  const age = params.get("age") ?? "";
  const girls = params.get("girls") === "1";

  function update(key: "pref" | "age" | "girls", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const activeAge =
    accent === "brand" ? "bg-brand text-white border-brand" : "bg-sky text-white border-sky";

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border-2 border-line bg-card p-4 sm:p-5">
      {/* 学年で選ぶ */}
      <div>
        <p className="mb-2 text-sm font-bold text-ink-soft">学年でえらぶ</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update("age", "")}
            className={clsx(
              "rounded-full border-2 px-4 py-2 text-sm font-bold transition",
              age === "" ? activeAge : "border-line bg-white text-ink hover:border-ink-soft",
            )}
          >
            ぜんぶ
          </button>
          {AGE_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update("age", g)}
              className={clsx(
                "rounded-full border-2 px-4 py-2 text-sm font-bold transition",
                age === g ? activeAge : "border-line bg-white text-ink hover:border-ink-soft",
              )}
            >
              {AGE_LABEL[g]}
            </button>
          ))}
        </div>
      </div>

      {/* 女子でしぼる（大会ページだけ） */}
      {showGirls && (
        <div>
          <p className="mb-2 text-sm font-bold text-ink-soft">女子でさがす</p>
          <button
            type="button"
            onClick={() => update("girls", girls ? "" : "1")}
            className={clsx(
              "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition",
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

      {/* 都道府県で選ぶ */}
      <div>
        <label htmlFor="pref" className="mb-2 block text-sm font-bold text-ink-soft">
          地域（都道府県）でえらぶ
        </label>
        <select
          id="pref"
          value={pref}
          onChange={(e) => update("pref", e.target.value)}
          className="w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base font-semibold text-ink focus:border-sky"
        >
          <option value="">全国（ぜんぶ）</option>
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

      {(pref || age || girls) && (
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="self-start text-sm font-bold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          えらんだ条件をリセット
        </button>
      )}
    </div>
  );
}
