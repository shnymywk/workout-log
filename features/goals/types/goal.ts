import type { Tables } from "@/types/database";

export type GoalActionState = {
  error: string | null;
  success: string | null;
};

export const initialGoalActionState: GoalActionState = {
  error: null,
  success: null
};

export type Goal = Pick<
  Tables<"goals">,
  "id" | "exercise_id" | "target_weight" | "created_at" | "updated_at"
> & {
  exercise_name: string;
};

export type GoalProgress = {
  goal: Goal;
  currentMaxWeight: number | null;
  achievementRate: number | null;
};
