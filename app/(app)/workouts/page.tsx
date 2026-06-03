import { getExercises } from "@/features/exercises/lib/exercises";
import { WorkoutLogCreationPage } from "@/features/workouts/components/WorkoutLogCreationPage";

export default async function WorkoutsPage() {
  const { exercises, error } = await getExercises();

  return <WorkoutLogCreationPage exercises={exercises} exercisesError={error} />;
}
