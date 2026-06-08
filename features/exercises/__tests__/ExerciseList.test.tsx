import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/exercises/actions/exercises", () => ({
  deleteExercise: jest.fn(),
  updateExercise: jest.fn()
}));

const bodyParts = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "胸",
    created_at: "2026-06-03T00:00:00.000Z"
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "肩",
    created_at: "2026-06-03T00:00:00.000Z"
  }
];

const exercises = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "ベンチプレス",
    body_part_id: "11111111-1111-4111-8111-111111111111",
    created_at: "2026-06-03T00:00:00.000Z",
    bodyParts
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "クリーン",
    body_part_id: null,
    created_at: "2026-06-03T00:00:00.000Z",
    bodyParts: []
  }
];

describe("ExerciseList", () => {
  it("renders body parts and keeps action buttons in one row", () => {
    render(
      <ThemeProvider theme={theme}>
        <ExerciseList bodyParts={bodyParts} exercises={exercises} />
      </ThemeProvider>
    );

    expect(screen.getByText("胸・肩")).toBeInTheDocument();
    expect(screen.getByText("未分類")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox", { name: "胸" })[0]).toBeChecked();
    expect(screen.getAllByRole("checkbox", { name: "肩" })[0]).toBeChecked();

    const actionRows = screen.getAllByTestId("exercise-row-actions");

    expect(actionRows).toHaveLength(2);
    expect(within(actionRows[0]).getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(within(actionRows[0]).getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(
      <ThemeProvider theme={theme}>
        <ExerciseList bodyParts={bodyParts} exercises={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText("条件に一致する種目がありません。")).toBeInTheDocument();
  });
});
