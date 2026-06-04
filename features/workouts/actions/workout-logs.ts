"use server";

import { revalidatePath } from "next/cache";

import { workoutLogFormSchema } from "@/features/workouts/schemas/workout-log-schema";
import type { WorkoutLogActionState } from "@/features/workouts/types/workout-log";
import { createClient } from "@/lib/supabase/server";

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
}

function getWorkoutLogId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return null;
  }

  return id;
}

function mapWorkoutLogMutationError(error: { code?: string }) {
  if (error.code === "42501") {
    return "トレーニング記録を保存できませんでした。ログイン状態またはデータベースの権限設定を確認してください。";
  }

  return "トレーニング記録を保存できませんでした。";
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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      error: "ログイン状態を確認できませんでした。もう一度ログインしてください。",
      success: null
    };
  }

  const { error } = await supabase.from("workout_logs").insert({
    exercise_id: parsed.data.exerciseId,
    trained_at: parsed.data.trainedAt,
    weight: parsed.data.weight,
    sets: parsed.data.sets,
    reps: parsed.data.reps,
    memo: parsed.data.memo,
    user_id: userData.user.id
  });

  if (error) {
    console.error("Failed to create workout log", error);

    return {
      error: mapWorkoutLogMutationError(error),
      success: null
    };
  }

  revalidatePath("/workouts");

  return {
    error: null,
    success: "トレーニング記録を保存しました。"
  };
}

export async function updateWorkoutLog(
  _previousState: WorkoutLogActionState,
  formData: FormData
): Promise<WorkoutLogActionState> {
  const id = getWorkoutLogId(formData);

  if (!id) {
    return {
      error: "更新するトレーニング記録を選択してください。",
      success: null
    };
  }

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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      error: "ログイン状態を確認できませんでした。もう一度ログインしてください。",
      success: null
    };
  }

  const { error } = await supabase
    .from("workout_logs")
    .update({
      exercise_id: parsed.data.exerciseId,
      trained_at: parsed.data.trainedAt,
      weight: parsed.data.weight,
      sets: parsed.data.sets,
      reps: parsed.data.reps,
      memo: parsed.data.memo,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Failed to update workout log", error);

    return {
      error: mapWorkoutLogMutationError(error),
      success: null
    };
  }

  revalidatePath("/workouts");

  return {
    error: null,
    success: "トレーニング記録を更新しました。"
  };
}

export async function deleteWorkoutLog(formData: FormData) {
  const id = getWorkoutLogId(formData);

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return;
  }

  await supabase.from("workout_logs").delete().eq("id", id).eq("user_id", userData.user.id);

  revalidatePath("/workouts");
}
