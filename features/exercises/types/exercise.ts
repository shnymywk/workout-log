import type { Tables } from "@/types/database";

export type Exercise = Pick<Tables<"exercises">, "id" | "name" | "body_part_id" | "created_at">;

export type ExerciseActionState = {
  error: string | null;
  success: string | null;
};

export const initialExerciseActionState: ExerciseActionState = {
  error: null,
  success: null
};
