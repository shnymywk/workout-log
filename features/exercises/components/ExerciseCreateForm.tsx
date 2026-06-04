"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { createExercise } from "@/features/exercises/actions/exercises";
import type { BodyPart } from "@/features/exercises/types/body-part";
import { initialExerciseActionState } from "@/features/exercises/types/exercise";
import { Button, Field, Input, Label, Select } from "@/components/primitives";

type ExerciseCreateFormProps = {
  bodyParts: BodyPart[];
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.5fr);
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
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
      {pending ? "追加中" : "種目を追加"}
    </Button>
  );
}

export function ExerciseCreateForm({ bodyParts }: ExerciseCreateFormProps) {
  const [state, formAction] = useActionState(createExercise, initialExerciseActionState);

  return (
    <Form action={formAction}>
      <FormGrid>
        <Field>
          <Label htmlFor="exercise-name">種目名</Label>
          <Input id="exercise-name" name="name" placeholder="ベンチプレスなど" required />
        </Field>
        <Field>
          <Label htmlFor="exercise-body-part">部位</Label>
          <Select id="exercise-body-part" name="bodyPartId" defaultValue="">
            <option value="">未分類</option>
            {bodyParts.map((bodyPart) => (
              <option key={bodyPart.id} value={bodyPart.id}>
                {bodyPart.name}
              </option>
            ))}
          </Select>
        </Field>
      </FormGrid>
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
