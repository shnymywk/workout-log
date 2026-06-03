import type { Tables } from "@/types/database";

export type WorkoutLogActionState = {
  error: string | null;
  success: string | null;
};

export const initialWorkoutLogActionState: WorkoutLogActionState = {
  error: null,
  success: null
};

export type WorkoutLog = Pick<
  Tables<"workout_logs">,
  "id" | "exercise_id" | "trained_at" | "weight" | "sets" | "reps" | "memo" | "created_at"
> & {
  exercise_name: string;
};

export type WorkoutLogFilters = {
  trainedAt?: string | null;
  exerciseId?: string | null;
};
