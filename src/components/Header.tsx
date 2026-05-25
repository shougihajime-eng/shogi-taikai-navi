import Link from "next/link";
import { KomaIcon } from "./KomaIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-paper/90 backdrop-blur">
      {/* いちばん上の細い虹色ライン（楽しい雰囲気） */}
      <div
        className="h-1.5 w-full"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, var(--color-brand), var(--color-lemon) 30%, var(--color-girls) 55%, var(--color-grape) 78%, var(--color-sky))",
        }}
      />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <KomaIcon label="将" className="hover-wiggle h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-black text-ink sm:text-2xl">
              将棋大会ナビ
            </span>
            <span className="mt-0.5 text-[11px] font-bold text-ink-soft">
              小中高生の大会・教室さがし
            </span>
          </span>
        </Link>

        {/* パソコン用メニュー（スマホでは下のタブバーが出るので隠す） */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/taikai"
            className="rounded-full px-3 py-2 text-base font-bold text-ink transition hover:bg-brand-soft hover:text-brand-dark"
          >
            🏆 大会
          </Link>
          <Link
            href="/kyoshitsu"
            className="rounded-full px-3 py-2 text-base font-bold text-ink transition hover:bg-sky-soft hover:text-sky-dark"
          >
            🎓 教室
          </Link>
          <Link
            href="/joshi"
            className="rounded-full px-3 py-2 text-base font-bold text-girls transition hover:bg-girls-soft"
          >
            👧 女子
          </Link>
          <Link
            href="/hajimete"
            className="rounded-full px-3 py-2 text-base font-bold text-ink transition hover:bg-soon-soft hover:text-soon"
          >
            🔰 はじめての方へ
          </Link>
          <Link
            href="/about"
            className="rounded-full px-3 py-2 text-base font-bold text-ink transition hover:bg-line"
          >
            このサイトについて
          </Link>
          <Link
            href="/toroku"
            className="rounded-full bg-brand px-4 py-2 text-base font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            ＋登録
          </Link>
        </nav>

        {/* スマホ用：登録ボタンだけ右上に小さく出す */}
        <Link
          href="/toroku"
          className="rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark md:hidden"
        >
          ＋登録
        </Link>
      </div>
    </header>
  );
}
