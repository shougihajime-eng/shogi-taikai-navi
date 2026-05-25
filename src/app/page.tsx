import Link from "next/link";
import { getTournaments, getClasses } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import { ClassCard } from "@/components/ClassCard";
import { KomaIcon } from "@/components/KomaIcon";
import { Notice } from "@/components/Notice";

export default async function HomePage() {
  const [tournaments, classes] = await Promise.all([
    getTournaments({ includeFinished: false }),
    getClasses(),
  ]);

  const upcoming = tournaments.slice(0, 6);
  const someClasses = classes.slice(0, 3);

  return (
    <div>
      {/* ===== ヒーロー（いちばん上の大きな案内） ===== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:pt-16">
          <div className="flex items-center justify-center gap-2">
            <KomaIcon label="王" className="h-12 w-12 -rotate-6" />
            <KomaIcon label="歩" className="h-10 w-10 rotate-6" />
          </div>
          <h1 className="mt-4 text-center font-display text-3xl font-black leading-tight text-ink sm:text-5xl">
            将棋の大会・教室を
            <br className="sm:hidden" />
            <span className="text-brand">さがそう！</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-ink-soft sm:text-lg">
            小学生・中学生・高校生のための、
            <br className="hidden sm:block" />
            全国の将棋大会と将棋教室をまとめた案内サイトだよ。
          </p>

          {/* 大きな2つのボタン */}
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <Link
              href="/taikai"
              className="flex items-center justify-center gap-3 rounded-[var(--radius-card)] bg-brand px-6 py-5 text-center text-xl font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-brand-dark hover:shadow-lg"
            >
              <span className="text-2xl" aria-hidden>🏆</span>
              大会をさがす
            </Link>
            <Link
              href="/kyoshitsu"
              className="flex items-center justify-center gap-3 rounded-[var(--radius-card)] bg-sky px-6 py-5 text-center text-xl font-black text-white shadow-md transition hover:-translate-y-1 hover:bg-sky-dark hover:shadow-lg"
            >
              <span className="text-2xl" aria-hidden>🎓</span>
              教室をさがす
            </Link>
          </div>

          {/* 学年でショートカット */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-bold text-ink-soft">学年ですぐさがす：</span>
            <Link href="/taikai?age=elementary" className="rounded-full bg-elem-soft px-4 py-1.5 text-sm font-bold text-elem hover:brightness-95">
              小学生
            </Link>
            <Link href="/taikai?age=junior" className="rounded-full bg-jhs-soft px-4 py-1.5 text-sm font-bold text-jhs hover:brightness-95">
              中学生
            </Link>
            <Link href="/taikai?age=high" className="rounded-full bg-hs-soft px-4 py-1.5 text-sm font-bold text-hs hover:brightness-95">
              高校生
            </Link>
          </div>
        </div>
      </section>

      {/* ===== もうすぐの大会 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
            🔥 もうすぐの大会
          </h2>
          <Link href="/taikai" className="shrink-0 text-sm font-bold text-brand-dark hover:underline">
            ぜんぶ見る →
          </Link>
        </div>

        {upcoming.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line bg-card p-6 text-center text-ink-soft">
            いまは予定されている大会がありません。また見にきてね。
          </p>
        )}
      </section>

      {/* ===== 将棋教室 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
            🎓 将棋教室をのぞいてみよう
          </h2>
          <Link href="/kyoshitsu" className="shrink-0 text-sm font-bold text-sky-dark hover:underline">
            ぜんぶ見る →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {someClasses.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* ===== 注意書き ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-4">
        <Notice />
      </section>
    </div>
  );
}
