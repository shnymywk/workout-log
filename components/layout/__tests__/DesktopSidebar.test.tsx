import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/auth/components/LogoutButton", () => ({
  LogoutButton: () => <button type="button">ログアウト</button>
}));

describe("DesktopSidebar", () => {
  it("shows the signed-in owner email", () => {
    render(
      <ThemeProvider theme={theme}>
        <DesktopSidebar ownerEmail="owner@example.com" pathname="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(screen.queryByText("sample@example.com")).not.toBeInTheDocument();
  });

  it("shows a fallback when owner email is unavailable", () => {
    render(
      <ThemeProvider theme={theme}>
        <DesktopSidebar ownerEmail={null} pathname="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByText("メールアドレス未取得")).toBeInTheDocument();
  });
});
