import { getExercises } from "@/features/exercises/lib/exercises";
import { WorkoutLogCreationPage } from "@/features/workouts/components/WorkoutLogCreationPage";
import { getWorkoutLogs } from "@/features/workouts/lib/workout-logs";

type WorkoutsPageProps = {
  searchParams: Promise<{
    trainedAt?: string;
    exerciseId?: string;
  }>;
};

function normalizeFilterValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

export default async function WorkoutsPage({ searchParams }: WorkoutsPageProps) {
  const { trainedAt, exerciseId } = await searchParams;
  const filters = {
    trainedAt: normalizeFilterValue(trainedAt),
    exerciseId: normalizeFilterValue(exerciseId)
  };
  const [exercisesResult, workoutLogsResult] = await Promise.all([
    getExercises(),
    getWorkoutLogs(filters)
  ]);

  return (
    <WorkoutLogCreationPage
      exercises={exercisesResult.exercises}
      exercisesError={exercisesResult.error}
      workoutLogs={workoutLogsResult.workoutLogs}
      workoutLogsError={workoutLogsResult.error}
      filters={filters}
    />
  );
}
