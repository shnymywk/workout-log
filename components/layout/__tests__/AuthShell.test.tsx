import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { AuthShell } from "@/components/layout/AuthShell";
import { theme } from "@/lib/styles/theme";

describe("AuthShell", () => {
  it("renders a link back to the home page", () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthShell>
          <p>ログインフォーム</p>
        </AuthShell>
      </ThemeProvider>
    );

    expect(screen.getByRole("link", { name: "トップへ戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByText("ログインフォーム")).toBeInTheDocument();
  });
});
