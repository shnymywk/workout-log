import { render, screen } from "@testing-library/react";

import { AppTitle } from "../AppTitle";

describe("AppTitle", () => {
  it("renders the title and description", () => {
    render(
      <AppTitle
        title="Workout Log"
        description="トレーニング記録をシンプルに管理するアプリです。"
      />
    );

    expect(screen.getByRole("heading", { name: "Workout Log" })).toBeInTheDocument();
    expect(
      screen.getByText("トレーニング記録をシンプルに管理するアプリです。")
    ).toBeInTheDocument();
  });
});
