import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export default function GoalsPage() {
  return (
    <PlaceholderPage
      title="目標"
      description="種目ごとの目標重量を設定し、現在の最大重量との差を確認します。"
      actionLabel="目標を追加"
      cards={[
        {
          title: "目標重量",
          description: "種目ごとに目標重量を設定します。"
        },
        {
          title: "達成率",
          description: "現在の最大重量と目標重量から達成率を表示します。"
        }
      ]}
    />
  );
}
