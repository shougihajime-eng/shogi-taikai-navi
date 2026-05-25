import type { Metadata } from "next";
import { getClasses } from "@/lib/data";
import { ClassCard } from "@/components/ClassCard";
import { FilterBar } from "@/components/FilterBar";
import { Notice } from "@/components/Notice";
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
  searchParams: Promise<{ pref?: string; age?: string }>;
}) {
  const sp = await searchParams;
  const pref = sp.pref || undefined;
  const age = VALID_AGES.includes(sp.age as AgeGroup) ? (sp.age as AgeGroup) : undefined;

  const classes = await getClasses({ prefecture: pref, ageGroup: age });
  const filterText = [pref, age ? AGE_LABEL[age] : null].filter(Boolean).join("・");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-black text-ink sm:text-4xl">🎓 将棋教室をさがす</h1>
      <p className="mt-2 text-ink-soft">
        近くの将棋教室をさがしてみよう。はじめての子でも通えるところがたくさんあるよ。
      </p>

      <div className="mt-6">
        <FilterBar accent="sky" />
      </div>

      <div className="mt-6 mb-4">
        <p className="font-bold text-ink">
          {filterText ? <span className="text-sky-dark">{filterText}</span> : "全国"}
          の教室：<span className="text-sky-dark">{classes.length}</span> 件
        </p>
      </div>

      {classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <ClassCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-line bg-card p-8 text-center text-ink-soft">
          えらんだ条件に合う教室が見つかりませんでした。
          <br />
          条件を変えてためしてみてね。
        </p>
      )}

      <div className="mt-8">
        <Notice />
      </div>
    </div>
  );
}
