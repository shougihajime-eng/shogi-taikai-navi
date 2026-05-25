import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getClassById } from "@/lib/data";
import { AgeBadges } from "@/components/AgeBadge";
import { Notice } from "@/components/Notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getClassById(id);
  if (!c) return { title: "教室が見つかりません" };
  return { title: c.name, description: `${c.prefecture}の将棋教室。` };
}

function Row({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-line py-3 last:border-0">
      <span className="w-24 shrink-0 font-bold text-ink-soft">
        <span className="mr-1" aria-hidden>{icon}</span>
        {label}
      </span>
      <span className="flex-1 text-ink">{children}</span>
    </div>
  );
}

export default async function ClassDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await getClassById(id);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/kyoshitsu" className="text-sm font-bold text-sky-dark hover:underline">
        ← 教室いちらんにもどる
      </Link>

      <div className="mt-4 rounded-[var(--radius-card)] border-2 border-line bg-card p-6 shadow-sm sm:p-8">
        <span className="rounded-full bg-sky-soft px-3 py-1 text-sm font-bold text-sky-dark">
          将棋教室
        </span>

        <h1 className="mt-4 font-display text-2xl font-black leading-snug text-ink sm:text-3xl">
          {c.name}
        </h1>

        <div className="mt-3">
          <AgeBadges groups={c.ageGroups} />
        </div>

        {c.description && (
          <p className="mt-5 leading-relaxed text-ink-soft">{c.description}</p>
        )}

        <dl className="mt-6">
          <Row icon="📍" label="場所">
            {c.prefecture}
            {c.city ? ` ${c.city}` : ""}
            {c.address ? `（${c.address}）` : ""}
          </Row>
          {c.schedule && <Row icon="🕒" label="日時">{c.schedule}</Row>}
          {c.target && <Row icon="🧒" label="対象">{c.target}</Row>}
          {c.fee && <Row icon="💰" label="月謝・料金">{c.fee}</Row>}
          {c.contact && <Row icon="📞" label="連絡先">{c.contact}</Row>}
        </dl>

        {c.officialUrl && (
          <a
            href={c.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sky px-6 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-dark"
          >
            🔗 公式ページでくわしく見る
          </a>
        )}

        <p className="mt-4 text-center text-xs text-ink-soft">
          情報のもと：{c.sourceName}
        </p>
      </div>

      <div className="mt-6">
        <Notice />
      </div>
    </div>
  );
}
