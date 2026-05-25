import Link from "next/link";

/** 「あなたの地域の大会・教室を教えて」と登録をうながすバナー */
export function SubmitCTA() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border-2 border-brand/30 bg-gradient-to-br from-brand-soft to-sky-soft p-6 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div className="text-5xl" aria-hidden>📣</div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-black text-ink sm:text-2xl">
            あなたの地域の大会・教室を教えてください
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            みんなで作る、全国の将棋マップ。知っている大会や教室を登録すると、
            日本中の将棋ファンの役に立ちます。
          </p>
        </div>
        <Link
          href="/toroku"
          className="shrink-0 rounded-2xl bg-brand px-6 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark"
        >
          ＋ 登録する
        </Link>
      </div>
    </div>
  );
}
