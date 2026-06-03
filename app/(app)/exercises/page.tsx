import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function ExercisesPage() {
  return (
    <PlaceholderPage
      title="種目"
      description="種目と部位を管理し、トレーニング記録の入力を迷わず行えるようにします。"
      actionLabel="種目を追加"
      cards={[
        {
          title: "種目一覧",
          description: "胸、背中、脚などの部位で種目を分類します。"
        },
        {
          title: "部位フィルター",
          description: "部位ごとに種目を絞り込んで確認します。"
        }
      ]}
    />
  );
}
