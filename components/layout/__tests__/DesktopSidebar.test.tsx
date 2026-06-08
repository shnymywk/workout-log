import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/auth/components/LogoutButton", () => ({
  LogoutButton: ({ compact }: { compact?: boolean }) => (
    <button type="button">{compact ? "ログアウト compact" : "ログアウト"}</button>
  )
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

  it("keeps navigation accessible when collapsed", () => {
    render(
      <ThemeProvider theme={theme}>
        <DesktopSidebar collapsed ownerEmail="owner@example.com" pathname="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByRole("button", { hidden: true, name: "サイドバーを展開" })).toBeInTheDocument();
    expect(screen.getByRole("link", { hidden: true, name: "ダッシュボード" })).toBeInTheDocument();
    expect(screen.getByText("ログアウト compact")).toBeInTheDocument();
    expect(screen.queryByText("owner@example.com")).not.toBeInTheDocument();
  });
});
