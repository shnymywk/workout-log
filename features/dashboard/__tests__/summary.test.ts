import { buildDashboardSummary } from "@/features/dashboard/lib/summary";
import type { Goal } from "@/features/goals/types/goal";
import type { WorkoutLog } from "@/features/workouts/types/workout-log";

const workoutLogs: WorkoutLog[] = [
  {
    id: "log-1",
    exercise_id: "exercise-1",
    exercise_name: "ベンチプレス",
    trained_at: "2026-06-03",
    weight: 70,
    sets: 3,
    reps: 8,
    memo: null,
    created_at: "2026-06-03T00:00:00.000Z",
    workout_log_sets: [
      {
        id: "set-1",
        set_number: 1,
        weight: 70,
        reps: 8
      },
      {
        id: "set-2",
        set_number: 2,
        weight: 72.5,
        reps: 6
      }
    ]
  },
  {
    id: "log-2",
    exercise_id: "exercise-1",
    exercise_name: "ベンチプレス",
    trained_at: "2026-05-29",
    weight: 80,
    sets: 2,
    reps: 5,
    memo: null,
    created_at: "2026-05-29T00:00:00.000Z"
  },
  {
    id: "log-3",
    exercise_id: "exercise-2",
    exercise_name: "スクワット",
    trained_at: "2026-05-10",
    weight: 100,
    sets: 3,
    reps: 5,
    memo: null,
    created_at: "2026-05-10T00:00:00.000Z"
  },
  {
    id: "log-4",
    exercise_id: "exercise-3",
    exercise_name: "デッドリフト",
    trained_at: "2026-04-01",
    weight: 120,
    sets: 1,
    reps: 5,
    memo: null,
    created_at: "2026-04-01T00:00:00.000Z"
  }
];

const goals: Goal[] = [
  {
    id: "goal-1",
    exercise_id: "exercise-1",
    exercise_name: "ベンチプレス",
    target_weight: 100,
    created_at: "2026-06-03T00:00:00.000Z",
    updated_at: "2026-06-03T00:00:00.000Z"
  },
  {
    id: "goal-2",
    exercise_id: "exercise-2",
    exercise_name: "スクワット",
    target_weight: 125,
    created_at: "2026-06-03T00:00:00.000Z",
    updated_at: "2026-06-03T00:00:00.000Z"
  }
];

describe("buildDashboardSummary", () => {
  it("builds frequency, volume, and goal achievement summary", () => {
    const summary = buildDashboardSummary({
      workoutLogs,
      goals,
      maxWeightsByExerciseId: new Map([
        ["exercise-1", 80],
        ["exercise-2", 100]
      ]),
      today: new Date("2026-06-03T00:00:00.000Z")
    });

    expect(summary).toEqual({
      weeklyTrainingDays: 2,
      monthlyTrainingDays: 3,
      totalVolume: 3895,
      averageAchievementRate: 80
    });
  });

  it("returns null average achievement rate when no goal has current max weight", () => {
    const summary = buildDashboardSummary({
      workoutLogs: [],
      goals,
      maxWeightsByExerciseId: new Map(),
      today: new Date("2026-06-03T00:00:00.000Z")
    });

    expect(summary.averageAchievementRate).toBeNull();
  });
});
