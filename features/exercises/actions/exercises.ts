"use server";

import { revalidatePath } from "next/cache";

import { exerciseFormSchema } from "@/features/exercises/schemas/exercise-schema";
import type { ExerciseActionState } from "@/features/exercises/types/exercise";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/database";

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
}

function getExerciseId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return null;
  }

  return id;
}

function mapExerciseMutationError(error: { code?: string }) {
  if (error.code === "23505") {
    return "同じ名前の種目がすでに登録されています。";
  }

  if (error.code === "42501") {
    return "種目を保存できませんでした。ログイン状態またはデータベースの権限設定を確認してください。";
  }

  return "種目を保存できませんでした。データベース設定を確認してください。";
}

function getExerciseFormValues(formData: FormData) {
  return {
    name: formData.get("name"),
    bodyPartIds: formData.getAll("bodyPartIds").map((bodyPartId) => String(bodyPartId))
  };
}

async function syncExerciseBodyParts({
  bodyPartIds,
  exerciseId,
  supabase,
  userId
}: {
  bodyPartIds: string[];
  exerciseId: string;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { error: deleteError } = await supabase
    .from("exercise_body_parts")
    .delete()
    .eq("exercise_id", exerciseId)
    .eq("user_id", userId);

  if (deleteError) {
    return deleteError;
  }

  if (bodyPartIds.length === 0) {
    return null;
  }

  const rows: TablesInsert<"exercise_body_parts">[] = bodyPartIds.map((bodyPartId) => ({
    exercise_id: exerciseId,
    body_part_id: bodyPartId,
    user_id: userId
  }));
  const { error: insertError } = await supabase.from("exercise_body_parts").insert(rows);

  return insertError;
}

export async function createExercise(
  _previousState: ExerciseActionState,
  formData: FormData
): Promise<ExerciseActionState> {
  const parsed = exerciseFormSchema.safeParse(getExerciseFormValues(formData));

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

  const { data: exercise, error } = await supabase
    .from("exercises")
    .insert({
      name: parsed.data.name,
      body_part_id: parsed.data.bodyPartIds[0] ?? null,
      user_id: userData.user.id
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create exercise", error);

    return {
      error: mapExerciseMutationError(error),
      success: null
    };
  }

  const exerciseBodyPartsError = await syncExerciseBodyParts({
    bodyPartIds: parsed.data.bodyPartIds,
    exerciseId: exercise.id,
    supabase,
    userId: userData.user.id
  });

  if (exerciseBodyPartsError) {
    console.error("Failed to sync exercise body parts", exerciseBodyPartsError);

    await supabase.from("exercises").delete().eq("id", exercise.id).eq("user_id", userData.user.id);

    return {
      error: mapExerciseMutationError(exerciseBodyPartsError),
      success: null
    };
  }

  revalidatePath("/exercises");

  return {
    error: null,
    success: "種目を追加しました。"
  };
}

export async function updateExercise(
  _previousState: ExerciseActionState,
  formData: FormData
): Promise<ExerciseActionState> {
  const id = getExerciseId(formData);

  if (!id) {
    return {
      error: "更新する種目を選択してください。",
      success: null
    };
  }

  const parsed = exerciseFormSchema.safeParse(getExerciseFormValues(formData));

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
    .from("exercises")
    .update({
      name: parsed.data.name,
      body_part_id: parsed.data.bodyPartIds[0] ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Failed to update exercise", error);

    return {
      error: mapExerciseMutationError(error),
      success: null
    };
  }

  const exerciseBodyPartsError = await syncExerciseBodyParts({
    bodyPartIds: parsed.data.bodyPartIds,
    exerciseId: id,
    supabase,
    userId: userData.user.id
  });

  if (exerciseBodyPartsError) {
    console.error("Failed to sync exercise body parts", exerciseBodyPartsError);

    return {
      error: mapExerciseMutationError(exerciseBodyPartsError),
      success: null
    };
  }

  revalidatePath("/exercises");

  return {
    error: null,
    success: "種目を更新しました。"
  };
}

export async function deleteExercise(formData: FormData) {
  const id = getExerciseId(formData);

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return;
  }

  await supabase.from("exercises").delete().eq("id", id).eq("user_id", userData.user.id);

  revalidatePath("/exercises");
}
