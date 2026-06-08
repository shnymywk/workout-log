import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { WorkoutLogFilter } from "@/features/workouts/components/WorkoutLogFilter";
import { theme } from "@/lib/styles/theme";

const exercises = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "ベンチプレス",
    body_part_id: "22222222-2222-4222-8222-222222222222",
    created_at: "2026-06-03T00:00:00.000Z",
    bodyParts: []
  }
];

describe("WorkoutLogFilter", () => {
  it("renders trained date options as a select filter", () => {
    render(
      <ThemeProvider theme={theme}>
        <WorkoutLogFilter
          exercises={exercises}
          filters={{
            trainedAt: "2026-06-03",
            exerciseId: "11111111-1111-4111-8111-111111111111"
          }}
          trainedAts={["2026-06-04", "2026-06-03"]}
        />
      </ThemeProvider>
    );

    const trainedAtSelect = screen.getByLabelText("日付");

    expect(trainedAtSelect).toHaveValue("2026-06-03");
    expect(trainedAtSelect).not.toHaveAttribute("type", "date");
    expect(within(trainedAtSelect).getByRole("option", { name: "すべて" })).toHaveValue("");
    expect(within(trainedAtSelect).getByRole("option", { name: "2026-06-04" })).toHaveValue(
      "2026-06-04"
    );
    expect(within(trainedAtSelect).getByRole("option", { name: "2026-06-03" })).toHaveValue(
      "2026-06-03"
    );
    expect(screen.getByLabelText("種目")).toHaveValue("11111111-1111-4111-8111-111111111111");
    expect(screen.getByRole("button", { name: "絞り込む" })).toBeInTheDocument();
  });
});
