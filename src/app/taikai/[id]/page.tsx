import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTournamentById, getTournaments } from "@/lib/data";
import { ORGANIZER_LABEL } from "@/lib/types";
import { formatJPDate } from "@/lib/date";
import { AgeBadges } from "@/components/AgeBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Notice } from "@/components/Notice";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTournamentById(id);
  if (!t) return { title: "大会が見つかりません" };
  return { title: t.title, description: `${t.prefecture}で開催。${t.organizer}主催の将棋大会。` };
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

export default async function TournamentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTournamentById(id);
  if (!t) notFound();

  const related = (await getTournaments({ prefecture: t.prefecture }))
    .filter((x) => x.id !== t.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/taikai" className="text-sm font-bold text-brand-dark hover:underline">
        ← 大会いちらんにもどる
      </Link>

      <div className="mt-4 rounded-[var(--radius-card)] border-2 border-line bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge eventDate={t.eventDate} endDate={t.endDate} status={t.status} />
          <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand-dark">
            {ORGANIZER_LABEL[t.organizerType]}
          </span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-black leading-snug text-ink sm:text-3xl">
          {t.title}
        </h1>

        <div className="mt-3">
          <AgeBadges groups={t.ageGroups} />
        </div>

        {t.description && (
          <p className="mt-5 leading-relaxed text-ink-soft">{t.description}</p>
        )}

        <dl className="mt-6">
          <Row icon="📅" label="開催日">
            <span className="font-bold">{formatJPDate(t.eventDate)}</span>
            {t.endDate && <> 〜 {formatJPDate(t.endDate)}</>}
          </Row>
          {t.entryDeadline && (
            <Row icon="✍️" label="申込しめ切り">{formatJPDate(t.entryDeadline)}</Row>
          )}
          <Row icon="📍" label="場所">
            {t.prefecture}
            {t.city ? ` ${t.city}` : ""}
            {t.venue ? `（${t.venue}）` : ""}
          </Row>
          {t.gradeDetail && <Row icon="🧒" label="対象">{t.gradeDetail}</Row>}
          {t.fee && <Row icon="💰" label="参加費">{t.fee}</Row>}
          {t.capacity && <Row icon="👥" label="定員">{t.capacity}</Row>}
          <Row icon="🏠" label="主催">{t.organizer}</Row>
        </dl>

        {t.officialUrl && (
          <a
            href={t.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            🔗 公式ページで申し込む・くわしく見る
          </a>
        )}

        <p className="mt-4 text-center text-xs text-ink-soft">
          情報のもと：{t.sourceName}
        </p>
      </div>

      <div className="mt-6">
        <Notice />
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl font-black text-ink">
            {t.prefecture}のほかの大会
          </h2>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/taikai/${r.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border-2 border-line bg-card px-4 py-3 transition hover:border-brand"
                >
                  <span className="font-bold text-ink">{r.title}</span>
                  <span className="shrink-0 text-sm text-ink-soft">{formatJPDate(r.eventDate)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
