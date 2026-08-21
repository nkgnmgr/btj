# 公開手順（GitHub連携 × Cloudflare Pages + R2 + Supabase）

GitHubにプッシュ → Cloudflare Pagesが自動でビルド＆公開する方式の手順です。

## 0. GitHubへのプッシュについて（重要）

このフォルダ（artifacts/before-trip-to-japan）は単体で動くようになっています。
**リポジトリのルートにこのフォルダの中身が来るように**プッシュしてください。
（例: ローカルで `artifacts/before-trip-to-japan` の中身だけを新しいリポジトリにコピーしてプッシュ）

## 1. Supabase の準備（1回だけ・済んでいればスキップ）

1. https://supabase.com/dashboard で「New project」
2. **SQL Editor** → `supabase-setup.sql` の中身を貼り付けて **Run**
3. 最後の「管理者の登録」のコメントを外し、自分のメールに書き換えて実行
4. **Authentication → Users → Add user** で管理者メール＋パスワード登録（Auto Confirm Userにチェック）
5. **Project Settings → API** で「Project URL」と「anon public」キーをメモ

## 2. Cloudflare R2 の準備（1回だけ）

1. Cloudflare ダッシュボード → **R2** → バケット作成（名前: `btj-image`）
2. バケットの **Settings → Public access → R2.dev subdomain → Allow**
   表示されるURL（例: `https://pub-xxxx.r2.dev`）をメモ

## 3. Cloudflare Pages と GitHub を連携

1. Cloudflare ダッシュボード → **Workers & Pages → Create → Pages → Connect to Git**
2. プッシュしたリポジトリを選択
3. ビルド設定:
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist/public`
4. **Environment variables**（ビルド用）に追加:
   - `BASE_PATH` = `/`
   - `PORT` = `3000`
   - `VITE_SUPABASE_URL` = SupabaseのProject URL
   - `VITE_SUPABASE_ANON_KEY` = anonキー
5. 「Save and Deploy」

## 4. Pages プロジェクトの設定（1回だけ）

デプロイ後、プロジェクトの **Settings**:

- **Bindings → R2 bucket**: 変数名 `BUCKET` → バケット `btj-image`
- **Environment variables**（Functions用）に追加:
  - `PUBLIC_R2_URL` = 手順2のR2.dev URL
  - `SUPABASE_URL` = Supabase Project URL
  - `SUPABASE_ANON_KEY` = anonキー

設定後、**Deployments → Retry deployment**（または空コミットをプッシュ）で反映。

## 5. 「サイトを再公開」ボタンの設定（Deploy Hook）

1. Pagesプロジェクト → **Settings → Builds & deployments → Deploy hooks → Add deploy hook**
   （名前は自由、ブランチは main）
2. 発行されたURLをコピー
3. **Environment variables** に `DEPLOY_HOOK_URL` = そのURL を追加（Secret推奨）
4. 再デプロイ後、管理画面の「Republish site」ボタンで再ビルド＆再公開できます

※ ページの追加・編集は保存すればすぐサイトに反映されます。このボタンは
「検索エンジン向けの事前生成HTML」を最新化したいときに押すものです。

## 6. ボット対策（推奨・1回だけ）

コード側で robots.txt・AIクローラー遮断・APIレート制限は入っていますが、
Cloudflare側でも以下をONにすると本格的な攻撃対策になります（無料）:

1. **Security → Bots → Bot Fight Mode** を ON
2. **Security → Settings → Security Level** を「Medium」以上に
3. （任意）**Security → WAF → Rate limiting rules** で `/api/*` に制限ルール

※ Googlebot や Bingbot などの検索エンジンはブロックされません。

## 7. 使い方

- 公開サイト: `https://あなたのプロジェクト.pages.dev/`
- 管理画面: `https://あなたのプロジェクト.pages.dev/admin`
  - 手順1で登録したメール＋パスワードでログイン
  - 初回は「Import current site content」で既存ページを取り込み
  - ページの追加・編集・下書き・並び替え・画像挿入・再公開ができます
- 以後の更新: GitHubにプッシュすれば自動で再ビルド＆公開されます
