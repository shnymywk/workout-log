"use server";

import { revalidatePath } from "next/cache";

import { goalFormSchema } from "@/features/goals/schemas/goal-schema";
import { initialGoalActionState, type GoalActionState } from "@/features/goals/types/goal";
import { createClient } from "@/lib/supabase/server";

export { initialGoalActionState };

function getFirstValidationMessage(errorMessage: string | undefined) {
  return errorMessage ?? "入力内容を確認してください。";
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
  const { error } = await supabase.from("goals").upsert(
    {
      exercise_id: parsed.data.exerciseId,
      target_weight: parsed.data.targetWeight,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "user_id,exercise_id"
    }
  );

  if (error) {
    return {
      error: "目標を保存できませんでした。",
      success: null
    };
  }

  revalidatePath("/goals");

  return {
    error: null,
    success: "目標を保存しました。"
  };
}
