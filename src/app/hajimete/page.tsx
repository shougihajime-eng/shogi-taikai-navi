import Link from "next/link";
import type { Metadata } from "next";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = {
  title: "はじめての子・おうちの方へ",
  description:
    "将棋大会に初めて出る子と、おうちの方へ。大会ってどんな感じ？持ち物は？弱くても出られる？親はついていくの？費用は？当日の流れは？よくある不安にやさしくお答えします。",
};

/** よくある不安に答えるカード */
function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border-2 border-line bg-card p-5 sm:p-6">
      <h3 className="flex items-start gap-2 font-display text-lg font-black text-ink sm:text-xl">
        <span className="mt-0.5 shrink-0 rounded-full bg-brand px-2 py-0.5 text-sm text-white">Q</span>
        {q}
      </h3>
      <div className="mt-3 leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export default function HajimetePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* タイトル */}
      <div className="flex items-center gap-3">
        <Mascot label="歩" bob className="h-16 w-16" />
        <div>
          <h1 className="font-display text-2xl font-black leading-tight text-ink sm:text-3xl">
            はじめての子・おうちの方へ
          </h1>
          <p className="mt-1 text-sm font-bold text-ink-soft">大会デビューの不安、いっしょに解消しよう！</p>
        </div>
      </div>

      <p className="mt-5 leading-relaxed text-ink">
        「将棋の大会って、どんなところ？」「うちの子、まだ弱いけど大丈夫？」
        ——はじめては、子どもも親御さんもドキドキしますよね。
        ここでは、よくある不安にやさしくお答えします。読めばきっと、安心して一歩がふみ出せます。
      </p>

      {/* よくある不安 Q&A */}
      <div className="mt-8 space-y-4">
        <QA q="弱くても出られますか？">
          <p>
            だいじょうぶです。多くの大会は<strong className="text-ink">強さ（級・段）でクラス分け</strong>されていて、
            はじめての子・初心者向けの「初級の部」「入門クラス」がよういされています。
            同じくらいの強さの子と当たるので、<strong className="text-ink">1勝もできずに終わる…ということは、まずありません</strong>。
            まずは「楽しかった！」を持ち帰るのが目標です。
          </p>
        </QA>

        <QA q="大会って、どんな感じ？こわくない？">
          <p>
            会場にはたくさんの子が集まり、決められた席で1対1で対局します。
            ふんいきは、運動会や発表会に近い「わくわく」した感じ。
            進行のスタッフや女流棋士の先生がいることも多く、こまったら手をあげれば助けてくれます。
            負けてもだいじょうぶ。<strong className="text-ink">みんな同じように、ドキドキしながら来ています</strong>。
          </p>
        </QA>

        <QA q="持ち物は何が必要？">
          <ul className="list-disc space-y-1 pl-5">
            <li>参加票・受付に必要なもの（公式ページの案内にしたがってね）</li>
            <li>飲みもの・お茶（会場は長い時間いることが多い）</li>
            <li>お昼ごはん・軽食（一日がかりの大会のとき）</li>
            <li>ハンカチ・ティッシュ、必要なら上ばき</li>
          </ul>
          <p className="mt-2">
            将棋盤・駒・対局時計は<strong className="text-ink">会場にあるのがふつう</strong>なので、持っていかなくて大丈夫なことが多いです。
          </p>
        </QA>

        <QA q="親はついていくの？対局中は見られる？">
          <p>
            送りむかえや受付は、おうちの方がいっしょのほうが安心です。
            対局中は、会場のルールで<strong className="text-ink">保護者席から見守る形</strong>や、
            「保護者は会場の外で待つ」形などさまざま。
            当日は会場の案内にしたがってください。子どもが集中できるよう、声かけは対局の前後にしてあげましょう。
          </p>
        </QA>

        <QA q="費用はどれくらい？">
          <p>
            大会によってちがいますが、子ども向けは<strong className="text-ink">無料〜数百円・千円ほど</strong>が多いです
            （イオンモールやJTの大会など、無料のものもたくさんあります）。
            正確な参加費は、各大会のページから公式サイトでたしかめてください。
          </p>
        </QA>

        <QA q="当日は、どんな流れ？">
          <ol className="list-decimal space-y-1 pl-5">
            <li>受付（早めに行くと安心）</li>
            <li>開会式・ルール説明</li>
            <li>対局スタート（何局かたたかいます）</li>
            <li>結果発表・表彰（賞状や参加賞がもらえることも）</li>
          </ol>
          <p className="mt-2">勝っても負けても、終わったらたくさんほめてあげてください。それが次への力になります。</p>
        </QA>
      </div>

      {/* 教室から始めるのもおすすめ */}
      <section className="mt-8 rounded-[var(--radius-card)] border-2 border-sky/30 bg-sky-soft/50 p-6">
        <h2 className="font-display text-xl font-black text-ink">🎓 まずは将棋教室から、でもOK</h2>
        <p className="mt-3 leading-relaxed text-ink">
          「いきなり大会はちょっと…」という子は、近くの<strong>将棋教室</strong>から始めるのもおすすめ。
          ルールやマナーを教えてもらいながら、同じくらいの仲間と楽しく強くなれます。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/kyoshitsu" className="rounded-full bg-sky px-6 py-3 font-black text-white transition hover:bg-sky-dark">
            🎓 教室をさがす
          </Link>
          <Link href="/taikai" className="rounded-full bg-brand px-6 py-3 font-black text-white transition hover:bg-brand-dark">
            🏆 大会をさがす
          </Link>
        </div>
      </section>

      {/* 大事なお願い */}
      <section className="mt-6 rounded-[var(--radius-card)] border-2 border-koma/40 bg-brand-soft/60 p-6">
        <h2 className="font-display text-lg font-black text-ink">💡 大事なお願い</h2>
        <p className="mt-3 leading-relaxed text-ink">
          日程・会場・参加費・クラス分けは大会によってちがい、変わることもあります。
          <strong>参加する前に、かならず主催の公式ページで最新の情報をたしかめてください。</strong>
        </p>
      </section>
    </div>
  );
}
