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
  }
];

describe("WorkoutLogCreateForm", () => {
  it("renders workout log fields and updates volume preview", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogCreateForm exercises={exercises} />
      </ThemeProvider>
    );

    expect(screen.getByLabelText("日付")).toBeInTheDocument();
    expect(screen.getByLabelText("種目")).toBeInTheDocument();
    expect(screen.getByText("ベンチプレス")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("重量"));
    await user.type(screen.getByLabelText("重量"), "70");
    await user.clear(screen.getByLabelText("セット"));
    await user.type(screen.getByLabelText("セット"), "3");
    await user.clear(screen.getByLabelText("回数"));
    await user.type(screen.getByLabelText("回数"), "8");

    expect(screen.getByText("1,680kg")).toBeInTheDocument();
  });
});
