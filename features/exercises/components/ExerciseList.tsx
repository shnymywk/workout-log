"use client";

import { Save, Trash2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { deleteExercise, updateExercise } from "@/features/exercises/actions/exercises";
import type { BodyPart } from "@/features/exercises/types/body-part";
import { initialExerciseActionState, type Exercise } from "@/features/exercises/types/exercise";
import { Button, EmptyState, Input } from "@/components/primitives";

type ExerciseListProps = {
  bodyParts: BodyPart[];
  exercises: Exercise[];
};

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.04) 0 12px 32px;
  padding: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const EditForm = styled.form`
  display: grid;
  grid-template-columns: minmax(12rem, 0.65fr) minmax(24rem, 1.35fr);
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  min-width: 0;

  input {
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

const EditField = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

const DeleteForm = styled.form`
  display: contents;
`;

const FieldCaption = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const BodyPartHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
`;

const BodyPartSummary = styled.p`
  margin: 0;
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
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

const RowActions = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 833px) {
    justify-content: flex-start;
  }
`;

const Message = styled.p<{ $tone: "success" | "error" }>`
  margin: 0;
  color: ${({ theme, $tone }) => ($tone === "success" ? "#187c70" : theme.colors.danger)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SaveActionButton = styled(Button)`
  border-color: rgba(24, 124, 112, 0.32);
  color: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #edf6f4;
  }
`;

const DeleteActionButton = styled(Button)`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #fff7f5;
  }
`;

function UpdateButton({ formId, pending }: { formId: string; pending: boolean }) {
  return (
    <SaveActionButton type="submit" variant="secondary" form={formId} disabled={pending}>
      <Save aria-hidden="true" size={18} strokeWidth={2.2} />
      {pending ? "保存中" : "保存"}
    </SaveActionButton>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <DeleteActionButton type="submit" variant="ghost" disabled={pending}>
      <Trash2 aria-hidden="true" size={18} strokeWidth={2.2} />
      {pending ? "削除中" : "削除"}
    </DeleteActionButton>
  );
}

function ExerciseRow({ bodyParts, exercise }: { bodyParts: BodyPart[]; exercise: Exercise }) {
  const [state, formAction, isUpdatePending] = useActionState(
    updateExercise,
    initialExerciseActionState
  );
  const editFormId = `${exercise.id}-edit-form`;
  const selectedBodyPartIds = new Set(exercise.bodyParts.map((bodyPart) => bodyPart.id));
  const bodyPartNames =
    exercise.bodyParts.length > 0
      ? exercise.bodyParts.map((bodyPart) => bodyPart.name).join("・")
      : "未分類";

  return (
    <Row>
      <EditForm id={editFormId} action={formAction}>
        <input type="hidden" name="id" value={exercise.id} />
        <EditField>
          <FieldCaption>種目名</FieldCaption>
          <Input name="name" defaultValue={exercise.name} aria-label={`${exercise.name}の種目名`} />
        </EditField>
        <EditField>
          <BodyPartHeader>
            <FieldCaption>部位</FieldCaption>
            <BodyPartSummary>{bodyPartNames}</BodyPartSummary>
          </BodyPartHeader>
          <CheckboxGroup aria-label={`${exercise.name}の部位`}>
            {bodyParts.map((bodyPart) => (
              <CheckboxLabel key={bodyPart.id}>
                <input
                  name="bodyPartIds"
                  type="checkbox"
                  value={bodyPart.id}
                  defaultChecked={selectedBodyPartIds.has(bodyPart.id)}
                />
                <CheckboxText>{bodyPart.name}</CheckboxText>
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </EditField>
        {state.error ? (
          <Message $tone="error" role="alert">
            {state.error}
          </Message>
        ) : null}
        {state.success ? <Message $tone="success">{state.success}</Message> : null}
      </EditForm>

      <RowActions data-testid="exercise-row-actions">
        <UpdateButton formId={editFormId} pending={isUpdatePending} />
        <DeleteForm action={deleteExercise}>
          <input type="hidden" name="id" value={exercise.id} />
          <DeleteButton />
        </DeleteForm>
      </RowActions>
    </Row>
  );
}

export function ExerciseList({ bodyParts, exercises }: ExerciseListProps) {
  if (exercises.length === 0) {
    return <EmptyState>条件に一致する種目がありません。</EmptyState>;
  }

  return (
    <List>
      {exercises.map((exercise) => (
        <ExerciseRow key={exercise.id} bodyParts={bodyParts} exercise={exercise} />
      ))}
    </List>
  );
}
