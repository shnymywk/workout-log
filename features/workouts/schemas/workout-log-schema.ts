import { z } from "zod";

const requiredNumberSchema = (message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? Number(trimmedValue) : Number.NaN;
  }, z.number(message).positive(message));

const requiredIntegerSchema = (message: string) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmedValue = value.trim();

    return trimmedValue.length > 0 ? Number(trimmedValue) : Number.NaN;
  }, z.number(message).int(message).positive(message));

export const workoutLogFormSchema = z.object({
  exerciseId: z.uuid("種目を選択してください。"),
  trainedAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付を選択してください。"),
  weight: requiredNumberSchema("重量は0より大きい数値で入力してください。"),
  sets: requiredIntegerSchema("セット数は0より大きい整数で入力してください。"),
  reps: requiredIntegerSchema("回数は0より大きい整数で入力してください。"),
  memo: z
    .string()
    .trim()
    .max(500, "メモは500文字以内で入力してください。")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))
});

export type WorkoutLogFormInput = z.infer<typeof workoutLogFormSchema>;
