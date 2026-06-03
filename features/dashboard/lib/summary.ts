import { calculateAchievementRate } from "@/features/goals/lib/progress";
import type { Goal } from "@/features/goals/types/goal";
import { calculateWorkoutVolume } from "@/features/workouts/lib/volume";
import type { WorkoutLog } from "@/features/workouts/types/workout-log";

export type DashboardSummary = {
  weeklyTrainingDays: number;
  monthlyTrainingDays: number;
  totalVolume: number;
  averageAchievementRate: number | null;
};

function toDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return nextDate;
}

function countTrainingDaysInRange(workoutLogs: WorkoutLog[], startDate: string, endDate: string) {
  const trainingDays = new Set(
    workoutLogs
      .filter(
        (workoutLog) => workoutLog.trained_at >= startDate && workoutLog.trained_at <= endDate
      )
      .map((workoutLog) => workoutLog.trained_at)
  );

  return trainingDays.size;
}

function calculateTotalVolume(workoutLogs: WorkoutLog[]) {
  return workoutLogs.reduce(
    (totalVolume, workoutLog) =>
      totalVolume + calculateWorkoutVolume(workoutLog.weight, workoutLog.sets, workoutLog.reps),
    0
  );
}

function calculateAverageAchievementRate(
  goals: Goal[],
  maxWeightsByExerciseId: Map<string, number>
) {
  const achievementRates = goals
    .map((goal) =>
      calculateAchievementRate(
        maxWeightsByExerciseId.get(goal.exercise_id) ?? null,
        goal.target_weight
      )
    )
    .filter((rate): rate is number => rate !== null);

  if (achievementRates.length === 0) {
    return null;
  }

  return Math.round(
    achievementRates.reduce((totalRate, rate) => totalRate + rate, 0) / achievementRates.length
  );
}

export function buildDashboardSummary({
  goals,
  maxWeightsByExerciseId,
  today,
  workoutLogs
}: {
  goals: Goal[];
  maxWeightsByExerciseId: Map<string, number>;
  today: Date;
  workoutLogs: WorkoutLog[];
}): DashboardSummary {
  const todayValue = toDateValue(today);
  const sevenDaysAgoValue = toDateValue(addDays(today, -6));
  const thirtyDaysAgoValue = toDateValue(addDays(today, -29));

  return {
    weeklyTrainingDays: countTrainingDaysInRange(workoutLogs, sevenDaysAgoValue, todayValue),
    monthlyTrainingDays: countTrainingDaysInRange(workoutLogs, thirtyDaysAgoValue, todayValue),
    totalVolume: calculateTotalVolume(workoutLogs),
    averageAchievementRate: calculateAverageAchievementRate(goals, maxWeightsByExerciseId)
  };
}
