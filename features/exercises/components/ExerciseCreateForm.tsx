"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { createExercise } from "@/features/exercises/actions/exercises";
import type { BodyPart } from "@/features/exercises/types/body-part";
import { initialExerciseActionState } from "@/features/exercises/types/exercise";
import { Button, Field, Input, Label } from "@/components/primitives";

type ExerciseCreateFormProps = {
  bodyParts: BodyPart[];
};

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

const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const CheckboxFieldset = styled.fieldset`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
  margin: 0;
  border: 0;
  padding: 0;
`;

const CheckboxLegend = styled.legend`
  margin: 0 0 ${({ theme }) => theme.space[2]};
  padding: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  line-height: 1.4;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  input:checked + span {
    border-color: rgba(24, 124, 112, 0.28);
    background: #187c70;
    color: #ffffff;
  }
`;

const CheckboxText = styled.span`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  border: 1px solid rgba(20, 32, 29, 0.14);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #ffffff;
  padding: 0.625rem 0.875rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease;
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
      {pending ? "追加中" : "種目を追加"}
    </PrimarySubmitButton>
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
        <CheckboxFieldset>
          <CheckboxLegend>部位</CheckboxLegend>
          <CheckboxGroup>
            {bodyParts.map((bodyPart) => (
              <CheckboxLabel key={bodyPart.id}>
                <input name="bodyPartIds" type="checkbox" value={bodyPart.id} />
                <CheckboxText>{bodyPart.name}</CheckboxText>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </CheckboxFieldset>
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
