"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import {
  initialGuestLoginActionState,
  initialLoginActionState,
  initialSignUpActionState
} from "@/features/auth/action-state";
import { login, loginAsGuest, signUp } from "@/features/auth/actions";
import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Label
} from "@/components/primitives";

type LoginFormProps = {
  initialMode?: "login" | "signUp";
  nextPath?: string;
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  input {
    min-height: 3rem;
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }

  label {
    color: #1b2321;
  }
`;

const ModeTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #f3f6f5;
  padding: ${({ theme }) => theme.space[1]};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  min-height: 2.75rem;
  border: 1px solid ${({ $active }) => ($active ? "rgba(24, 124, 112, 0.22)" : "transparent")};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#187c70" : "#55615e")};
  box-shadow: ${({ $active }) => ($active ? "rgba(12, 28, 24, 0.08) 0 8px 24px" : "none")};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#ffffff" : "#edf6f4")};
  }
`;

const HelperText = styled.p`
  margin: 0;
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: 1.5;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SuccessText = styled.p`
  margin: 0;
  color: #187c70;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const AuthCard = styled(Card)`
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.08) 0 24px 70px;
  padding: ${({ theme }) => theme.space[5]};
`;

const AuthCardHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const AuthCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1.5rem;
  font-weight: 700;
`;

const AuthCardDescription = styled(CardDescription)`
  color: #55615e;
`;

const AuthCardBody = styled(CardBody)`
  gap: ${({ theme }) => theme.space[5]};
`;

const AuthSubmitButton = styled(Button)`
  min-height: 3rem;
  background: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #104b44;
  }
`;

const GuestForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const GuestSubmitButton = styled(Button)`
  min-height: 3rem;
`;

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <AuthSubmitButton type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </AuthSubmitButton>
  );
}

function GuestLoginButton() {
  const { pending } = useFormStatus();

  return (
    <GuestSubmitButton type="submit" variant="secondary" disabled={pending}>
      {pending ? "準備中" : "ゲストで試す"}
    </GuestSubmitButton>
  );
}

export function LoginForm({ initialMode = "login", nextPath = "/dashboard" }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "signUp">(initialMode);
  const [loginState, loginFormAction] = useActionState(login, initialLoginActionState);
  const [signUpState, signUpFormAction] = useActionState(signUp, initialSignUpActionState);
  const [guestLoginState, guestLoginFormAction] = useActionState(
    loginAsGuest,
    initialGuestLoginActionState
  );
  const isLoginMode = mode === "login";

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>{isLoginMode ? "ログイン" : "新規登録"}</AuthCardTitle>
        <AuthCardDescription>
          {isLoginMode
            ? "メールアドレスとパスワードでWorkout Logに入ります。"
            : "メールアドレスとパスワードでWorkout Logのアカウントを作成します。"}
        </AuthCardDescription>
      </AuthCardHeader>
      <AuthCardBody>
        <ModeTabs role="tablist" aria-label="認証モード">
          <ModeButton
            type="button"
            $active={isLoginMode}
            aria-selected={isLoginMode}
            role="tab"
            onClick={() => setMode("login")}
          >
            ログイン
          </ModeButton>
          <ModeButton
            type="button"
            $active={!isLoginMode}
            aria-selected={!isLoginMode}
            role="tab"
            onClick={() => setMode("signUp")}
          >
            新規登録
          </ModeButton>
        </ModeTabs>

        <Form action={isLoginMode ? loginFormAction : signUpFormAction}>
          <input type="hidden" name="next" value={nextPath} />
          <Field>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </Field>
          <Field>
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              placeholder="8文字以上"
              required
            />
          </Field>
          {isLoginMode && loginState.error ? (
            <ErrorText role="alert">{loginState.error}</ErrorText>
          ) : null}
          {!isLoginMode && signUpState.error ? (
            <ErrorText role="alert">{signUpState.error}</ErrorText>
          ) : null}
          {!isLoginMode && signUpState.success ? (
            <SuccessText role="status">{signUpState.success}</SuccessText>
          ) : null}
          <SubmitButton
            label={isLoginMode ? "ログイン" : "登録する"}
            pendingLabel={isLoginMode ? "ログイン中" : "登録中"}
          />
          <HelperText>
            {isLoginMode
              ? "Supabase Authで認証し、ログイン後はダッシュボードへ移動します。"
              : "メール確認が有効な場合は、確認メールのリンクから登録を完了します。"}
          </HelperText>
        </Form>
        <GuestForm action={guestLoginFormAction}>
          {guestLoginState.error ? <ErrorText role="alert">{guestLoginState.error}</ErrorText> : null}
          <GuestLoginButton />
        </GuestForm>
      </AuthCardBody>
    </AuthCard>
  );
}
