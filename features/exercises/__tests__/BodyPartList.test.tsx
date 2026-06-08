import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { BodyPartList } from "@/features/exercises/components/BodyPartList";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/exercises/actions/body-parts", () => ({
  deleteBodyPart: jest.fn(),
  updateBodyPart: jest.fn()
}));

const bodyParts = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "胸",
    created_at: "2026-06-03T00:00:00.000Z"
  }
];

describe("BodyPartList", () => {
  it("keeps action buttons in one row", () => {
    render(
      <ThemeProvider theme={theme}>
        <BodyPartList bodyParts={bodyParts} />
      </ThemeProvider>
    );

    expect(screen.getByLabelText("胸の部位名")).toBeInTheDocument();

    const actionRow = screen.getByTestId("body-part-row-actions");

    expect(within(actionRow).getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(within(actionRow).getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(
      <ThemeProvider theme={theme}>
        <BodyPartList bodyParts={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText("まだ部位が登録されていません。")).toBeInTheDocument();
  });
});
