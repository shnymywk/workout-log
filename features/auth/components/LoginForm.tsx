"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { initialLoginActionState, initialSignUpActionState } from "@/features/auth/action-state";
import { login, signUp } from "@/features/auth/actions";
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
  gap: ${({ theme }) => theme.space[4]};
`;

const ModeTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[2]};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  min-height: 2.5rem;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.textPrimary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $active }) => ($active ? theme.colors.textPrimary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.textOnDark : theme.colors.textPrimary)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const HelperText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
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
  color: ${({ theme }) => theme.colors.linkBlue};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function LoginForm({ initialMode = "login", nextPath = "/dashboard" }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "signUp">(initialMode);
  const [loginState, loginFormAction] = useActionState(login, initialLoginActionState);
  const [signUpState, signUpFormAction] = useActionState(signUp, initialSignUpActionState);
  const isLoginMode = mode === "login";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLoginMode ? "ログイン" : "新規登録"}</CardTitle>
        <CardDescription>
          {isLoginMode
            ? "メールアドレスとパスワードでWorkout Logに入ります。"
            : "メールアドレスとパスワードでWorkout Logのアカウントを作成します。"}
        </CardDescription>
      </CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>
  );
}
