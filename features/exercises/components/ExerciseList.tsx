"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { deleteExercise, updateExercise } from "@/features/exercises/actions/exercises";
import type { BodyPart } from "@/features/exercises/types/body-part";
import { initialExerciseActionState, type Exercise } from "@/features/exercises/types/exercise";
import { Button, EmptyState, Input, Select } from "@/components/primitives";

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
  align-items: start;
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
  gap: ${({ theme }) => theme.space[2]};

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

const EditControls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.45fr) auto;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const DeleteForm = styled.form`
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

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <SaveActionButton type="submit" variant="secondary" disabled={pending}>
      {pending ? "保存中" : "保存"}
    </SaveActionButton>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <DeleteActionButton type="submit" variant="ghost" disabled={pending}>
      {pending ? "削除中" : "削除"}
    </DeleteActionButton>
  );
}

function ExerciseRow({ bodyParts, exercise }: { bodyParts: BodyPart[]; exercise: Exercise }) {
  const [state, formAction] = useActionState(updateExercise, initialExerciseActionState);

  return (
    <Row>
      <EditForm action={formAction}>
        <input type="hidden" name="id" value={exercise.id} />
        <EditControls>
          <Input name="name" defaultValue={exercise.name} aria-label={`${exercise.name}の種目名`} />
          <Select
            name="bodyPartId"
            defaultValue={exercise.body_part_id ?? ""}
            aria-label={`${exercise.name}の部位`}
          >
            <option value="">未分類</option>
            {bodyParts.map((bodyPart) => (
              <option key={bodyPart.id} value={bodyPart.id}>
                {bodyPart.name}
              </option>
            ))}
          </Select>
          <UpdateButton />
        </EditControls>
        {state.error ? (
          <Message $tone="error" role="alert">
            {state.error}
          </Message>
        ) : null}
        {state.success ? <Message $tone="success">{state.success}</Message> : null}
      </EditForm>

      <DeleteForm action={deleteExercise}>
        <input type="hidden" name="id" value={exercise.id} />
        <DeleteButton />
      </DeleteForm>
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
