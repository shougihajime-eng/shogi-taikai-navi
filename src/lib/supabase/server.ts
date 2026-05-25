import { createClient } from "@supabase/supabase-js";

const SCHEMA = "shogi_taikai_navi";

/**
 * 画面の表示用（読み取り専用）の Supabase 接続。
 * 公開鍵（anon key）を使う。保護は Supabase 側の RLS（行ごとの権限）で行う。
 *
 * 環境変数が未設定のときは null を返し、呼び出し側は見本データに切り替える。
 */
export function getReadClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    db: { schema: SCHEMA },
    auth: { persistSession: false },
  });
}
