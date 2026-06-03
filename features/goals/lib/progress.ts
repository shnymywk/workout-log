import { createClient } from "@/lib/supabase/server";

type MaxWeightsResult = {
  maxWeightsByExerciseId: Map<string, number>;
  error: string | null;
};

type WorkoutWeightRow = {
  exercise_id: string;
  weight: number;
};

export function calculateAchievementRate(currentMaxWeight: number | null, targetWeight: number) {
  if (currentMaxWeight === null || currentMaxWeight <= 0 || targetWeight <= 0) {
    return null;
  }

  return Math.min(Math.round((currentMaxWeight / targetWeight) * 100), 999);
}

export async function getMaxWeightsByExerciseId(): Promise<MaxWeightsResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_logs")
    .select("exercise_id, weight")
    .returns<WorkoutWeightRow[]>();

  if (error) {
    return {
      maxWeightsByExerciseId: new Map(),
      error: "現在の最大重量を取得できませんでした。"
    };
  }

  const maxWeightsByExerciseId = data.reduce<Map<string, number>>((accumulator, row) => {
    const currentWeight = accumulator.get(row.exercise_id) ?? 0;

    if (row.weight > currentWeight) {
      accumulator.set(row.exercise_id, row.weight);
    }

    return accumulator;
  }, new Map());

  return {
    maxWeightsByExerciseId,
    error: null
  };
}
