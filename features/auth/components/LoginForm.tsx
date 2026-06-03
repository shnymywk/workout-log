"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { login, initialLoginActionState } from "@/features/auth/actions";
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
  nextPath?: string;
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "ログイン中" : "ログイン"}
    </Button>
  );
}

export function LoginForm({ nextPath = "/dashboard" }: LoginFormProps) {
  const [state, formAction] = useActionState(login, initialLoginActionState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>メールアドレスとパスワードでWorkout Logに入ります。</CardDescription>
      </CardHeader>
      <CardBody>
        <Form action={formAction}>
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
              autoComplete="current-password"
              placeholder="8文字以上"
              required
            />
          </Field>
          {state.error ? <ErrorText role="alert">{state.error}</ErrorText> : null}
          <SubmitButton />
          <HelperText>Supabase Authで認証し、ログイン後はダッシュボードへ移動します。</HelperText>
        </Form>
      </CardBody>
    </Card>
  );
}
