"use client";

import { useState } from "react";

/**
 * 「情報がちがう・古い」を知らせる小さな報告フォーム。
 * ふだんは小さなリンク。押すと入力欄が開く。
 * 送信内容は確認用に保存されるだけで、サイトには自動公開されない（誤って公開されない安全設計）。
 */
export function ReportLink({
  targetType,
  targetId,
  targetTitle,
}: {
  targetType: "tournament" | "class";
  targetId: string;
  targetTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // ロボット対策
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    if (!message.trim()) {
      setError("どこがちがうか、ひとことだけでも書いてください。");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, targetTitle, message, contact, website }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setError(data.error ?? "うまく送れませんでした。時間をおいてためしてください。");
    } catch {
      setError("通信に失敗しました。電波のよい所でもう一度ためしてください。");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <p className="mt-3 text-center text-xs font-bold text-soon">
        ✓ 知らせてくれてありがとう！確認します。
      </p>
    );
  }

  if (!open) {
    return (
      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs font-bold text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          🛠 情報がちがう・古いときは知らせてね
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border-2 border-line bg-white px-3 py-2 text-sm text-ink focus:border-sky focus:outline-none";

  return (
    <div className="mt-4 rounded-2xl border-2 border-dashed border-line bg-paper/60 p-4">
      <p className="text-sm font-bold text-ink">🛠 まちがい・古い情報を知らせる</p>
      <p className="mt-1 text-xs text-ink-soft">
        「{targetTitle}」について、気づいたことを教えてください。
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="例：この大会は今年から開催日が変わったみたいです / 公式ページのリンクがちがいます"
        className={`${inputCls} mt-3 min-h-[80px] resize-y`}
      />
      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="連絡先（任意・確認が必要なとき用）"
        className={`${inputCls} mt-2`}
      />

      {/* ロボット対策（人には見えない） */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && <p className="mt-2 text-xs font-bold text-brand-dark">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={sending}
          className="rounded-full bg-brand px-5 py-2 text-sm font-black text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {sending ? "送信中…" : "送る"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border-2 border-line bg-white px-5 py-2 text-sm font-black text-ink hover:border-ink-soft"
        >
          やめる
        </button>
      </div>
    </div>
  );
}
