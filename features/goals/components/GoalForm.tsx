"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { Button, EmptyState, Field, Input, Label, Select } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { saveGoal } from "@/features/goals/actions/goals";
import { initialGoalActionState } from "@/features/goals/types/goal";

type GoalFormProps = {
  exercises: Exercise[];
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  input,
  select {
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible,
  select:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.45fr);
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
  color: ${({ theme, $tone }) => ($tone === "success" ? "#187c70" : theme.colors.danger)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const EmptyLink = styled(Link)`
  color: ${({ theme }) => theme.colors.linkBlue};
  font-weight: 600;
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
      {pending ? "保存中" : "目標を保存"}
    </PrimarySubmitButton>
  );
}

export function GoalForm({ exercises }: GoalFormProps) {
  const [state, formAction] = useActionState(saveGoal, initialGoalActionState);

  if (exercises.length === 0) {
    return (
      <EmptyState action={<EmptyLink href="/exercises">種目を登録する</EmptyLink>}>
        種目がまだ登録されていません。
      </EmptyState>
    );
  }

  return (
    <Form action={formAction}>
      <FormGrid>
        <Field>
          <Label htmlFor="goal-exercise-id">種目</Label>
          <Select id="goal-exercise-id" name="exerciseId" defaultValue={exercises[0]?.id} required>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="target-weight">目標重量</Label>
          <Input
            id="target-weight"
            name="targetWeight"
            inputMode="decimal"
            placeholder="100"
            required
          />
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
