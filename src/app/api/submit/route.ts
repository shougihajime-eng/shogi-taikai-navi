import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const AGE_VALUES = ["elementary", "junior", "high"];

/* eslint-disable @typescript-eslint/no-explicit-any */
function str(v: any, max = 500): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}

function ages(v: any): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => AGE_VALUES.includes(x));
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * みんなの申請を受け取るAPI。
 * ブラウザのフォームから呼ばれ、service_role で submissions に「pending（確認待ち）」として保存する。
 * 公開サイトには出ない。あとで承認されたものだけが公開される。
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "データの形がただしくありません" }, { status: 400 });
  }

  // ロボット対策（人には見えない項目。入っていたらボットなので、成功風に返して捨てる）
  if (str(body.website)) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  const kind = body.kind === "class" ? "class" : "tournament";

  // 中身を整える
  const payload: Record<string, unknown> = {};
  if (kind === "tournament") {
    const title = str(body.title, 120);
    const prefecture = str(body.prefecture, 20);
    const ageGroups = ages(body.ageGroups);
    if (!title || !prefecture) {
      return NextResponse.json(
        { ok: false, error: "大会名と都道府県は必ず入力してください" },
        { status: 400 },
      );
    }
    Object.assign(payload, {
      title,
      prefecture,
      organizer: str(body.organizer, 120),
      city: str(body.city, 40),
      venue: str(body.venue, 120),
      eventDate: str(body.eventDate, 20),
      ageGroups,
      gradeDetail: str(body.gradeDetail, 120),
      fee: str(body.fee, 80),
      officialUrl: str(body.officialUrl, 300),
      description: str(body.description, 1000),
      girlsOnly: body.girls === "only",
      hasGirlsDivision: body.girls === "division",
    });
  } else {
    const name = str(body.name, 120);
    const prefecture = str(body.prefecture, 20);
    if (!name || !prefecture) {
      return NextResponse.json(
        { ok: false, error: "教室名と都道府県は必ず入力してください" },
        { status: 400 },
      );
    }
    Object.assign(payload, {
      name,
      prefecture,
      city: str(body.city, 40),
      address: str(body.address, 200),
      schedule: str(body.schedule, 120),
      target: str(body.target, 120),
      ageGroups: ages(body.ageGroups),
      fee: str(body.fee, 80),
      contact: str(body.contact, 200),
      officialUrl: str(body.officialUrl, 300),
      description: str(body.description, 1000),
    });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "ただいま受付の準備中です。少し時間をおいてためしてください。" },
      { status: 503 },
    );
  }

  const { error } = await admin.from("submissions").insert({
    kind,
    status: "pending",
    payload,
    submitter_name: str(body.submitterName, 80),
    submitter_contact: str(body.submitterContact, 200),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "保存に失敗しました。時間をおいてためしてください。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
