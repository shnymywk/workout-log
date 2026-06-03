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
