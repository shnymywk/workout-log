# Workout Log

Workout Log は、日々のトレーニング記録、種目管理、目標重量、ダッシュボード分析をまとめて扱うWebアプリです。

Next.js App Router、TypeScript、styled-components、Supabase Auth / Database を使い、ポートフォリオとして設計意図や実装方針を説明しやすい構成を意識して作成しています。

## 作成意図

トレーニング記録アプリは、CRUD、認証、集計、グラフ表示、レスポンシブUIなど、Webアプリ開発でよく使う要素を自然に含みます。

このリポジトリでは、単に画面を作るだけでなく、以下を重視しています。

- 機能単位で責務を分けたディレクトリ構成
- Server Components / Client Components の境界整理
- Supabase RLS を前提にしたユーザーごとのデータ分離
- Zod と TypeScript による入力値・DB境界の型安全性
- styled-components による小さなUIプリミティブの積み上げ
- 集計ロジックや表示コンポーネントのテスト

## 技術スタック

| 領域            | 使用技術                         |
| --------------- | -------------------------------- |
| フレームワーク  | Next.js App Router               |
| 言語            | TypeScript                       |
| UI              | React, styled-components         |
| グラフ          | Recharts                         |
| バックエンド    | Supabase Auth, Supabase Database |
| バリデーション  | Zod                              |
| テスト          | Jest, React Testing Library      |
| 静的解析 / 整形 | ESLint, Prettier                 |
| デプロイ想定    | Vercel                           |

### 技術選定の理由

Next.js App Router は、認証後のアプリ画面と公開ページを同じリポジトリで扱いやすく、Server Components を使ってデータ取得の責務をページ側に寄せやすいため採用しています。

Supabase は Auth、PostgreSQL、RLS をまとめて扱えるため、小さな個人開発アプリでもユーザーごとのデータ分離を実装しやすい点を重視しました。

UI は Tailwind CSS や shadcn/ui を使わず、styled-components で小さなプリミティブを作っています。デザイントークンを `lib/styles/theme.ts` に集約し、ボタン、カード、フォーム、空状態、ローディング表示などをアプリ内で再利用できる形にしています。

## アプリ構成

```txt
app/
  (auth)/
    login/
  (app)/
    dashboard/
    exercises/
    goals/
    workouts/
components/
  layout/
  primitives/
features/
  auth/
  dashboard/
  exercises/
  goals/
  workouts/
lib/
  styles/
  supabase/
supabase/
  migrations/
types/
  database.ts
```

ページコンポーネントは薄く保ち、実際のUI、Server Actions、集計ロジック、型定義、テストは `features/` 配下に機能単位でまとめています。
