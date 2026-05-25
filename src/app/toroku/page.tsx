import type { Metadata } from "next";
import { SubmitForm } from "@/components/SubmitForm";
import { Mascot } from "@/components/Mascot";

export const metadata: Metadata = {
  title: "大会・教室を登録する",
  description:
    "あなたの地域の将棋大会や将棋教室を登録できます。確認のうえ、全国に向けて公開します。",
};

export default function TorokuPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center gap-3">
        <Mascot label="登" bob className="h-14 w-14" />
        <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
          大会・教室を登録する
        </h1>
      </div>
      <p className="mt-3 leading-relaxed text-ink-soft">
        あなたの地域の将棋大会や将棋教室を、ぜひ教えてください。
        確認のうえ、<strong className="text-ink">全国の子どもたちに向けて</strong>このサイトで紹介します。
        むずかしい入力はありません。分かるところだけでも大丈夫です。
      </p>

      <div className="mt-6">
        <SubmitForm />
      </div>
    </div>
  );
}
