import { buildDashboardCharts } from "@/features/dashboard/lib/charts";
import type { WorkoutLog } from "@/features/workouts/types/workout-log";

const workoutLogs: WorkoutLog[] = [
  {
    id: "log-1",
    exercise_id: "exercise-1",
    exercise_name: "ベンチプレス",
    trained_at: "2026-06-03",
    weight: 80,
    sets: 3,
    reps: 8,
    memo: null,
    created_at: "2026-06-03T01:00:00.000Z"
  },
  {
    id: "log-2",
    exercise_id: "exercise-1",
    exercise_name: "ベンチプレス",
    trained_at: "2026-06-01",
    weight: 70,
    sets: 2,
    reps: 5,
    memo: null,
    created_at: "2026-06-01T01:00:00.000Z"
  },
  {
    id: "log-3",
    exercise_id: "exercise-2",
    exercise_name: "スクワット",
    trained_at: "2026-05-15",
    weight: 100,
    sets: 3,
    reps: 5,
    memo: null,
    created_at: "2026-05-15T01:00:00.000Z"
  }
];

describe("buildDashboardCharts", () => {
  it("builds exercise weight progression series", () => {
    const charts = buildDashboardCharts({
      workoutLogs,
      today: new Date("2026-06-03T00:00:00.000Z")
    });

    expect(charts.exerciseWeightSeries).toEqual([
      {
        exerciseId: "exercise-1",
        exerciseName: "ベンチプレス",
        latestWeight: 80,
        points: [
          {
            trainedAt: "2026-06-01",
            label: "6/1",
            weight: 70
          },
          {
            trainedAt: "2026-06-03",
            label: "6/3",
            weight: 80
          }
        ]
      },
      {
        exerciseId: "exercise-2",
        exerciseName: "スクワット",
        latestWeight: 100,
        points: [
          {
            trainedAt: "2026-05-15",
            label: "5/15",
            weight: 100
          }
        ]
      }
    ]);
  });

  it("builds weekly and monthly frequency series", () => {
    const charts = buildDashboardCharts({
      workoutLogs,
      today: new Date("2026-06-03T00:00:00.000Z")
    });

    expect(charts.weeklyFrequencySeries).toEqual([
      { date: "2026-05-28", label: "5/28", count: 0 },
      { date: "2026-05-29", label: "5/29", count: 0 },
      { date: "2026-05-30", label: "5/30", count: 0 },
      { date: "2026-05-31", label: "5/31", count: 0 },
      { date: "2026-06-01", label: "6/1", count: 1 },
      { date: "2026-06-02", label: "6/2", count: 0 },
      { date: "2026-06-03", label: "6/3", count: 1 }
    ]);
    expect(charts.monthlyFrequencySeries).toHaveLength(30);
    expect(charts.monthlyFrequencySeries.at(10)).toEqual({
      date: "2026-05-15",
      label: "5/15",
      count: 1
    });
  });

  it("builds total volume series", () => {
    const charts = buildDashboardCharts({
      workoutLogs,
      today: new Date("2026-06-03T00:00:00.000Z")
    });

    expect(charts.volumeSeries).toHaveLength(30);
    expect(charts.volumeSeries.at(10)).toEqual({
      date: "2026-05-15",
      label: "5/15",
      volume: 1500
    });
    expect(charts.volumeSeries.at(-1)).toEqual({
      date: "2026-06-03",
      label: "6/3",
      volume: 1920
    });
  });
});
