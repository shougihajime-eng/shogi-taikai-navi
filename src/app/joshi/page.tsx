import Link from "next/link";
import type { Metadata } from "next";
import { getTournaments, getClasses } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import { ClassCard } from "@/components/ClassCard";
import { Mascot } from "@/components/Mascot";
import { Notice } from "@/components/Notice";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "女子の将棋大会・教室",
  description:
    "女の子のための将棋大会（女子大会・女子の部）や、女子が安心して通える将棋教室を全国から集めました。小学生・中学生・高校生の女の子におすすめ。",
};

export default async function JoshiPage() {
  const [tournaments, classes] = await Promise.all([
    getTournaments({ girlsOnly: true }),
    getClasses({ girlsOnly: true }),
  ]);

  return (
    <div>
      {/* ===== ヒーロー（ピンク） ===== */}
      <section className="relative overflow-hidden border-b-2 border-girls/20">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, var(--color-girls-soft) 0%, rgba(255,224,238,0.25) 55%, transparent 100%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-12 text-center sm:pt-14">
          <div className="flex items-center justify-center gap-3 animate-float-in">
            <span className="animate-twinkle text-2xl" aria-hidden>🎀</span>
            <Mascot label="姫" bob className="h-20 w-20 sm:h-24 sm:w-24" />
            <span className="animate-twinkle text-2xl" style={{ animationDelay: "0.8s" }} aria-hidden>✨</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
            👧 <span className="text-girls">女子</span>の将棋大会・教室
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            女の子のための大会（女子大会・女子の部）や、女子が安心して通える教室を集めたよ。
            同じ年ごろの女の子と、将棋を楽しもう！
          </p>
        </div>
      </section>

      {/* ===== 女子の大会 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 font-display text-2xl font-black text-ink sm:text-3xl">
          🏆 女子の大会（{tournaments.length}）
        </h2>
        {tournaments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line bg-card p-6 text-center text-ink-soft">
            いまは登録がありません。知っている女子大会があれば教えてね。
          </p>
        )}
      </section>

      {/* ===== 女子も安心の教室 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 font-display text-2xl font-black text-ink sm:text-3xl">
          🎓 女子も安心の教室（{classes.length}）
        </h2>
        {classes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line bg-card p-6 text-center text-ink-soft">
            いまは登録がありません。女子が通いやすい教室を知っていたら教えてね。
          </p>
        )}
      </section>

      {/* ===== 登録のよびかけ（ピンク） ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="overflow-hidden rounded-[var(--radius-card)] border-2 border-girls/30 bg-girls-soft/70 p-6 text-center sm:p-8">
          <Mascot label="姫" bob className="mx-auto h-16 w-16" />
          <h2 className="mt-3 font-display text-xl font-black text-ink sm:text-2xl">
            女の子の大会・教室を教えてください
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            あなたの地域の女子大会や、女子が通いやすい教室を登録すると、
            全国の女の子の役に立ちます。
          </p>
          <Link
            href="/toroku"
            className="mt-5 inline-block rounded-2xl bg-girls px-6 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-95"
          >
            ＋ 登録する
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12 pt-2">
        <Notice />
      </section>
    </div>
  );
}
