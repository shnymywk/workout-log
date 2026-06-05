import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

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
    created_at: "2026-06-03T00:00:00.000Z"
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "スクワット",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z"
  }
];

describe("WorkoutLogCreateForm", () => {
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

    await user.clear(screen.getByLabelText("重量"));
    await user.type(screen.getByLabelText("重量"), "70");
    await user.clear(screen.getByLabelText("回数"));
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
});
