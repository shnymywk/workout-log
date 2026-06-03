export type NavigationItem = {
  href: string;
  label: string;
  description: string;
};

export const appNavigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "ダッシュボード",
    description: "頻度とボリュームを確認"
  },
  {
    href: "/workouts",
    label: "記録",
    description: "日々のトレーニングを管理"
  },
  {
    href: "/exercises",
    label: "種目",
    description: "種目と部位を整理"
  },
  {
    href: "/goals",
    label: "目標",
    description: "目標重量と達成率を確認"
  }
];
