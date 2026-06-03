import { getGoals } from "@/features/goals/lib/goals";
import { getMaxWeightsByExerciseId } from "@/features/goals/lib/progress";
import { getWorkoutLogs } from "@/features/workouts/lib/workout-logs";
import { buildDashboardCharts, type DashboardCharts } from "@/features/dashboard/lib/charts";
import { buildDashboardSummary, type DashboardSummary } from "@/features/dashboard/lib/summary";

type DashboardSummaryResult = {
  charts: DashboardCharts;
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
  const today = new Date();

  return {
    charts: buildDashboardCharts({
      workoutLogs: workoutLogsResult.workoutLogs,
      today
    }),
    summary: buildDashboardSummary({
      workoutLogs: workoutLogsResult.workoutLogs,
      goals: goalsResult.goals,
      maxWeightsByExerciseId: maxWeightsResult.maxWeightsByExerciseId,
      today
    }),
    errors
  };
}
