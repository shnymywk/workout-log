import { calculateWorkoutLogVolume } from "@/features/workouts/lib/volume";
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

export type DailyCountPoint = {
  date: string;
  label: string;
  count: number;
};

export type DailyVolumePoint = {
  date: string;
  label: string;
  volume: number;
};

export type DashboardCharts = {
  exerciseWeightSeries: ExerciseWeightSeries[];
  weeklyFrequencySeries: DailyCountPoint[];
  monthlyFrequencySeries: DailyCountPoint[];
  volumeSeries: DailyVolumePoint[];
};

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function toDateLabel(dateValue: string) {
  const [, month, day] = dateValue.split("-");

  return `${Number(month)}/${Number(day)}`;
}

function buildDateValues(today: Date, days: number) {
  return Array.from({ length: days }, (_, index) => toDateValue(addDays(today, index - days + 1)));
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

function buildDailyCountSeries(workoutLogs: WorkoutLog[], today: Date, days: number) {
  const countByDate = new Map<string, number>();

  workoutLogs.forEach((workoutLog) => {
    countByDate.set(workoutLog.trained_at, (countByDate.get(workoutLog.trained_at) ?? 0) + 1);
  });

  return buildDateValues(today, days).map((date) => ({
    date,
    label: toDateLabel(date),
    count: countByDate.get(date) ?? 0
  }));
}

function buildDailyVolumeSeries(workoutLogs: WorkoutLog[], today: Date, days: number) {
  const volumeByDate = new Map<string, number>();

  workoutLogs.forEach((workoutLog) => {
    volumeByDate.set(
      workoutLog.trained_at,
      (volumeByDate.get(workoutLog.trained_at) ?? 0) + calculateWorkoutLogVolume(workoutLog)
    );
  });

  return buildDateValues(today, days).map((date) => ({
    date,
    label: toDateLabel(date),
    volume: volumeByDate.get(date) ?? 0
  }));
}

export function buildDashboardCharts({
  today,
  workoutLogs
}: {
  today: Date;
  workoutLogs: WorkoutLog[];
}): DashboardCharts {
  return {
    exerciseWeightSeries: buildExerciseWeightSeries(workoutLogs),
    weeklyFrequencySeries: buildDailyCountSeries(workoutLogs, today, 7),
    monthlyFrequencySeries: buildDailyCountSeries(workoutLogs, today, 30),
    volumeSeries: buildDailyVolumeSeries(workoutLogs, today, 30)
  };
}
