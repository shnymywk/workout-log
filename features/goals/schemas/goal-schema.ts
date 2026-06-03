import { z } from "zod";

const targetWeightSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? Number(trimmedValue) : Number.NaN;
}, z.number("目標重量は0より大きい数値で入力してください。").positive("目標重量は0より大きい数値で入力してください。"));

export const goalFormSchema = z.object({
  exerciseId: z.uuid("種目を選択してください。"),
  targetWeight: targetWeightSchema
});

export type GoalFormInput = z.infer<typeof goalFormSchema>;
