import { z } from "zod";

const optionalBodyPartIdSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}, z.uuid().nullable());

export const exerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "種目名を入力してください。")
    .max(60, "種目名は60文字以内で入力してください。"),
  bodyPartId: optionalBodyPartIdSchema
});

export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>;
