"use server";

import { revalidatePath } from "next/cache";

import { exerciseFormSchema } from "@/features/exercises/schemas/exercise-schema";
import type { ExerciseActionState } from "@/features/exercises/types/exercise";
import { createClient } from "@/lib/supabase/server";

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

export async function createExercise(
  _previousState: ExerciseActionState,
  formData: FormData
): Promise<ExerciseActionState> {
  const parsed = exerciseFormSchema.safeParse({
    name: formData.get("name"),
    bodyPartId: formData.get("bodyPartId")
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

  const { error } = await supabase.from("exercises").insert({
    name: parsed.data.name,
    body_part_id: parsed.data.bodyPartId,
    user_id: userData.user.id
  });

  if (error) {
    console.error("Failed to create exercise", error);

    return {
      error: mapExerciseMutationError(error),
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

  const parsed = exerciseFormSchema.safeParse({
    name: formData.get("name"),
    bodyPartId: formData.get("bodyPartId")
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
    .from("exercises")
    .update({
      name: parsed.data.name,
      body_part_id: parsed.data.bodyPartId,
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
