import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { WorkoutLogList } from "@/features/workouts/components/WorkoutLogList";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/workouts/actions/workout-logs", () => ({
  deleteWorkoutLog: jest.fn(),
  initialWorkoutLogActionState: {
    error: null,
    success: null
  },
  updateWorkoutLog: jest.fn()
}));

const exercises = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "ベンチプレス",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z"
  }
];

const workoutLogs = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    exercise_id: "11111111-1111-4111-8111-111111111111",
    exercise_name: "ベンチプレス",
    trained_at: "2026-06-03",
    weight: 70,
    sets: 3,
    reps: 8,
    memo: "フォームは安定",
    created_at: "2026-06-03T00:00:00.000Z"
  }
];

describe("WorkoutLogList", () => {
  it("renders workout log summary and edit fields", () => {
    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogList exercises={exercises} workoutLogs={workoutLogs} />
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { name: "ベンチプレス" })).toBeInTheDocument();
    expect(screen.getByText("2026-06-03 / 70kg x 3set x 8rep")).toBeInTheDocument();
    expect(screen.getByText("1,680kg")).toBeInTheDocument();
    expect(screen.getByLabelText("日付")).toBeInTheDocument();
    expect(screen.getByLabelText("種目")).toBeInTheDocument();
    expect(screen.getByDisplayValue("フォームは安定")).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogList exercises={exercises} workoutLogs={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText("条件に一致するトレーニング記録がありません。")).toBeInTheDocument();
  });
});
