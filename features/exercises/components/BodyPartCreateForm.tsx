"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { createBodyPart } from "@/features/exercises/actions/body-parts";
import { initialBodyPartActionState } from "@/features/exercises/types/body-part";
import { Button, Field, Input, Label } from "@/components/primitives";

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  input {
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Message = styled.p<{ $tone: "success" | "error" }>`
  margin: 0;
  color: ${({ theme, $tone }) => ($tone === "success" ? "#187c70" : theme.colors.danger)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const PrimarySubmitButton = styled(Button)`
  background: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #104b44;
  }
`;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <PrimarySubmitButton type="submit" disabled={pending}>
      {pending ? "追加中" : "部位を追加"}
    </PrimarySubmitButton>
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
