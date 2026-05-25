import type { Metadata } from "next";
import { getTournaments } from "@/lib/data";
import { TournamentCard } from "@/components/TournamentCard";
import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { Notice } from "@/components/Notice";
import { SubmitCTA } from "@/components/SubmitCTA";
import type { AgeGroup } from "@/lib/types";
import { AGE_LABEL } from "@/lib/types";

export const metadata: Metadata = {
  title: "将棋大会をさがす",
  description: "小学生・中学生・高校生の将棋大会を、地域や学年でさがせます。",
};

const VALID_AGES: AgeGroup[] = ["elementary", "junior", "high"];

export default async function TaikaiPage({
  searchParams,
}: {
  searchParams: Promise<{ pref?: string; age?: string }>;
}) {
  const sp = await searchParams;
  const pref = sp.pref || undefined;
  const age = VALID_AGES.includes(sp.age as AgeGroup) ? (sp.age as AgeGroup) : undefined;

  const tournaments = await getTournaments({ prefecture: pref, ageGroup: age });

  const filterText = [pref, age ? AGE_LABEL[age] : null].filter(Boolean).join("・");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="font-display text-3xl font-black text-ink sm:text-4xl">🏆 将棋大会をさがす</h1>
      <p className="mt-2 text-ink-soft">
        地域や学年でしぼりこめます。開催が近いものから順にならんでいます。
      </p>

      <div className="mt-6">
        <FilterBar accent="brand" />
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="font-bold text-ink">
          {filterText ? <span className="text-brand-dark">{filterText}</span> : "全国"}
          の大会：<span className="text-brand-dark">{tournaments.length}</span> 件
        </p>
      </div>

      {tournaments.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} t={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-line bg-card p-8 text-center">
          <p className="text-ink-soft">
            えらんだ条件に合う大会が見つかりませんでした。
            <br />
            条件を変えるか、知っている大会があれば登録してください。
          </p>
          <Link
            href="/toroku"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark"
          >
            ＋ この地域の大会を登録する
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
