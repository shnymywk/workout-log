import { z } from "zod";

export const bodyPartFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "部位名を入力してください。")
    .max(40, "部位名は40文字以内で入力してください。")
});

export type BodyPartFormInput = z.infer<typeof bodyPartFormSchema>;
