import { createClient } from "@/lib/supabase/server";
import type { Goal } from "@/features/goals/types/goal";

type GoalsResult = {
  goals: Goal[];
  error: string | null;
};

type GoalRow = {
  id: string;
  exercise_id: string;
  target_weight: number;
  created_at: string;
  updated_at: string;
  exercises: {
    name: string;
  } | null;
};

export async function getGoals(): Promise<GoalsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("goals")
    .select(
      `
        id,
        exercise_id,
        target_weight,
        created_at,
        updated_at,
        exercises (
          name
        )
      `
    )
    .order("created_at", { ascending: true })
    .returns<GoalRow[]>();

  if (error) {
    return {
      goals: [],
      error: "目標一覧を取得できませんでした。"
    };
  }

  return {
    goals: data.map((goal) => ({
      id: goal.id,
      exercise_id: goal.exercise_id,
      target_weight: goal.target_weight,
      created_at: goal.created_at,
      updated_at: goal.updated_at,
      exercise_name: goal.exercises?.name ?? "未設定の種目"
    })),
    error: null
  };
}
