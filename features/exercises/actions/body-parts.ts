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

function mapBodyPartMutationError() {
  return "同じ名前の部位がすでに登録されています。";
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
  const { error } = await supabase.from("body_parts").insert({
    name: parsed.data.name
  });

  if (error) {
    return {
      error: mapBodyPartMutationError(),
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
  const { error } = await supabase
    .from("body_parts")
    .update({ name: parsed.data.name })
    .eq("id", id);

  if (error) {
    return {
      error: mapBodyPartMutationError(),
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
  await supabase.from("body_parts").delete().eq("id", id);

  revalidatePath("/exercises");
}
