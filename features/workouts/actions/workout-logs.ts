"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { workoutLogFormSchema } from "@/features/workouts/schemas/workout-log-schema";
import type { WorkoutLogActionState } from "@/features/workouts/types/workout-log";
import { createClient } from "@/lib/supabase/server";
import type { Database, TablesInsert } from "@/types/database";

type Supabase = SupabaseClient<Database>;
type WorkoutLogSetInsert = TablesInsert<"workout_log_sets">;

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

function buildWorkoutLogSetRows({
  reps,
  sets,
  userId,
  weight,
  workoutLogId
}: {
  reps: number;
  sets: number;
  userId: string;
  weight: number;
  workoutLogId: string;
}): WorkoutLogSetInsert[] {
  return Array.from({ length: sets }, (_, index) => ({
    workout_log_id: workoutLogId,
    user_id: userId,
    set_number: index + 1,
    weight,
    reps
  }));
}

async function createWorkoutLogSets({
  reps,
  sets,
  supabase,
  userId,
  weight,
  workoutLogId
}: {
  reps: number;
  sets: number;
  supabase: Supabase;
  userId: string;
  weight: number;
  workoutLogId: string;
}) {
  return supabase.from("workout_log_sets").insert(
    buildWorkoutLogSetRows({
      reps,
      sets,
      userId,
      weight,
      workoutLogId
    })
  );
}

async function syncWorkoutLogSets({
  reps,
  sets,
  supabase,
  userId,
  weight,
  workoutLogId
}: {
  reps: number;
  sets: number;
  supabase: Supabase;
  userId: string;
  weight: number;
  workoutLogId: string;
}) {
  const { error: upsertError } = await supabase.from("workout_log_sets").upsert(
    buildWorkoutLogSetRows({
      reps,
      sets,
      userId,
      weight,
      workoutLogId
    }),
    { onConflict: "workout_log_id,set_number" }
  );

  if (upsertError) {
    return upsertError;
  }

  const { error: deleteError } = await supabase
    .from("workout_log_sets")
    .delete()
    .eq("workout_log_id", workoutLogId)
    .eq("user_id", userId)
    .gt("set_number", sets);

  return deleteError;
}

function revalidateWorkoutLogPages() {
  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  revalidatePath("/goals");
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

  const { data: workoutLog, error } = await supabase
    .from("workout_logs")
    .insert({
      exercise_id: parsed.data.exerciseId,
      trained_at: parsed.data.trainedAt,
      weight: parsed.data.weight,
      sets: parsed.data.sets,
      reps: parsed.data.reps,
      memo: parsed.data.memo,
      user_id: userData.user.id
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create workout log", error);

    return {
      error: mapWorkoutLogMutationError(error),
      success: null
    };
  }

  const { error: workoutLogSetsError } = await createWorkoutLogSets({
    reps: parsed.data.reps,
    sets: parsed.data.sets,
    supabase,
    userId: userData.user.id,
    weight: parsed.data.weight,
    workoutLogId: workoutLog.id
  });

  if (workoutLogSetsError) {
    console.error("Failed to create workout log sets", workoutLogSetsError);
    await supabase
      .from("workout_logs")
      .delete()
      .eq("id", workoutLog.id)
      .eq("user_id", userData.user.id);

    return {
      error: mapWorkoutLogMutationError(workoutLogSetsError),
      success: null
    };
  }

  revalidateWorkoutLogPages();

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

  const workoutLogSetsError = await syncWorkoutLogSets({
    reps: parsed.data.reps,
    sets: parsed.data.sets,
    supabase,
    userId: userData.user.id,
    weight: parsed.data.weight,
    workoutLogId: id
  });

  if (workoutLogSetsError) {
    console.error("Failed to update workout log sets", workoutLogSetsError);

    return {
      error: mapWorkoutLogMutationError(workoutLogSetsError),
      success: null
    };
  }

  revalidateWorkoutLogPages();

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

  revalidateWorkoutLogPages();
}
