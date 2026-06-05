import { createClient } from "@/lib/supabase/server";
import type { WorkoutLog, WorkoutLogFilters } from "@/features/workouts/types/workout-log";

type WorkoutLogsResult = {
  workoutLogs: WorkoutLog[];
  error: string | null;
};

type WorkoutLogRow = {
  id: string;
  exercise_id: string;
  trained_at: string;
  weight: number;
  sets: number;
  reps: number;
  memo: string | null;
  created_at: string;
  exercises: {
    name: string;
  } | null;
  workout_log_sets: {
    id: string;
    set_number: number;
    weight: number;
    reps: number;
  }[];
};

export async function getWorkoutLogs(filters: WorkoutLogFilters = {}): Promise<WorkoutLogsResult> {
  const supabase = await createClient();
  let query = supabase
    .from("workout_logs")
    .select(
      `
        id,
        exercise_id,
        trained_at,
        weight,
        sets,
        reps,
        memo,
        created_at,
        exercises (
          name
        ),
        workout_log_sets (
          id,
          set_number,
          weight,
          reps
        )
      `
    )
    .order("trained_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.trainedAt) {
    query = query.eq("trained_at", filters.trainedAt);
  }

  if (filters.exerciseId) {
    query = query.eq("exercise_id", filters.exerciseId);
  }

  const { data, error } = await query.returns<WorkoutLogRow[]>();

  if (error) {
    return {
      workoutLogs: [],
      error: "トレーニング記録を取得できませんでした。"
    };
  }

  return {
    workoutLogs: data.map((workoutLog) => ({
      id: workoutLog.id,
      exercise_id: workoutLog.exercise_id,
      trained_at: workoutLog.trained_at,
      weight: workoutLog.weight,
      sets: workoutLog.sets,
      reps: workoutLog.reps,
      memo: workoutLog.memo,
      created_at: workoutLog.created_at,
      exercise_name: workoutLog.exercises?.name ?? "未設定の種目",
      workout_log_sets: workoutLog.workout_log_sets.sort(
        (firstSet, secondSet) => firstSet.set_number - secondSet.set_number
      )
    })),
    error: null
  };
}
