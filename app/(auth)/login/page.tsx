"use client";

import styled from "styled-components";

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

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
        <CardDescription>メールアドレスとパスワードでWorkout Logに入ります。</CardDescription>
      </CardHeader>
      <CardBody>
        <Form>
          <Field>
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" />
          </Field>
          <Field>
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="8文字以上"
            />
          </Field>
          <Button type="submit">ログイン</Button>
          <HelperText>認証処理はSupabase Authの導入フェーズで接続します。</HelperText>
        </Form>
      </CardBody>
    </Card>
  );
}
