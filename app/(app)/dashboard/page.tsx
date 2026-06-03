import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="ダッシュボード"
      description="週間・月間の頻度、総ボリューム、目標達成率を確認します。"
      cards={[
        {
          title: "週間サマリー",
          description: "直近7日間のトレーニング頻度を表示します。"
        },
        {
          title: "ボリューム推移",
          description: "重量、セット数、回数から総ボリュームを集計します。"
        }
      ]}
    />
  );
}
