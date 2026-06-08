import { z } from "zod";

const bodyPartIdsSchema = z
  .array(z.uuid("部位の選択内容を確認してください。"))
  .transform((bodyPartIds) => Array.from(new Set(bodyPartIds)));

export const exerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "種目名を入力してください。")
    .max(60, "種目名は60文字以内で入力してください。"),
  bodyPartIds: bodyPartIdsSchema
});

export type ExerciseFormInput = z.infer<typeof exerciseFormSchema>;
