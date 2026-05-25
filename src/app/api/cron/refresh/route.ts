import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { runDailyRefresh } from "@/lib/collectors";

// このAPIは毎朝Vercelの自動実行から呼ばれる。常に最新で動かすため固定キャッシュしない。
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// 念のため少し長めの実行時間を許可
export const maxDuration = 60;

/**
 * 毎朝4時（日本時間）の自動更新エンドポイント。
 * Vercel Cron から呼ばれる。CRON_SECRET を設定している場合は、
 * その合言葉が一致したときだけ実行する（いたずら防止）。
 */
export async function GET(request: Request) {
  // --- 合言葉チェック ---
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    const url = new URL(request.url);
    const keyParam = url.searchParams.get("key");
    const ok = auth === `Bearer ${secret}` || keyParam === secret;
    if (!ok) {
      return NextResponse.json({ ok: false, error: "みとめられていません" }, { status: 401 });
    }
  }

  // --- 書き込み用の接続（service_role）---
  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        message:
          "データの保管場所（Supabase）がまだ設定されていません。環境変数 SUPABASE_SERVICE_ROLE_KEY を入れると自動更新が動きます。",
      },
      { status: 200 },
    );
  }

  try {
    const result = await runDailyRefresh(admin);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
