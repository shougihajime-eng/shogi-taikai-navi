import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* eslint-disable @typescript-eslint/no-explicit-any */
function str(v: any, max = 1000): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.slice(0, max);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * 「情報がちがう・古い」報告を受け取るAPI。
 * submissions テーブルに kind='report' として保存する。
 * 報告は確認用に保存されるだけで、承認しても公開されない（admin側で approve を拒否）。
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "データの形がただしくありません" }, { status: 400 });
  }

  // ロボット対策（人には見えない項目。入っていたら成功風に返して捨てる）
  if (str(body.website)) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  const message = str(body.message, 1000);
  if (!message) {
    return NextResponse.json({ ok: false, error: "内容を入力してください" }, { status: 400 });
  }

  const targetType = body.targetType === "class" ? "class" : "tournament";
  const payload = {
    targetType,
    targetId: str(body.targetId, 80),
    targetTitle: str(body.targetTitle, 200),
    message,
  };

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "ただいま受付の準備中です。少し時間をおいてためしてください。" },
      { status: 503 },
    );
  }

  const { error } = await admin.from("submissions").insert({
    kind: "report",
    status: "pending",
    payload,
    submitter_contact: str(body.contact, 200),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "保存に失敗しました。時間をおいてためしてください。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
