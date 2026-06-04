"use server";

import { revalidatePath } from "next/cache";

import { goalFormSchema } from "@/features/goals/schemas/goal-schema";
import type { GoalActionState } from "@/features/goals/types/goal";
import { createClient } from "@/lib/supabase/server";

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
}

function mapGoalMutationError(error: { code?: string }) {
  if (error.code === "42501") {
    return "目標を保存できませんでした。ログイン状態またはデータベースの権限設定を確認してください。";
  }

  return "目標を保存できませんでした。";
}

export async function saveGoal(
  _previousState: GoalActionState,
  formData: FormData
): Promise<GoalActionState> {
  const parsed = goalFormSchema.safeParse({
    exerciseId: formData.get("exerciseId"),
    targetWeight: formData.get("targetWeight")
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

  const { error } = await supabase.from("goals").upsert(
    {
      exercise_id: parsed.data.exerciseId,
      target_weight: parsed.data.targetWeight,
      updated_at: new Date().toISOString(),
      user_id: userData.user.id
    },
    {
      onConflict: "user_id,exercise_id"
    }
  );

  if (error) {
    console.error("Failed to save goal", error);

    return {
      error: mapGoalMutationError(error),
      success: null
    };
  }

  revalidatePath("/goals");

  return {
    error: null,
    success: "目標を保存しました。"
  };
}
