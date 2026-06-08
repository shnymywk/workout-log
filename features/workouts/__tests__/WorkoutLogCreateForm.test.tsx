import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

import { createWorkoutLog } from "@/features/workouts/actions/workout-logs";
import { WorkoutLogCreateForm } from "@/features/workouts/components/WorkoutLogCreateForm";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/workouts/actions/workout-logs", () => ({
  createWorkoutLog: jest.fn()
}));

const exercises = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "ベンチプレス",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z",
    bodyParts: []
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "スクワット",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z",
    bodyParts: []
  }
];

describe("WorkoutLogCreateForm", () => {
  beforeEach(() => {
    jest.mocked(createWorkoutLog).mockReset();
  });

  it("renders batch workout log fields and updates volume preview", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogCreateForm exercises={exercises} />
      </ThemeProvider>
    );

    expect(screen.getByLabelText("日付")).toBeInTheDocument();
    expect(screen.getByLabelText("種目 1")).toBeInTheDocument();
    expect(screen.getByText("ベンチプレス")).toBeInTheDocument();
    expect(screen.getByLabelText("重量")).toHaveValue("");
    expect(screen.getByLabelText("重量")).toHaveAttribute("placeholder", "70");
    expect(screen.getByLabelText("回数")).toHaveValue("");
    expect(screen.getByLabelText("回数")).toHaveAttribute("placeholder", "8");

    await user.type(screen.getByLabelText("重量"), "70");
    await user.type(screen.getByLabelText("回数"), "8");

    expect(screen.getByText("560kg")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "セット追加" }));
    await user.clear(screen.getAllByLabelText("重量")[1]);
    await user.type(screen.getAllByLabelText("重量")[1], "72.5");
    await user.clear(screen.getAllByLabelText("回数")[1]);
    await user.type(screen.getAllByLabelText("回数")[1], "6");

    expect(screen.getByText("995kg")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "種目追加" }));

    expect(screen.getByLabelText("種目 2")).toBeInTheDocument();
  });

  it("keeps set controls in one row for the mobile layout", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogCreateForm exercises={exercises} />
      </ThemeProvider>
    );

    const setRow = screen.getByTestId("set-row");

    expect(within(setRow).getByText("1")).toBeInTheDocument();
    expect(within(setRow).getByLabelText("重量")).toBeInTheDocument();
    expect(within(setRow).getByLabelText("回数")).toBeInTheDocument();
    expect(
      within(setRow).getByRole("button", { name: "種目1のセット1を削除" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "セット追加" }));

    expect(screen.getAllByText("重量")).toHaveLength(1);
    expect(screen.getAllByText("回数")).toHaveLength(1);
    expect(screen.getAllByLabelText("重量")).toHaveLength(2);
    expect(screen.getAllByLabelText("回数")).toHaveLength(2);
  });

  it("resets the whole form after a successful save", async () => {
    const user = userEvent.setup();
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10);

    jest.mocked(createWorkoutLog).mockResolvedValueOnce({
      error: null,
      success: "トレーニング記録を保存しました。"
    });

    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogCreateForm exercises={exercises} />
      </ThemeProvider>
    );

    await user.clear(screen.getByLabelText("日付"));
    await user.type(screen.getByLabelText("日付"), "2026-06-01");
    await user.selectOptions(screen.getByLabelText("種目 1"), exercises[1].id);
    await user.clear(screen.getByLabelText("重量"));
    await user.type(screen.getByLabelText("重量"), "80");
    await user.clear(screen.getByLabelText("回数"));
    await user.type(screen.getByLabelText("回数"), "5");
    await user.type(screen.getByLabelText("メモ"), "よくできた");
    await user.click(screen.getByRole("button", { name: "セット追加" }));
    await user.click(screen.getByRole("button", { name: "種目追加" }));

    await user.click(screen.getByRole("button", { name: "記録する" }));

    await waitFor(() => {
      expect(screen.getByText("トレーニング記録を保存しました。")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByLabelText("日付")).toHaveValue(today);
    });

    expect(screen.getByLabelText("種目 1")).toHaveValue(exercises[0].id);
    expect(screen.queryByLabelText("種目 2")).not.toBeInTheDocument();
    expect(screen.getByLabelText("重量")).toHaveValue("");
    expect(screen.getByLabelText("重量")).toHaveAttribute("placeholder", "70");
    expect(screen.getByLabelText("回数")).toHaveValue("");
    expect(screen.getByLabelText("回数")).toHaveAttribute("placeholder", "8");
    expect(screen.getByLabelText("メモ")).toHaveValue("");
    expect(screen.getByText("0kg")).toBeInTheDocument();
  });
});
