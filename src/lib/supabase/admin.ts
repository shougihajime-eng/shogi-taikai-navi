import { createClient } from "@supabase/supabase-js";

const SCHEMA = "shogi_taikai_navi";

/**
 * 書き込み用（毎朝の自動更新だけが使う）の Supabase 接続。
 * service_role key を使うため、サーバー側（cron / API）だけで呼ぶこと。
 * このキーは .env.local と Vercel の環境変数にだけ置き、git には絶対に入れない。
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    db: { schema: SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
