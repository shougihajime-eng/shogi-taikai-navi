import Link from "next/link";
import type { Metadata } from "next";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "将棋大会ナビは、小中高生の将棋大会・将棋教室をまとめた案内サイトです。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-3">
        <Mascot label="将" bob className="h-14 w-14" />
        <h1 className="font-display text-3xl font-black text-ink">このサイトについて</h1>
      </div>

      <div className="mt-6 space-y-6 leading-relaxed text-ink">
        <p>
          「将棋大会ナビ」は、<strong>小学生・中学生・高校生</strong>のための将棋大会や将棋教室を、
          全国からまとめて、かんたんにさがせるようにした案内サイトです。
        </p>

        <section className="rounded-[var(--radius-card)] border-2 border-line bg-card p-6">
          <h2 className="font-display text-xl font-black text-ink">🔎 できること</h2>
          <ul className="mt-3 space-y-2">
            <li>🏆 学年（小・中・高）や地域で、将棋大会をさがせます。</li>
            <li>🎓 近くの将棋教室をさがせます。</li>
            <li>🔥 開催が近い大会から順にならぶので、見のがしにくいです。</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-card)] border-2 border-line bg-card p-6">
          <h2 className="font-display text-xl font-black text-ink">🤝 みんなで作る全国マップ</h2>
          <p className="mt-3">
            このサイトには、まず<strong>毎年ひらかれる全国の主要な大会</strong>がのっています。
            そして、地域の大会や教室は<strong>みんなの登録</strong>でどんどん増えていきます。
            あなたの知っている大会・教室を
            <Link href="/toroku" className="font-bold text-brand-dark underline">登録ページ</Link>
            から教えてください（確認のうえ公開します）。
          </p>
          <p className="mt-3">
            また<strong>毎朝4時ごろ</strong>に自動で見なおして、終わって古くなった大会をかたづけています。
          </p>
        </section>

        <section className="rounded-[var(--radius-card)] border-2 border-koma/40 bg-brand-soft/60 p-6">
          <h2 className="font-display text-xl font-black text-ink">💡 大事なお願い</h2>
          <p className="mt-3">
            日程・会場・参加費などは変わることがあります。
            また、自動で集めた情報には、まちがいやふるい情報がまじることがあります。
            <strong>参加する前に、かならず主催の公式ページで最新の情報をたしかめてください。</strong>
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/taikai" className="rounded-full bg-brand px-6 py-3 font-black text-white transition hover:bg-brand-dark">
            🏆 大会をさがす
          </Link>
          <Link href="/kyoshitsu" className="rounded-full bg-sky px-6 py-3 font-black text-white transition hover:bg-sky-dark">
            🎓 教室をさがす
          </Link>
        </div>
      </div>
    </div>
  );
}
