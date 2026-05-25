import type { Metadata } from "next";
import { getClasses } from "@/lib/data";
import { ClassCard } from "@/components/ClassCard";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { Notice } from "@/components/Notice";
import { SubmitCTA } from "@/components/SubmitCTA";
import type { AgeGroup } from "@/lib/types";
import { AGE_LABEL } from "@/lib/types";

export const metadata: Metadata = {
  title: "将棋教室をさがす",
  description: "全国の将棋教室を、地域や学年でさがせます。",
};

const VALID_AGES: AgeGroup[] = ["elementary", "junior", "high"];

export default async function KyoshitsuPage({
  searchParams,
}: {
  searchParams: Promise<{ pref?: string; age?: string; girls?: string }>;
}) {
  const sp = await searchParams;
  const pref = sp.pref || undefined;
  const age = VALID_AGES.includes(sp.age as AgeGroup) ? (sp.age as AgeGroup) : undefined;
  const girlsOnly = sp.girls === "1";

  const classes = await getClasses({ prefecture: pref, ageGroup: age, girlsOnly });
  const filterText = [pref, age ? AGE_LABEL[age] : null, girlsOnly ? "女子向け" : null]
    .filter(Boolean)
    .join("・");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-black text-ink sm:text-4xl">🎓 将棋教室をさがす</h1>
      <p className="mt-2 leading-relaxed text-ink-soft">
        近くの将棋教室をさがしてみよう。はじめての子でも通えるところがたくさんあるよ。
      </p>

      <div className="mt-6">
        <FilterBar accent="sky" showGirls girlsLabel="女子も安心の教室だけ" />
      </div>

      <div className="mb-4 mt-6 flex items-center gap-2">
        <span className="rounded-full bg-sky px-3 py-1 font-display text-lg font-black text-white">
          {classes.length}
        </span>
        <p className="font-bold text-ink">
          件みつかったよ
          {filterText && (
            <span className="ml-1 text-sm font-bold text-sky-dark">（{filterText}）</span>
          )}
        </p>
      </div>

      {classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-line bg-card p-8 text-center">
          <p className="text-ink-soft">
            えらんだ条件に合う教室が見つかりませんでした。
            <br />
            近くの教室を知っていたら、ぜひ登録してください。
          </p>
          <Link
            href="/toroku"
            className="mt-5 inline-block rounded-full bg-sky px-6 py-3 font-black text-white hover:bg-sky-dark"
          >
            ＋ この地域の教室を登録する
          </Link>
        </div>
      )}

      <div className="mt-10">
        <SubmitCTA />
      </div>
      <div className="mt-8">
        <Notice />
      </div>
    </div>
  );
}
