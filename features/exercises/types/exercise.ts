import type { Tables } from "@/types/database";
import type { BodyPart } from "@/features/exercises/types/body-part";

export type Exercise = Pick<Tables<"exercises">, "id" | "name" | "body_part_id" | "created_at"> & {
  bodyParts: BodyPart[];
};

export type ExerciseActionState = {
  error: string | null;
  success: string | null;
};

export const initialExerciseActionState: ExerciseActionState = {
  error: null,
  success: null
};
