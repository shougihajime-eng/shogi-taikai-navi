import Link from "next/link";
import { KomaIcon } from "./KomaIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <KomaIcon label="将" className="h-9 w-9" />
          <span className="font-display text-xl font-black leading-none text-ink sm:text-2xl">
            将棋大会ナビ
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/taikai"
            className="rounded-full px-3 py-2 text-sm font-bold text-ink transition hover:bg-brand-soft hover:text-brand-dark sm:text-base"
          >
            🏆 大会
          </Link>
          <Link
            href="/kyoshitsu"
            className="rounded-full px-3 py-2 text-sm font-bold text-ink transition hover:bg-sky-soft hover:text-sky-dark sm:text-base"
          >
            🎓 教室
          </Link>
          <Link
            href="/about"
            className="hidden rounded-full px-3 py-2 text-sm font-bold text-ink transition hover:bg-line sm:inline-block sm:text-base"
          >
            このサイトについて
          </Link>
        </nav>
      </div>
    </header>
  );
}
