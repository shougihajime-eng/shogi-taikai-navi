/** 「公式で確認してね」の注意書き（大事なのでやさしく目立たせる） */
export function Notice() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-koma/40 bg-brand-soft/60 px-4 py-3 text-sm text-ink">
      <span className="text-lg" aria-hidden>💡</span>
      <p className="leading-relaxed">
        日程や場所は変わることがあります。参加する前に、かならず
        <strong>主催の公式ページ</strong>で最新の情報をたしかめてね。
      </p>
    </div>
  );
}
