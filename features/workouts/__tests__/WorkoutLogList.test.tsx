import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

import { WorkoutLogList } from "@/features/workouts/components/WorkoutLogList";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/workouts/actions/workout-logs", () => ({
  deleteWorkoutLog: jest.fn(),
  updateWorkoutLog: jest.fn()
}));

const exercises = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "ベンチプレス",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z"
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "スクワット",
    body_part_id: "77777777-7777-4777-8777-777777777777",
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
    created_at: "2026-06-03T00:00:00.000Z",
    workout_log_sets: [
      {
        id: "44444444-4444-4444-8444-444444444444",
        set_number: 1,
        weight: 70,
        reps: 8
      },
      {
        id: "55555555-5555-4555-8555-555555555555",
        set_number: 2,
        weight: 72.5,
        reps: 6
      }
    ]
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    exercise_id: "66666666-6666-4666-8666-666666666666",
    exercise_name: "スクワット",
    trained_at: "2026-06-03",
    weight: 100,
    sets: 1,
    reps: 5,
    memo: null,
    created_at: "2026-06-03T01:00:00.000Z",
    workout_log_sets: [
      {
        id: "99999999-9999-4999-8999-999999999999",
        set_number: 1,
        weight: 100,
        reps: 5
      }
    ]
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    exercise_id: "11111111-1111-4111-8111-111111111111",
    exercise_name: "ベンチプレス",
    trained_at: "2026-06-02",
    weight: 65,
    sets: 1,
    reps: 8,
    memo: null,
    created_at: "2026-06-02T00:00:00.000Z",
    workout_log_sets: [
      {
        id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        set_number: 1,
        weight: 65,
        reps: 8
      }
    ]
  }
];

describe("WorkoutLogList", () => {
  it("groups workout logs by trained date and renders edit fields", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <WorkoutLogList exercises={exercises} workoutLogs={workoutLogs} />
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { name: "2026-06-03" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2026-06-02" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "ベンチプレス" })).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "スクワット" })).toBeInTheDocument();
    expect(screen.queryByText("1set 70kg x 8rep / 2set 72.5kg x 6rep")).not.toBeInTheDocument();
    expect(screen.queryByText("1set 100kg x 5rep")).not.toBeInTheDocument();
    expect(screen.queryByText("995kg")).not.toBeInTheDocument();

    const juneThirdCard = screen.getByRole("heading", { name: "2026-06-03" }).closest("article");

    expect(juneThirdCard).not.toBeNull();
    expect(within(juneThirdCard as HTMLElement).getByRole("heading", { name: "ベンチプレス" }))
      .toBeInTheDocument();
    expect(within(juneThirdCard as HTMLElement).getByRole("heading", { name: "スクワット" }))
      .toBeInTheDocument();
    expect(screen.queryByLabelText("日付")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("種目")).not.toBeInTheDocument();
    expect(container.querySelectorAll('input[type="hidden"][name="trainedAt"]')).toHaveLength(3);
    expect(container.querySelectorAll('input[type="hidden"][name="exerciseId"]')).toHaveLength(3);
    expect(screen.getAllByLabelText("重量")).toHaveLength(4);
    expect(screen.getAllByLabelText("回数")).toHaveLength(4);
    expect(screen.getAllByRole("button", { name: "セット追加" })).toHaveLength(3);
    expect(screen.getByDisplayValue("フォームは安定")).toBeInTheDocument();
  });

  it("keeps edit set controls in one row for the mobile layout", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogList exercises={exercises} workoutLogs={[workoutLogs[0]]} />
      </ThemeProvider>
    );

    const setRows = screen.getAllByTestId("edit-set-row");

    expect(setRows).toHaveLength(2);
    expect(within(setRows[0]).getByText("1")).toBeInTheDocument();
    expect(within(setRows[0]).getByLabelText("重量")).toBeInTheDocument();
    expect(within(setRows[0]).getByLabelText("回数")).toBeInTheDocument();
    expect(
      within(setRows[0]).getByRole("button", { name: "ベンチプレスのセット1を削除" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("重量")).toHaveLength(1);
    expect(screen.getAllByText("回数")).toHaveLength(1);
    expect(screen.getAllByLabelText("重量")).toHaveLength(2);
    expect(screen.getAllByLabelText("回数")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "セット追加" }));

    expect(screen.getAllByLabelText("重量")).toHaveLength(3);
    expect(screen.getAllByLabelText("重量")[2]).toHaveValue("");
    expect(screen.getAllByLabelText("重量")[2]).toHaveAttribute("placeholder", "70");
    expect(screen.getAllByLabelText("回数")).toHaveLength(3);
    expect(screen.getAllByLabelText("回数")[2]).toHaveValue("");
    expect(screen.getAllByLabelText("回数")[2]).toHaveAttribute("placeholder", "8");
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
