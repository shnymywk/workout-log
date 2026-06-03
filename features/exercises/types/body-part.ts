import type { Tables } from "@/types/database";

export type BodyPart = Pick<Tables<"body_parts">, "id" | "name" | "created_at">;

export type BodyPartActionState = {
  error: string | null;
  success: string | null;
};

export const initialBodyPartActionState: BodyPartActionState = {
  error: null,
  success: null
};
