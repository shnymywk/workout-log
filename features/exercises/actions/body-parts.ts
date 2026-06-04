"use server";

import { revalidatePath } from "next/cache";

import { bodyPartFormSchema } from "@/features/exercises/schemas/body-part-schema";
import type { BodyPartActionState } from "@/features/exercises/types/body-part";
import { createClient } from "@/lib/supabase/server";

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
}

function getBodyPartId(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    return null;
  }

  return id;
}

function mapBodyPartMutationError(error: { code?: string }) {
  if (error.code === "23505") {
    return "同じ名前の部位がすでに登録されています。";
  }

  if (error.code === "42501") {
    return "部位を保存できませんでした。ログイン状態またはデータベースの権限設定を確認してください。";
  }

  return "部位を保存できませんでした。データベース設定を確認してください。";
}

export async function createBodyPart(
  _previousState: BodyPartActionState,
  formData: FormData
): Promise<BodyPartActionState> {
  const parsed = bodyPartFormSchema.safeParse({
    name: formData.get("name")
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

  const { error } = await supabase.from("body_parts").insert({
    name: parsed.data.name,
    user_id: userData.user.id
  });

  if (error) {
    console.error("Failed to create body part", error);

    return {
      error: mapBodyPartMutationError(error),
      success: null
    };
  }

  revalidatePath("/exercises");

  return {
    error: null,
    success: "部位を追加しました。"
  };
}

export async function updateBodyPart(
  _previousState: BodyPartActionState,
  formData: FormData
): Promise<BodyPartActionState> {
  const id = getBodyPartId(formData);

  if (!id) {
    return {
      error: "更新する部位を選択してください。",
      success: null
    };
  }

  const parsed = bodyPartFormSchema.safeParse({
    name: formData.get("name")
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
    .from("body_parts")
    .update({ name: parsed.data.name })
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Failed to update body part", error);

    return {
      error: mapBodyPartMutationError(error),
      success: null
    };
  }

  revalidatePath("/exercises");

  return {
    error: null,
    success: "部位を更新しました。"
  };
}

export async function deleteBodyPart(formData: FormData) {
  const id = getBodyPartId(formData);

  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return;
  }

  await supabase.from("body_parts").delete().eq("id", id).eq("user_id", userData.user.id);

  revalidatePath("/exercises");
}
