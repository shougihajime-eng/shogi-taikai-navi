"use client";

import { useState } from "react";
import Link from "next/link";
import { Mascot } from "@/components/Mascot";
import { REGIONS } from "@/lib/prefectures";
import { AGE_LABEL, type AgeGroup } from "@/lib/types";
import { clsx } from "@/lib/clsx";

type Kind = "tournament" | "class";
const AGES: AgeGroup[] = ["elementary", "junior", "high"];

function PrefSelect({
  value,
  onChange,
  accent,
}: {
  value: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base font-semibold text-ink focus:outline-none",
        accent,
      )}
    >
      <option value="">えらんでください</option>
      {REGIONS.map((r) => (
        <optgroup key={r.name} label={r.name}>
          {r.prefectures.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-bold text-ink">
        {label}
        {required ? (
          <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">必須</span>
        ) : (
          <span className="rounded bg-line px-1.5 py-0.5 text-[10px] font-bold text-ink-soft">任意</span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base text-ink focus:border-sky focus:outline-none";

export function SubmitForm() {
  const [kind, setKind] = useState<Kind>("tournament");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 入力値
  const [f, setF] = useState<Record<string, string>>({});
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  function toggleAge(a: AgeGroup) {
    setAgeGroups((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function switchKind(k: Kind) {
    setKind(k);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const required = kind === "tournament" ? f.title : f.name;
    if (!required || !f.prefecture) {
      setError(kind === "tournament" ? "大会名と都道府県を入れてください" : "教室名と都道府県を入れてください");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...f, ageGroups, website: f.website ?? "" }),
      });
      const data = await res.json();
      if (data.ok) setDone(true);
      else setError(data.error ?? "うまく送れませんでした。もう一度ためしてください。");
    } catch {
      setError("通信に失敗しました。電波のよい所でもう一度ためしてください。");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border-2 border-soon/40 bg-soon-soft/60 p-8 text-center">
        <Mascot label="歩" bob className="mx-auto h-20 w-20" />
        <h2 className="mt-3 font-display text-2xl font-black text-ink">ありがとうございます！🎉</h2>
        <p className="mt-3 leading-relaxed text-ink">
          申請を受けつけました。
          <br />
          内容をかくにんして、問題がなければサイトに公開します。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setF({});
              setAgeGroups([]);
            }}
            className="rounded-full bg-brand px-6 py-3 font-black text-white hover:bg-brand-dark"
          >
            つづけて登録する
          </button>
          <Link href="/" className="rounded-full border-2 border-line bg-white px-6 py-3 font-black text-ink hover:border-ink-soft">
            ホームにもどる
          </Link>
        </div>
      </div>
    );
  }

  const isT = kind === "tournament";

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* 大会／教室の切りかえ */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl border-2 border-line bg-card p-1.5">
        <button
          type="button"
          onClick={() => switchKind("tournament")}
          className={clsx(
            "rounded-xl px-4 py-3 text-base font-black transition",
            isT ? "bg-brand text-white shadow" : "text-ink hover:bg-brand-soft",
          )}
        >
          🏆 大会を登録
        </button>
        <button
          type="button"
          onClick={() => switchKind("class")}
          className={clsx(
            "rounded-xl px-4 py-3 text-base font-black transition",
            !isT ? "bg-sky text-white shadow" : "text-ink hover:bg-sky-soft",
          )}
        >
          🎓 教室を登録
        </button>
      </div>

      <div className="space-y-5 rounded-[var(--radius-card)] border-2 border-line bg-card p-5 sm:p-6">
        <Field label={isT ? "大会の名前" : "教室の名前"} required>
          <input
            className={inputCls}
            value={(isT ? f.title : f.name) ?? ""}
            onChange={set(isT ? "title" : "name")}
            placeholder={isT ? "例：○○市こども将棋大会" : "例：○○こども将棋教室"}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="都道府県" required>
            <PrefSelect
              value={f.prefecture ?? ""}
              onChange={(v) => setF((p) => ({ ...p, prefecture: v }))}
              accent="focus:border-sky"
            />
          </Field>
          <Field label="市区町村">
            <input className={inputCls} value={f.city ?? ""} onChange={set("city")} placeholder="例：横浜市" />
          </Field>
        </div>

        {/* 対象学年 */}
        <div>
          <span className="mb-1.5 block text-sm font-bold text-ink">対象の学年（あてはまるものを全部）</span>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAge(a)}
                className={clsx(
                  "rounded-full border-2 px-4 py-2 text-sm font-bold transition",
                  ageGroups.includes(a)
                    ? "border-sky bg-sky text-white"
                    : "border-line bg-white text-ink hover:border-ink-soft",
                )}
              >
                {AGE_LABEL[a]}
              </button>
            ))}
          </div>
        </div>

        {isT ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="主催（だれが開くか）">
                <input className={inputCls} value={f.organizer ?? ""} onChange={set("organizer")} placeholder="例：○○市将棋連盟" />
              </Field>
              <Field label="会場">
                <input className={inputCls} value={f.venue ?? ""} onChange={set("venue")} placeholder="例：市民会館" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="開催日" hint="決まっていれば。毎年ある大会なら空でOK">
                <input className={inputCls} type="date" value={f.eventDate ?? ""} onChange={set("eventDate")} />
              </Field>
              <Field label="参加費">
                <input className={inputCls} value={f.fee ?? ""} onChange={set("fee")} placeholder="例：無料 / 500円" />
              </Field>
            </div>
            {/* 女子について */}
            <div>
              <span className="mb-1.5 block text-sm font-bold text-ink">女子について</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "", label: "男女どちらでも" },
                  { v: "only", label: "👧 女子限定の大会" },
                  { v: "division", label: "👧 女子の部もある" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setF((p) => ({ ...p, girls: o.v }))}
                    className={clsx(
                      "rounded-full border-2 px-4 py-2 text-sm font-bold transition",
                      (f.girls ?? "") === o.v
                        ? "border-girls bg-girls text-white"
                        : "border-line bg-white text-ink hover:border-ink-soft",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <Field label="住所">
              <input className={inputCls} value={f.address ?? ""} onChange={set("address")} placeholder="例：○○町1-2-3 ○○ビル2F" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="日時（いつやっているか）">
                <input className={inputCls} value={f.schedule ?? ""} onChange={set("schedule")} placeholder="例：毎週土曜 10:00〜12:00" />
              </Field>
              <Field label="月謝・料金">
                <input className={inputCls} value={f.fee ?? ""} onChange={set("fee")} placeholder="例：月3,000円" />
              </Field>
            </div>
            <Field label="連絡先">
              <input className={inputCls} value={f.contact ?? ""} onChange={set("contact")} placeholder="例：電話番号やメール" />
            </Field>
            {/* 女子について */}
            <div>
              <span className="mb-1.5 block text-sm font-bold text-ink">女子について</span>
              <button
                type="button"
                onClick={() => setF((p) => ({ ...p, forGirls: p.forGirls === "1" ? "" : "1" }))}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition",
                  f.forGirls === "1"
                    ? "border-girls bg-girls text-white"
                    : "border-line bg-white text-ink hover:border-ink-soft",
                )}
              >
                <span aria-hidden>👧</span>女子も安心して通える教室
              </button>
            </div>
          </>
        )}

        <Field label="公式ページのURL" hint="ホームページやSNSがあれば（https://〜）">
          <input className={inputCls} value={f.officialUrl ?? ""} onChange={set("officialUrl")} placeholder="https://" inputMode="url" />
        </Field>

        <Field label="説明・ひとこと">
          <textarea
            className={clsx(inputCls, "min-h-[100px] resize-y")}
            value={f.description ?? ""}
            onChange={set("description")}
            placeholder="どんな大会・教室か、はじめての子でも来やすいか、など"
          />
        </Field>
      </div>

      {/* 申請者の情報（任意） */}
      <div className="space-y-5 rounded-[var(--radius-card)] border-2 border-line bg-card p-5 sm:p-6">
        <p className="text-sm font-bold text-ink-soft">あなたのこと（任意・公開されません）</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="お名前">
            <input className={inputCls} value={f.submitterName ?? ""} onChange={set("submitterName")} placeholder="例：将棋 太郎" />
          </Field>
          <Field label="連絡先">
            <input className={inputCls} value={f.submitterContact ?? ""} onChange={set("submitterContact")} placeholder="確認の連絡が必要なとき用" />
          </Field>
        </div>
      </div>

      {/* ロボット対策（人には見えない） */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={f.website ?? ""}
        onChange={set("website")}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && (
        <p className="rounded-2xl border-2 border-brand/40 bg-brand-soft px-4 py-3 font-bold text-brand-dark">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-2xl bg-brand px-6 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:opacity-60"
      >
        {sending ? "送信中…" : "この内容で登録を申請する"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        申請された内容は、確認してから公開します。まちがいやいたずらは公開されません。
      </p>
    </form>
  );
}
