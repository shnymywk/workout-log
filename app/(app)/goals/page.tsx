import { getExercises } from "@/features/exercises/lib/exercises";
import { GoalManagementPage } from "@/features/goals/components/GoalManagementPage";
import { getGoals } from "@/features/goals/lib/goals";
import { calculateAchievementRate, getMaxWeightsByExerciseId } from "@/features/goals/lib/progress";

export default async function GoalsPage() {
  const [exercisesResult, goalsResult, maxWeightsResult] = await Promise.all([
    getExercises(),
    getGoals(),
    getMaxWeightsByExerciseId()
  ]);
  const goalProgressItems = goalsResult.goals.map((goal) => {
    const currentMaxWeight = maxWeightsResult.maxWeightsByExerciseId.get(goal.exercise_id) ?? null;

    return {
      goal,
      currentMaxWeight,
      achievementRate: calculateAchievementRate(currentMaxWeight, goal.target_weight)
    };
  });

  return (
    <GoalManagementPage
      exercises={exercisesResult.exercises}
      exercisesError={exercisesResult.error}
      goalProgressItems={goalProgressItems}
      goalsError={goalsResult.error}
      maxWeightsError={maxWeightsResult.error}
    />
  );
}
