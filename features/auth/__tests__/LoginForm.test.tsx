import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/auth/actions", () => ({
  login: jest.fn(),
  loginAsGuest: jest.fn(),
  signUp: jest.fn()
}));

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(
      <ThemeProvider theme={theme}>
        <LoginForm nextPath="/workouts" />
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { name: "ログイン" })).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ゲストで試す" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("/workouts")).toBeInTheDocument();
  });

  it("switches to sign up mode", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <LoginForm nextPath="/dashboard" />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("tab", { name: "新規登録" }));

    expect(screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録する" })).toBeInTheDocument();
    expect(
      screen.getByText("メール確認が有効な場合は、確認メールのリンクから登録を完了します。")
    ).toBeInTheDocument();
  });

  it("can render sign up mode first", () => {
    render(
      <ThemeProvider theme={theme}>
        <LoginForm initialMode="signUp" nextPath="/dashboard" />
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録する" })).toBeInTheDocument();
  });
});
