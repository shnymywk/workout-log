import type { LucideIcon } from "lucide-react";
import { BarChart3, Dumbbell, ListChecks, Target } from "lucide-react";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
};

export const appNavigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: BarChart3,
    label: "ダッシュボード",
    description: "頻度とボリュームを確認"
  },
  {
    href: "/workouts",
    icon: ListChecks,
    label: "記録",
    description: "日々のトレーニングを管理"
  },
  {
    href: "/exercises",
    icon: Dumbbell,
    label: "種目",
    description: "種目と部位を整理"
  },
  {
    href: "/goals",
    icon: Target,
    label: "目標",
    description: "目標重量と達成率を確認"
  }
];
