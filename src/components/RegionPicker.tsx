"use client";

import { useState } from "react";
import Link from "next/link";
import { REGIONS } from "@/lib/prefectures";
import { clsx } from "@/lib/clsx";

// 地方ごとの絵文字（楽しい雰囲気に）
const REGION_EMOJI: Record<string, string> = {
  "北海道・東北": "🗻",
  関東: "🗼",
  中部: "🏔️",
  近畿: "🏯",
  "中国・四国": "⛩️",
  "九州・沖縄": "🌺",
};

/**
 * 地方タブ → 都道府県ボタンで、全国どこでもさがせるナビ。
 * 地方をえらぶと、その地方の都道府県ボタンが出る。
 */
export function RegionPicker() {
  const [open, setOpen] = useState(0);
  const region = REGIONS[open];

  return (
    <div className="rounded-[var(--radius-card)] border-2 border-line bg-card p-4 shadow-sm sm:p-6">
      {/* 地方タブ */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((r, i) => (
          <button
            key={r.name}
            type="button"
            onClick={() => setOpen(i)}
            aria-pressed={i === open}
            className={clsx(
              "rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition hover:-translate-y-0.5",
              i === open
                ? "border-brand bg-brand text-white shadow"
                : "border-line bg-white text-ink hover:border-ink-soft",
            )}
          >
            <span className="mr-1" aria-hidden>{REGION_EMOJI[r.name] ?? "📍"}</span>
            {r.name}
          </button>
        ))}
      </div>

      {/* えらんだ地方の都道府県 */}
      <div className="mt-4 rounded-2xl bg-paper/60 p-3 sm:p-4">
        <p className="mb-2 text-sm font-bold text-ink-soft">
          {REGION_EMOJI[region.name]} {region.name}の都道府県をえらぶ
        </p>
        <div className="flex flex-wrap gap-2">
          {region.prefectures.map((p) => (
            <Link
              key={p}
              href={`/taikai?pref=${encodeURIComponent(p)}`}
              className="rounded-full border-2 border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-brand hover:text-brand-dark"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/taikai"
          className="rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark transition hover:brightness-95"
        >
          🏆 全国の大会を見る
        </Link>
        <Link
          href="/kyoshitsu"
          className="rounded-full bg-sky-soft px-4 py-2 text-sm font-bold text-sky-dark transition hover:brightness-95"
        >
          🎓 全国の教室を見る
        </Link>
      </div>
    </div>
  );
}
