import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 申請の確認・承認（Claude が運用で使う非公開API）。
 * 合言葉（CRON_SECRET）が一致したときだけ使える。公開ページではない。
 *
 *  GET  /api/admin/submissions?key=SECRET&status=pending
 *       → 確認待ちの申請一覧を返す
 *  POST /api/admin/submissions?key=SECRET   body: { id, action: "approve" | "reject" }
 *       → 承認（公開）または却下する
 */

function authed(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // 合言葉未設定なら使わせない
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const auth = request.headers.get("authorization");
  return key === secret || auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authed(request)) return NextResponse.json({ ok: false, error: "みとめられていません" }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "DB未設定" }, { status: 503 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";

  const { data, error } = await admin
    .from("submissions")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: data?.length ?? 0, submissions: data });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function tournamentRowFromPayload(p: any) {
  const eventDate = p.eventDate || null;
  return {
    id: "sub-" + crypto.randomUUID().slice(0, 8),
    title: p.title,
    organizer: p.organizer || "主催未記入",
    organizer_type: "other",
    prefecture: p.prefecture,
    city: p.city || null,
    venue: p.venue || null,
    event_date: eventDate,
    age_groups: Array.isArray(p.ageGroups) ? p.ageGroups : [],
    grade_detail: p.gradeDetail || null,
    fee: p.fee || null,
    official_url: p.officialUrl || null,
    description: p.description || null,
    is_recurring: false,
    nationwide: false,
    source_name: "みんなの申請",
    source_kind: "submission",
  };
}

function classRowFromPayload(p: any) {
  return {
    id: "sub-" + crypto.randomUUID().slice(0, 8),
    name: p.name,
    prefecture: p.prefecture,
    city: p.city || null,
    address: p.address || null,
    schedule: p.schedule || null,
    target: p.target || null,
    age_groups: Array.isArray(p.ageGroups) ? p.ageGroups : [],
    fee: p.fee || null,
    contact: p.contact || null,
    official_url: p.officialUrl || null,
    description: p.description || null,
    source_name: "みんなの申請",
    source_kind: "submission",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function POST(request: Request) {
  if (!authed(request)) return NextResponse.json({ ok: false, error: "みとめられていません" }, { status: 401 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ ok: false, error: "DB未設定" }, { status: 503 });

  let body: { id?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "形がただしくありません" }, { status: 400 });
  }
  if (!body.id || (body.action !== "approve" && body.action !== "reject")) {
    return NextResponse.json({ ok: false, error: "id と action(approve/reject) が必要です" }, { status: 400 });
  }

  const { data: sub, error: getErr } = await admin
    .from("submissions")
    .select("*")
    .eq("id", body.id)
    .maybeSingle();
  if (getErr) return NextResponse.json({ ok: false, error: getErr.message }, { status: 500 });
  if (!sub) return NextResponse.json({ ok: false, error: "その申請は見つかりません" }, { status: 404 });

  if (body.action === "reject") {
    await admin.from("submissions").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", body.id);
    return NextResponse.json({ ok: true, action: "rejected" });
  }

  // approve → 公開テーブルへ反映（大会・教室でテーブルを分ける）
  let publishedTable: string;
  let publishedId: string;
  if (sub.kind === "class") {
    const row = classRowFromPayload(sub.payload);
    const { error: insErr } = await admin.from("classes").insert(row);
    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
    publishedTable = "classes";
    publishedId = row.id;
  } else {
    const row = tournamentRowFromPayload(sub.payload);
    const { error: insErr } = await admin.from("tournaments").insert(row);
    if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
    publishedTable = "tournaments";
    publishedId = row.id;
  }

  await admin.from("submissions").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", body.id);
  return NextResponse.json({ ok: true, action: "approved", published: { table: publishedTable, id: publishedId } });
}
