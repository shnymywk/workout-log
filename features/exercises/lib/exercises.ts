import { createClient } from "@/lib/supabase/server";
import type { BodyPart } from "@/features/exercises/types/body-part";
import type { Exercise } from "@/features/exercises/types/exercise";

type ExercisesResult = {
  exercises: Exercise[];
  error: string | null;
};

type ExerciseRow = {
  id: string;
  name: string;
  body_part_id: string | null;
  created_at: string;
  exercise_body_parts: {
    body_parts: BodyPart | null;
  }[];
};

export async function getExercises(bodyPartId?: string | null): Promise<ExercisesResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exercises")
    .select(
      `
        id,
        name,
        body_part_id,
        created_at,
        exercise_body_parts (
          body_parts (
            id,
            name,
            created_at
          )
        )
      `
    )
    .order("created_at", { ascending: true })
    .returns<ExerciseRow[]>();

  if (error) {
    return {
      exercises: [],
      error: "種目一覧を取得できませんでした。"
    };
  }

  const exercises = data.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    body_part_id: exercise.body_part_id,
    created_at: exercise.created_at,
    bodyParts: exercise.exercise_body_parts
      .map((exerciseBodyPart) => exerciseBodyPart.body_parts)
      .filter((bodyPart): bodyPart is BodyPart => bodyPart !== null)
      .sort((firstBodyPart, secondBodyPart) =>
        firstBodyPart.created_at.localeCompare(secondBodyPart.created_at)
      )
  }));

  return {
    exercises: bodyPartId
      ? exercises.filter((exercise) =>
          exercise.bodyParts.some((bodyPart) => bodyPart.id === bodyPartId)
        )
      : exercises,
    error: null
  };
}
