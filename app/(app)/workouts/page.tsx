import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function WorkoutsPage() {
  return (
    <PlaceholderPage
      title="記録"
      description="日付、種目、重量、セット数、回数、メモを記録します。"
      actionLabel="記録を追加"
      cards={[
        {
          title: "トレーニング一覧",
          description: "記録の表示、編集、削除を行います。"
        },
        {
          title: "入力フォーム",
          description: "前回の内容を見ながら新しい記録を登録します。"
        }
      ]}
    />
  );
}
