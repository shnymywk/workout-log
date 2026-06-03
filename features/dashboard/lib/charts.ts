import type { WorkoutLog } from "@/features/workouts/types/workout-log";

export type ExerciseWeightPoint = {
  trainedAt: string;
  label: string;
  weight: number;
};

export type ExerciseWeightSeries = {
  exerciseId: string;
  exerciseName: string;
  latestWeight: number;
  points: ExerciseWeightPoint[];
};

export type DashboardCharts = {
  exerciseWeightSeries: ExerciseWeightSeries[];
};

function toDateLabel(dateValue: string) {
  const [, month, day] = dateValue.split("-");

  return `${Number(month)}/${Number(day)}`;
}

function sortWorkoutLogsByDate(workoutLogs: WorkoutLog[]) {
  return [...workoutLogs].sort((firstLog, secondLog) => {
    if (firstLog.trained_at !== secondLog.trained_at) {
      return firstLog.trained_at.localeCompare(secondLog.trained_at);
    }

    return firstLog.created_at.localeCompare(secondLog.created_at);
  });
}

function buildExerciseWeightSeries(workoutLogs: WorkoutLog[]) {
  const seriesByExerciseId = new Map<string, ExerciseWeightSeries>();

  sortWorkoutLogsByDate(workoutLogs).forEach((workoutLog) => {
    const currentSeries = seriesByExerciseId.get(workoutLog.exercise_id) ?? {
      exerciseId: workoutLog.exercise_id,
      exerciseName: workoutLog.exercise_name,
      latestWeight: workoutLog.weight,
      points: []
    };

    currentSeries.exerciseName = workoutLog.exercise_name;
    currentSeries.latestWeight = workoutLog.weight;
    currentSeries.points.push({
      trainedAt: workoutLog.trained_at,
      label: toDateLabel(workoutLog.trained_at),
      weight: workoutLog.weight
    });
    seriesByExerciseId.set(workoutLog.exercise_id, currentSeries);
  });

  return [...seriesByExerciseId.values()].sort(
    (firstSeries, secondSeries) =>
      secondSeries.points.at(-1)!.trainedAt.localeCompare(firstSeries.points.at(-1)!.trainedAt) ||
      firstSeries.exerciseName.localeCompare(secondSeries.exerciseName)
  );
}

export function buildDashboardCharts({
  workoutLogs
}: {
  workoutLogs: WorkoutLog[];
}): DashboardCharts {
  return {
    exerciseWeightSeries: buildExerciseWeightSeries(workoutLogs)
  };
}
