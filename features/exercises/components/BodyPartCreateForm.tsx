"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import {
  createBodyPart,
  initialBodyPartActionState
} from "@/features/exercises/actions/body-parts";
import { Button, Field, Input, Label } from "@/components/primitives";

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Message = styled.p<{ $tone: "success" | "error" }>`
  margin: 0;
  color: ${({ theme, $tone }) =>
    $tone === "success" ? theme.colors.linkBlue : theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "追加中" : "部位を追加"}
    </Button>
  );
}

export function BodyPartCreateForm() {
  const [state, formAction] = useActionState(createBodyPart, initialBodyPartActionState);

  return (
    <Form action={formAction}>
      <Field>
        <Label htmlFor="body-part-name">部位名</Label>
        <Input id="body-part-name" name="name" placeholder="胸、背中、脚など" required />
      </Field>
      {state.error ? (
        <Message $tone="error" role="alert">
          {state.error}
        </Message>
      ) : null}
      {state.success ? <Message $tone="success">{state.success}</Message> : null}
      <Actions>
        <SubmitButton />
      </Actions>
    </Form>
  );
}
