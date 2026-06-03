import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { theme } from "@/lib/styles/theme";

jest.mock("@/features/auth/actions", () => ({
  initialLoginActionState: {
    error: null
  },
  login: jest.fn()
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
    expect(screen.getByDisplayValue("/workouts")).toBeInTheDocument();
  });
});
