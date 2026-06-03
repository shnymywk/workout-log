import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/features/exercises/types/exercise";

type ExercisesResult = {
  exercises: Exercise[];
  error: string | null;
};

export async function getExercises(bodyPartId?: string | null): Promise<ExercisesResult> {
  const supabase = await createClient();
  let query = supabase
    .from("exercises")
    .select("id, name, body_part_id, created_at")
    .order("created_at", { ascending: true });

  if (bodyPartId) {
    query = query.eq("body_part_id", bodyPartId);
  }

  const { data, error } = await query;

  if (error) {
    return {
      exercises: [],
      error: "種目一覧を取得できませんでした。"
    };
  }

  return {
    exercises: data,
    error: null
  };
}
