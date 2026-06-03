import { ExerciseManagementPage } from "@/features/exercises/components/ExerciseManagementPage";
import { getBodyParts } from "@/features/exercises/lib/body-parts";
import { getExercises } from "@/features/exercises/lib/exercises";

type ExercisesPageProps = {
  searchParams: Promise<{
    bodyPartId?: string;
  }>;
};

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const { bodyPartId } = await searchParams;
  const selectedBodyPartId = bodyPartId ?? null;
  const [bodyPartsResult, exercisesResult] = await Promise.all([
    getBodyParts(),
    getExercises(selectedBodyPartId)
  ]);

  return (
    <ExerciseManagementPage
      bodyParts={bodyPartsResult.bodyParts}
      bodyPartsError={bodyPartsResult.error}
      exercises={exercisesResult.exercises}
      exercisesError={exercisesResult.error}
      selectedBodyPartId={selectedBodyPartId}
    />
  );
}
