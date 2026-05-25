# 将棋大会ナビ（shogi-taikai-navi）

小学生・中学生・高校生の **将棋大会** と **将棋教室** を、全国からまとめて
かんたんにさがせる案内サイト。子どもにも分かりやすい見た目を大事にしている。

---

## 進捗（いまここ）

- ✅ 済み：本気版リリース。正直な本物データ（毎年開催の全国主要大会8＋実在教室2）、
  みんなの申請フォーム＋承認の仕組み、SNS共有画像・検索対策。本番で申請→承認→公開まで動作確認ずみ
- 🟡 進行中：（なし。本気版リリース完了。これからは申請が来たら承認していく運用フェーズ）
- 🔜 次の一歩：申請が来たら確認・承認（下記「申請の確認方法」）／必要なら全国主要大会をさらに追加

> ⚠️ データ方針：**うその日付は出さない**。土台は「毎年開催の実在大会」のみ。
> 地域の大会・教室は**みんなの申請（確認後に公開）**で増やす。

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

### データの集め方（本気版の方針）

日本将棋連盟など多くの公式サイトは **ロボットによる自動取得を拒否**している（503）。
無理な突破は規約違反なので行わない。よってデータは2本立て：

1. **土台（system）**：毎年ひらかれる実在の全国主要大会＝`src/lib/seed.ts`。日付は出さず
   「毎年◯月ごろ・今年は公式で確認」表示（`isRecurring`/`recurrenceNote`/`nationwide`）。
   毎朝の自動更新で upsert＋古い大会のお片付け。土台から外すと自動で消える。
2. **みんなの申請（submission）**：公開フォーム `/toroku` → `submissions`(pending) →
   **確認後に承認したものだけ**公開。地域の大会・教室はこれで増やす。

### 申請の確認方法（Claude が運用で使う・重要）

管理ページは作っていない。**申請の確認・承認は Claude（私）が API 経由で行う**。
本人が「申請ある？／申請を確認して」と言ったら、次を実行する（`<SECRET>` は Vercel/.env.local の `CRON_SECRET`）：

```bash
# 確認待ち一覧を見る
curl "https://shogi-taikai-navi.vercel.app/api/admin/submissions?key=<SECRET>&status=pending"
# 承認して公開（id は上の一覧から）
curl -X POST "https://shogi-taikai-navi.vercel.app/api/admin/submissions?key=<SECRET>" \
  -H "Content-Type: application/json" -d '{"id":"<申請ID>","action":"approve"}'
# 却下（公開しない）
curl -X POST "https://shogi-taikai-navi.vercel.app/api/admin/submissions?key=<SECRET>" \
  -H "Content-Type: application/json" -d '{"id":"<申請ID>","action":"reject"}'
```

※ 日本語をシェルの `-d` で送ると文字化けすることがある。確認・承認は **Node スクリプト（fetch）** で
行うと確実（`JSON.stringify` で正しい UTF-8 になる）。本番でこの方式での疎通確認ずみ。

---

## 主要ファイル

| 場所 | 役割 |
|---|---|
| `src/app/page.tsx` | トップページ |
| `src/app/taikai/` | 大会の一覧・詳細 |
| `src/app/kyoshitsu/` | 教室の一覧・詳細 |
| `src/app/about/page.tsx` | このサイトについて |
| `src/app/toroku/page.tsx` + `src/components/SubmitForm.tsx` | みんなの申請フォーム（公開） |
| `src/app/api/submit/route.ts` | 申請の受け取り（pending保存・honeypot） |
| `src/app/api/admin/submissions/route.ts` | 申請の確認・承認（合言葉で保護・Claude運用） |
| `src/app/api/cron/refresh/route.ts` | 毎朝4時に呼ばれる自動更新API |
| `src/app/opengraph-image.tsx` / `sitemap.ts` / `robots.ts` | SNS共有画像・検索対策 |
| `src/lib/seed.ts` | 土台データ（毎年開催の全国主要大会。ここを編集して増やす） |
| `src/lib/data.ts` | DB or 見本データから取り出す処理 |
| `src/lib/collectors/index.ts` | 自動更新の中身（upsert＋お片付け＋土台の同期） |
| `supabase/migrations/*.sql` | DBの設計図（0001=基本、0002=毎年開催＋申請） |

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
