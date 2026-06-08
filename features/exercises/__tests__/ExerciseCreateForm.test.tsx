import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { ExerciseCreateForm } from "@/features/exercises/components/ExerciseCreateForm";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/exercises/actions/exercises", () => ({
  createExercise: jest.fn()
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

describe("ExerciseCreateForm", () => {
  it("renders body part checkboxes", () => {
    render(
      <ThemeProvider theme={theme}>
        <ExerciseCreateForm bodyParts={bodyParts} />
      </ThemeProvider>
    );

    const bodyPartGroup = screen.getByRole("group", { name: "部位" });

    expect(screen.getByLabelText("種目名")).toBeInTheDocument();
    expect(within(bodyPartGroup).getByRole("checkbox", { name: "胸" })).toHaveAttribute(
      "value",
      "11111111-1111-4111-8111-111111111111"
    );
    expect(within(bodyPartGroup).getByRole("checkbox", { name: "肩" })).toHaveAttribute(
      "value",
      "22222222-2222-4222-8222-222222222222"
    );
    expect(screen.getByRole("button", { name: "種目を追加" })).toBeInTheDocument();
  });
});
