"use server";

import { revalidatePath } from "next/cache";

import { workoutLogFormSchema } from "@/features/workouts/schemas/workout-log-schema";
import {
  initialWorkoutLogActionState,
  type WorkoutLogActionState
} from "@/features/workouts/types/workout-log";
import { createClient } from "@/lib/supabase/server";

export { initialWorkoutLogActionState };

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
}

export async function createWorkoutLog(
  _previousState: WorkoutLogActionState,
  formData: FormData
): Promise<WorkoutLogActionState> {
  const parsed = workoutLogFormSchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    trainedAt: formData.get("trainedAt"),
    weight: formData.get("weight"),
    sets: formData.get("sets"),
    reps: formData.get("reps"),
    memo: formData.get("memo")
  });

  if (!parsed.success) {
    return {
      error: getFirstValidationMessage(parsed.error.issues[0]?.message),
      success: null
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("workout_logs").insert({
    exercise_id: parsed.data.exerciseId,
    trained_at: parsed.data.trainedAt,
    weight: parsed.data.weight,
    sets: parsed.data.sets,
    reps: parsed.data.reps,
    memo: parsed.data.memo
  });

  if (error) {
    return {
      error: "トレーニング記録を保存できませんでした。",
      success: null
    };
  }

  revalidatePath("/workouts");

  return {
    error: null,
    success: "トレーニング記録を保存しました。"
  };
}
