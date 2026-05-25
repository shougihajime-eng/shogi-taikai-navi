# 将棋大会ナビ（shogi-taikai-navi）

小学生・中学生・高校生の **将棋大会** と **将棋教室** を、全国からまとめて
かんたんにさがせる案内サイト。子どもにも分かりやすい見た目を大事にしている。

---

## 進捗（いまここ）

- ✅ 済み：サイト完成・本番公開ずみ（https://shogi-taikai-navi.vercel.app）。
  全画面・毎朝4時の自動更新・Supabase本物データ投入、本番で全ページ動作＆自動更新の成功を確認
- 🟡 進行中：（なし。初版リリース完了）
- 🔜 次の一歩：大会・教室を増やす（`src/lib/seed.ts` に追記）／RSS等の自動取得元を足す

---

## どんなサイトか（ユーザー向けのやさしい説明）

- トップで「大会をさがす／教室をさがす」の大きなボタンから入れる
- 学年（小・中・高）と地域（都道府県）でしぼりこめる
- 開催が近い大会から順にならぶ。「あと3日」「開催中！」などが出る
- **毎朝4時ごろ**に自動で見なおし、終わって古くなった大会をお片付けする
- 情報はあくまで案内。**参加前にかならず公式ページで確認**する注意書きを各所に出している

---

## 技術構成

- フロント：Next.js 16（App Router）+ React 19 + TypeScript + Tailwind CSS v4
- フォント：見出し=Zen Maru Gothic（まるい）／本文=Noto Sans JP
- データ：共有 Supabase（スキーマ **`shogi_taikai_navi`**）
  - URL：`https://eqkaaohdbqefuszxwqzr.supabase.co`
  - テーブル：`tournaments`（大会）／`classes`（教室）／`sources`（収集元設定）
  - RLS：だれでも読める／書き込みは service_role（自動更新）だけ
  - Exposed schemas に `shogi_taikai_navi` 追加済み
- 自動更新：Vercel Cron `0 19 * * *`（UTC）＝**日本時間4時**。`/api/cron/refresh` を呼ぶ
- 公開：Vercel（GitHub main 自動デプロイ予定）

### 自動収集についての正直な前提（重要）

日本将棋連盟など多くの公式サイトは **ロボットによる自動取得を拒否**している
（アクセスすると 503 が返る）。これを無理に突破するのは規約違反なので **行わない**。
そのため自動更新は次の確実な処理を毎朝行う：

1. 厳選した全国の有名なこども大会・教室一覧（`src/lib/seed.ts`）を最新化（upsert）
2. 開催から60日以上たった古い大会をお片付け（delete）
3. 将来、機械が読める形（RSS / iCal / 公開API）の取得元を `sources` に足せば取り込める拡張ポイントあり

新しい大会・教室を増やすときは **`src/lib/seed.ts` に追記**し、自動更新が走れば本番DBに反映される。

---

## 主要ファイル

| 場所 | 役割 |
|---|---|
| `src/app/page.tsx` | トップページ |
| `src/app/taikai/` | 大会の一覧・詳細 |
| `src/app/kyoshitsu/` | 教室の一覧・詳細 |
| `src/app/about/page.tsx` | このサイトについて |
| `src/app/api/cron/refresh/route.ts` | 毎朝4時に呼ばれる自動更新API |
| `src/lib/seed.ts` | 大会・教室の元データ（ここを編集して増やす） |
| `src/lib/data.ts` | DB or 見本データから取り出す処理 |
| `src/lib/collectors/index.ts` | 自動更新の中身（upsert＋お片付け） |
| `supabase/migrations/0001_init.sql` | DBの設計図（スキーマ・表・権限） |

---

## 環境変数

`.env.example` 参照。`.env.local`（git対象外）と Vercel の両方に入れる。

- `NEXT_PUBLIC_SUPABASE_URL` … 共有 Supabase の URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` … 公開鍵（ブラウザ配布OK）
- `SUPABASE_SERVICE_ROLE_KEY` … 書き込み用の秘密鍵（**git禁止**。Vercelと.env.localのみ）
- `CRON_SECRET` … 自動更新APIのいたずら防止の合言葉

---

## 検証コマンド

```bash
npm run dev      # 開発（http://localhost:3000）
npm run build    # 書き出し（型チェック込み）
npm start        # 本番と同じ状態で起動

# 自動更新を手で1回試す（CRON_SECRET は .env.local の値）
curl "http://localhost:3000/api/cron/refresh?key=<CRON_SECRET>"
```

---

## 本番URL

- 公開URL：https://shogi-taikai-navi.vercel.app
- GitHub：https://github.com/shougihajime-eng/shogi-taikai-navi
- Vercel：shougihajime-3368s-projects/shogi-taikai-navi（GitHub main へ push で自動公開）
- 自動更新を手動で1回動かす：`https://shogi-taikai-navi.vercel.app/api/cron/refresh?key=<CRON_SECRET>`
  （CRON_SECRET は `.env.local` と Vercel 環境変数にある。git には無い）
