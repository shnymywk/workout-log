"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import {
  workoutLogBatchFormSchema,
  workoutLogFormSchema,
  workoutLogSetDetailsFormSchema,
  type WorkoutLogFormInput
} from "@/features/workouts/schemas/workout-log-schema";
import type { WorkoutLogActionState } from "@/features/workouts/types/workout-log";
import { createClient } from "@/lib/supabase/server";
import type { Database, TablesInsert } from "@/types/database";

type Supabase = SupabaseClient<Database>;
type WorkoutLogSetInsert = TablesInsert<"workout_log_sets">;
type WorkoutLogSetDetail = {
  weight: number;
  reps: number;
};

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

function summarizeWorkoutLogSets(setDetails: WorkoutLogSetDetail[]) {
  return {
    weight: Math.max(...setDetails.map((setDetail) => setDetail.weight)),
    sets: setDetails.length,
    reps: Math.max(...setDetails.map((setDetail) => setDetail.reps))
  };
}

function buildRepeatedWorkoutLogSetDetails({
  reps,
  sets,
  weight
}: {
  reps: number;
  sets: number;
  weight: number;
}): WorkoutLogSetDetail[] {
  return Array.from({ length: sets }, () => ({
    weight,
    reps
  }));
}

function buildWorkoutLogSetRows({
  setDetails,
  userId,
  workoutLogId
}: {
  setDetails: WorkoutLogSetDetail[];
  userId: string;
  workoutLogId: string;
}): WorkoutLogSetInsert[] {
  return setDetails.map((setDetail, index) => ({
    workout_log_id: workoutLogId,
    user_id: userId,
    set_number: index + 1,
    weight: setDetail.weight,
    reps: setDetail.reps
  }));
}

async function createWorkoutLogSets({
  setDetails,
  supabase,
  userId,
  workoutLogId
}: {
  setDetails: WorkoutLogSetDetail[];
  supabase: Supabase;
  userId: string;
  workoutLogId: string;
}) {
  return supabase.from("workout_log_sets").insert(
    buildWorkoutLogSetRows({
      setDetails,
      userId,
      workoutLogId
    })
  );
}

async function syncWorkoutLogSets({
  setDetails,
  supabase,
  userId,
  workoutLogId
}: {
  setDetails: WorkoutLogSetDetail[];
  supabase: Supabase;
  userId: string;
  workoutLogId: string;
}) {
  const { error: upsertError } = await supabase.from("workout_log_sets").upsert(
    buildWorkoutLogSetRows({
      setDetails,
      userId,
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
    .gt("set_number", setDetails.length);

  return deleteError;
}

function revalidateWorkoutLogPages() {
  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  revalidatePath("/goals");
}

async function insertWorkoutLogWithSets({
  exerciseId,
  memo,
  setDetails,
  supabase,
  trainedAt,
  userId
}: {
  exerciseId: string;
  memo: string | null;
  setDetails: WorkoutLogSetDetail[];
  supabase: Supabase;
  trainedAt: string;
  userId: string;
}) {
  const summary = summarizeWorkoutLogSets(setDetails);
  const { data: workoutLog, error } = await supabase
    .from("workout_logs")
    .insert({
      exercise_id: exerciseId,
      trained_at: trainedAt,
      weight: summary.weight,
      sets: summary.sets,
      reps: summary.reps,
      memo,
      user_id: userId
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create workout log", error);

    return { error, workoutLogId: null };
  }

  const { error: workoutLogSetsError } = await createWorkoutLogSets({
    setDetails,
    supabase,
    userId,
    workoutLogId: workoutLog.id
  });

  if (workoutLogSetsError) {
    console.error("Failed to create workout log sets", workoutLogSetsError);

    return { error: workoutLogSetsError, workoutLogId: workoutLog.id };
  }

  return { error: null, workoutLogId: workoutLog.id };
}

export async function createWorkoutLog(
  _previousState: WorkoutLogActionState,
  formData: FormData
): Promise<WorkoutLogActionState> {
  const parsed = formData.has("logs")
    ? workoutLogBatchFormSchema.safeParse({
        trainedAt: formData.get("trainedAt"),
        logs: formData.get("logs")
      })
    : workoutLogFormSchema.safeParse({
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

  const createdWorkoutLogIds: string[] = [];
  const workoutLogs = "logs" in parsed.data ? parsed.data.logs : [parsed.data];

  for (const workoutLog of workoutLogs) {
    const setDetails =
      "sets" in workoutLog && Array.isArray(workoutLog.sets)
        ? workoutLog.sets
        : buildRepeatedWorkoutLogSetDetails(workoutLog as WorkoutLogFormInput);
    const result = await insertWorkoutLogWithSets({
      exerciseId: workoutLog.exerciseId,
      memo: workoutLog.memo,
      setDetails,
      supabase,
      trainedAt: parsed.data.trainedAt,
      userId: userData.user.id
    });

    if (result.workoutLogId) {
      createdWorkoutLogIds.push(result.workoutLogId);
    }

    if (result.error) {
      if (createdWorkoutLogIds.length > 0) {
        await supabase
          .from("workout_logs")
          .delete()
          .eq("user_id", userData.user.id)
          .in("id", createdWorkoutLogIds);
      }

      return {
        error: mapWorkoutLogMutationError(result.error),
        success: null
      };
    }
  }

  revalidateWorkoutLogPages();

  return {
    error: null,
    success:
      workoutLogs.length > 1
        ? `${workoutLogs.length}件のトレーニング記録を保存しました。`
        : "トレーニング記録を保存しました。"
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

  const parsed = formData.has("setDetails")
    ? workoutLogSetDetailsFormSchema.safeParse({
        exerciseId: formData.get("exerciseId"),
        trainedAt: formData.get("trainedAt"),
        memo: formData.get("memo"),
        setDetails: formData.get("setDetails")
      })
    : workoutLogFormSchema.safeParse({
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

  const setDetails =
    "setDetails" in parsed.data
      ? parsed.data.setDetails
      : buildRepeatedWorkoutLogSetDetails(parsed.data);
  const summary = summarizeWorkoutLogSets(setDetails);
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
      weight: summary.weight,
      sets: summary.sets,
      reps: summary.reps,
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
    setDetails,
    supabase,
    userId: userData.user.id,
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
