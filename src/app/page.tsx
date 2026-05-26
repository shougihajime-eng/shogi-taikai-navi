import Link from "next/link";
import { getTournaments, getClasses } from "@/lib/data";
import { todayJST, formatJPDate } from "@/lib/date";
import { TournamentCard } from "@/components/TournamentCard";
import { ClassCard } from "@/components/ClassCard";
import { Mascot } from "@/components/Mascot";
import { Notice } from "@/components/Notice";
import { SubmitCTA } from "@/components/SubmitCTA";
import { RegionPicker } from "@/components/RegionPicker";
import { JapanMap } from "@/components/JapanMap";

// トップはいつ見ても最新のデータを表示する（データ追加・承認がすぐ反映される）
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [tournaments, classes] = await Promise.all([
    getTournaments({ includeFinished: false }),
    getClasses(),
  ]);

  const dated = tournaments
    .filter((t) => t.status === "upcoming" || t.status === "ongoing")
    .slice(0, 6);
  const recurring = tournaments.filter((t) => t.status === "recurring").slice(0, 6);
  const someClasses = classes.slice(0, 3);

  return (
    <div>
      {/* ===== ヒーロー（いちばん上の大きな案内） ===== */}
      <section className="relative overflow-hidden border-b-2 border-line">
        {/* 将棋盤のような格子もよう */}
        <div className="board-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, rgba(255,233,210,0.9) 0%, rgba(253,246,236,0.2) 60%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-12 sm:pt-16">
          <div className="flex items-center justify-center gap-3 animate-float-in">
            <span className="animate-twinkle text-2xl sm:text-3xl" aria-hidden>✨</span>
            <Mascot label="歩" bob className="h-20 w-20 sm:h-28 sm:w-28" />
            <span className="animate-twinkle text-2xl sm:text-3xl" style={{ animationDelay: "0.8s" }} aria-hidden>⭐</span>
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

          {/* 件数 */}
          <div className="mx-auto mt-5 flex max-w-md items-center justify-center gap-3 text-center">
            <div className="flex-1 rounded-2xl border-2 border-brand-soft bg-card px-3 py-2">
              <div className="font-display text-2xl font-black text-brand">{tournaments.length}</div>
              <div className="text-xs font-bold text-ink-soft">予定の大会</div>
            </div>
            <div className="flex-1 rounded-2xl border-2 border-sky-soft bg-card px-3 py-2">
              <div className="font-display text-2xl font-black text-sky-dark">{classes.length}</div>
              <div className="text-xs font-bold text-ink-soft">将棋教室</div>
            </div>
          </div>

          {/* 最終チェック日（毎朝見なおしている安心感） */}
          <p className="mt-3 text-center text-xs text-ink-soft">
            🕒 情報は毎朝見なおしています（最終チェック：{formatJPDate(todayJST())}）
          </p>

          {/* 大きな2つのボタン */}
          <div className="mx-auto mt-7 grid max-w-2xl gap-4 sm:grid-cols-2">
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
            <Link href="/joshi" className="rounded-full bg-girls-soft px-4 py-1.5 text-sm font-bold text-girls hover:brightness-95">
              👧 女子の大会・教室
            </Link>
          </div>

          {/* はじめての子・おうちの方へ の入口 */}
          <div className="mx-auto mt-5 max-w-2xl">
            <Link
              href="/hajimete"
              className="flex items-center justify-center gap-2 rounded-full border-2 border-soon/40 bg-soon-soft/70 px-5 py-2.5 text-center text-sm font-black text-soon transition hover:-translate-y-0.5 hover:border-soon"
            >
              <span aria-hidden>🔰</span>
              はじめて大会に出る子・おうちの方へ（不安にお答えします）
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 地域からさがす（日本地図＋地方ナビ） ===== */}
      <section id="chiiki" className="mx-auto max-w-5xl px-4 py-8 scroll-mt-20">
        <h2 className="mb-2 font-display text-2xl font-black text-ink sm:text-3xl">
          🗾 地図からさがす
        </h2>
        <p className="mb-5 text-sm text-ink-soft">
          住んでいる県をタップしてね。北海道から沖縄まで、近くの大会・教室がさがせるよ。
        </p>

        {/* クリックできる日本地図 */}
        <div className="rounded-[var(--radius-card)] border-2 border-line bg-card p-4 shadow-sm sm:p-6">
          <JapanMap />
        </div>

        {/* ボタンでもさがせる（地方→都道府県） */}
        <p className="mb-3 mt-6 text-sm font-bold text-ink-soft">ボタンでもさがせるよ：</p>
        <RegionPicker />
      </section>

      {/* ===== もうすぐの大会（日付が決まっているもの） ===== */}
      {dated.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
              🔥 もうすぐの大会
            </h2>
            <Link href="/taikai" className="shrink-0 text-sm font-bold text-brand-dark hover:underline">
              ぜんぶ見る →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dated.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* ===== 毎年ひらかれる全国の大会 ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-ink sm:text-3xl">
            🏆 毎年ひらかれる全国の大会
          </h2>
          <Link href="/taikai" className="shrink-0 text-sm font-bold text-brand-dark hover:underline">
            ぜんぶ見る →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recurring.map((t) => (
            <TournamentCard key={t.id} t={t} />
          ))}
        </div>
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

      {/* ===== 登録のよびかけ ===== */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <SubmitCTA />
      </section>

      {/* ===== 注意書き ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-4">
        <Notice />
      </section>
    </div>
  );
}
