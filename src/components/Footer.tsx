import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-line bg-card">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-soft">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="font-bold hover:text-ink">ホーム</Link>
          <Link href="/taikai" className="font-bold hover:text-ink">大会をさがす</Link>
          <Link href="/kyoshitsu" className="font-bold hover:text-ink">教室をさがす</Link>
          <Link href="/about" className="font-bold hover:text-ink">このサイトについて</Link>
        </div>
        <p className="mt-4 leading-relaxed">
          このサイトは、小学生・中学生・高校生の将棋大会や将棋教室を「さがしやすく」まとめた案内サイトです。
          日程・会場・参加費などは変わることがあります。
          <strong className="text-ink">参加の前に、かならず主催の公式ページで最新の情報をたしかめてください。</strong>
        </p>
        <p className="mt-4 text-xs">© {new Date().getFullYear()} 将棋大会ナビ</p>
      </div>
    </footer>
  );
}
