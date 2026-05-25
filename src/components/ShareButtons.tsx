"use client";

import { useState } from "react";
import { clsx } from "@/lib/clsx";

/**
 * 共有ボタン（LINE / X / URLコピー）。
 * 友だちや家族に、この大会・教室をかんたんに教えられる。
 * URLはクリック時に window.location から取るので、本番でも開発でも正しく動く。
 */
export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function currentUrl(): string {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }

  function shareLine() {
    const url = encodeURIComponent(currentUrl());
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, "_blank", "noopener,noreferrer");
  }

  function shareX() {
    const url = encodeURIComponent(currentUrl());
    const text = encodeURIComponent(`${title}｜将棋大会ナビ`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,noreferrer");
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない端末では何もしない（ボタンは押せたまま）
    }
  }

  const base =
    "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-black transition hover:-translate-y-0.5";

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-bold text-ink-soft">友だち・家族に教える</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={shareLine}
          className={clsx(base, "border-[#06C755] bg-[#06C755] text-white hover:brightness-95")}
          aria-label="LINEで送る"
        >
          <span aria-hidden>💬</span>LINEで送る
        </button>
        <button
          type="button"
          onClick={shareX}
          className={clsx(base, "border-ink bg-ink text-white hover:opacity-90")}
          aria-label="Xでシェアする"
        >
          <span aria-hidden>✕</span>Xでシェア
        </button>
        <button
          type="button"
          onClick={copyUrl}
          className={clsx(
            base,
            copied
              ? "border-soon bg-soon-soft text-soon"
              : "border-line bg-white text-ink hover:border-ink-soft",
          )}
          aria-label="URLをコピー"
        >
          <span aria-hidden>{copied ? "✓" : "🔗"}</span>
          {copied ? "コピーしました！" : "URLをコピー"}
        </button>
      </div>
    </div>
  );
}
