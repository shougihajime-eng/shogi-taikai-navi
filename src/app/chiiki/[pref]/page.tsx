import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTournaments, getClasses } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import { ClassCard } from "@/components/ClassCard";
import { Notice } from "@/components/Notice";
import { SubmitCTA } from "@/components/SubmitCTA";
import { SLUG_TO_PREF, PREF_SLUG, regionOf, REGIONS } from "@/lib/prefectures";

// いつ見ても最新（DBの追加・承認がすぐ反映される）
export const dynamic = "force-dynamic";

const BASE = "https://shogi-taikai-navi.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pref: string }>;
}): Promise<Metadata> {
  const { pref: slug } = await params;
  const pref = SLUG_TO_PREF[slug];
  if (!pref) return { title: "地域が見つかりません" };
  return {
    title: `${pref}の将棋大会・将棋教室`,
    description: `${pref}の小学生・中学生・高校生向けの将棋大会と将棋教室をまとめました。全国規模の大会や、${pref}で通える教室がさがせます。`,
    alternates: { canonical: `/chiiki/${slug}` },
  };
}

export default async function ChiikiPage({
  params,
}: {
  params: Promise<{ pref: string }>;
}) {
  const { pref: slug } = await params;
  const pref = SLUG_TO_PREF[slug];
  if (!pref) notFound();

  const region = regionOf(pref);
  const [tournaments, allClasses] = await Promise.all([
    getTournaments({ prefecture: pref }),
    getClasses(),
  ]);
  // その県の教室＋全国どこからでも通える/参加できる教室
  const classes = allClasses.filter((c) => c.prefecture === pref || c.prefecture === "全国");

  // 検索エンジン向けのパンくず（構造化データ）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE },
      { "@type": "ListItem", position: 2, name: "地域からさがす", item: `${BASE}/#chiiki` },
      { "@type": "ListItem", position: 3, name: pref, item: `${BASE}/chiiki/${slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* パンくず */}
      <nav className="text-sm text-ink-soft" aria-label="パンくず">
        <Link href="/" className="font-bold hover:text-ink">
          ホーム
        </Link>
        <span className="mx-1">›</span>
        <span className="font-bold text-ink">{pref}</span>
      </nav>

      <h1 className="mt-3 font-display text-3xl font-black text-ink sm:text-4xl">
        📍 {pref}の将棋大会・将棋教室
      </h1>
      <p className="mt-2 leading-relaxed text-ink-soft">
        {region && <span className="font-bold">{region}地方・</span>}
        {pref}の小学生・中学生・高校生向けの将棋大会と将棋教室をまとめました。
        全国規模の大会も表示しています。
      </p>

      {/* 大会 */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-ink">
            🏆 {pref}でさがせる大会（{tournaments.length}）
          </h2>
          <Link href={`/taikai?pref=${encodeURIComponent(pref)}`} className="shrink-0 text-sm font-bold text-brand-dark hover:underline">
            学年でしぼる →
          </Link>
        </div>
        {tournaments.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line bg-card p-6 text-center text-ink-soft">
            いまは{pref}の大会の登録がありません。知っている大会があれば
            <Link href="/toroku" className="font-bold text-brand-dark underline">登録</Link>
            してください。
          </p>
        )}
      </section>

      {/* 教室 */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-black text-ink">
            🎓 {pref}でさがせる教室（{classes.length}）
          </h2>
          <Link href={`/kyoshitsu?pref=${encodeURIComponent(pref)}`} className="shrink-0 text-sm font-bold text-sky-dark hover:underline">
            くわしく →
          </Link>
        </div>
        {classes.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <ClassCard key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-line bg-card p-6 text-center text-ink-soft">
            いまは{pref}の教室の登録がありません。近くの教室を知っていたら
            <Link href="/toroku" className="font-bold text-sky-dark underline">登録</Link>
            してください。
          </p>
        )}
      </section>

      {/* ほかの地域へ */}
      <section className="mt-10 rounded-[var(--radius-card)] border-2 border-line bg-card p-5">
        <p className="mb-3 text-sm font-bold text-ink">ほかの地域もさがす</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/#chiiki" className="rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark hover:brightness-95">
            🗾 地図からさがす
          </Link>
          {region &&
            (REGIONS.find((r) => r.name === region)?.prefectures ?? [])
              .filter((p) => p !== pref)
              .map((p) => (
                <Link
                  key={p}
                  href={`/chiiki/${PREF_SLUG[p]}`}
                  className="rounded-full border-2 border-line bg-white px-4 py-2 text-sm font-bold text-ink transition hover:border-brand hover:text-brand-dark"
                >
                  {p}
                </Link>
              ))}
        </div>
      </section>

      <div className="mt-10">
        <SubmitCTA />
      </div>
      <div className="mt-8">
        <Notice />
      </div>
    </div>
  );
}
