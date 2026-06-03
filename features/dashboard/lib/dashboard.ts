import { getGoals } from "@/features/goals/lib/goals";
import { getMaxWeightsByExerciseId } from "@/features/goals/lib/progress";
import { getWorkoutLogs } from "@/features/workouts/lib/workout-logs";
import { buildDashboardSummary, type DashboardSummary } from "@/features/dashboard/lib/summary";

type DashboardSummaryResult = {
  summary: DashboardSummary;
  errors: string[];
};

export async function getDashboardSummary(): Promise<DashboardSummaryResult> {
  const [workoutLogsResult, goalsResult, maxWeightsResult] = await Promise.all([
    getWorkoutLogs(),
    getGoals(),
    getMaxWeightsByExerciseId()
  ]);
  const errors = [workoutLogsResult.error, goalsResult.error, maxWeightsResult.error].filter(
    (error): error is string => error !== null
  );

  return {
    summary: buildDashboardSummary({
      workoutLogs: workoutLogsResult.workoutLogs,
      goals: goalsResult.goals,
      maxWeightsByExerciseId: maxWeightsResult.maxWeightsByExerciseId,
      today: new Date()
    }),
    errors
  };
}
