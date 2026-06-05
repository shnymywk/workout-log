"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { Button, EmptyState, Field, Input, Label, Select, Textarea } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { deleteWorkoutLog, updateWorkoutLog } from "@/features/workouts/actions/workout-logs";
import { calculateWorkoutLogVolume } from "@/features/workouts/lib/volume";
import {
  initialWorkoutLogActionState,
  type WorkoutLog
} from "@/features/workouts/types/workout-log";

type WorkoutLogListProps = {
  exercises: Exercise[];
  workoutLogs: WorkoutLog[];
};

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Row = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.04) 0 12px 32px;
  padding: ${({ theme }) => theme.space[4]};
`;

const Summary = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    display: grid;
  }
`;

const SummaryTitle = styled.h3`
  margin: 0;
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SummaryMeta = styled.p`
  margin: ${({ theme }) => theme.space[1]} 0 0;
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Volume = styled.p`
  margin: 0;
  border: 1px solid rgba(24, 124, 112, 0.18);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #edf6f4;
  color: #187c70;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  padding: 0.375rem 0.75rem;
`;

const EditForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};

  input,
  select,
  textarea {
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }
`;

const EditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const RowActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
`;

const DeleteForm = styled.form`
  display: contents;
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

function SaveButton({ formId, pending }: { formId: string; pending: boolean }) {
  return (
    <SaveActionButton type="submit" variant="secondary" form={formId} disabled={pending}>
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

function WorkoutLogRow({
  exercises,
  workoutLog
}: {
  exercises: Exercise[];
  workoutLog: WorkoutLog;
}) {
  const [state, formAction, isUpdatePending] = useActionState(
    updateWorkoutLog,
    initialWorkoutLogActionState
  );
  const editFormId = `${workoutLog.id}-edit-form`;
  const volume = calculateWorkoutLogVolume(workoutLog);

  return (
    <Row>
      <Summary>
        <div>
          <SummaryTitle>{workoutLog.exercise_name}</SummaryTitle>
          <SummaryMeta>
            {workoutLog.trained_at} / {workoutLog.weight}kg x {workoutLog.sets}set x{" "}
            {workoutLog.reps}rep
          </SummaryMeta>
        </div>
        <Volume>{volume.toLocaleString()}kg</Volume>
      </Summary>

      <EditForm id={editFormId} action={formAction}>
        <input type="hidden" name="id" value={workoutLog.id} />
        <EditGrid>
          <Field>
            <Label htmlFor={`${workoutLog.id}-trained-at`}>日付</Label>
            <Input
              id={`${workoutLog.id}-trained-at`}
              name="trainedAt"
              type="date"
              defaultValue={workoutLog.trained_at}
            />
          </Field>
          <Field>
            <Label htmlFor={`${workoutLog.id}-exercise-id`}>種目</Label>
            <Select
              id={`${workoutLog.id}-exercise-id`}
              name="exerciseId"
              defaultValue={workoutLog.exercise_id}
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Label htmlFor={`${workoutLog.id}-weight`}>重量</Label>
            <Input
              id={`${workoutLog.id}-weight`}
              name="weight"
              inputMode="decimal"
              defaultValue={workoutLog.weight}
            />
          </Field>
          <Field>
            <Label htmlFor={`${workoutLog.id}-sets`}>セット</Label>
            <Input
              id={`${workoutLog.id}-sets`}
              name="sets"
              inputMode="numeric"
              defaultValue={workoutLog.sets}
            />
          </Field>
          <Field>
            <Label htmlFor={`${workoutLog.id}-reps`}>回数</Label>
            <Input
              id={`${workoutLog.id}-reps`}
              name="reps"
              inputMode="numeric"
              defaultValue={workoutLog.reps}
            />
          </Field>
        </EditGrid>
        <Field>
          <Label htmlFor={`${workoutLog.id}-memo`}>メモ</Label>
          <Textarea id={`${workoutLog.id}-memo`} name="memo" defaultValue={workoutLog.memo ?? ""} />
        </Field>
        {state.error ? (
          <Message $tone="error" role="alert">
            {state.error}
          </Message>
        ) : null}
        {state.success ? <Message $tone="success">{state.success}</Message> : null}
      </EditForm>

      <RowActions>
        <SaveButton formId={editFormId} pending={isUpdatePending} />
        <DeleteForm action={deleteWorkoutLog}>
          <input type="hidden" name="id" value={workoutLog.id} />
          <DeleteButton />
        </DeleteForm>
      </RowActions>
    </Row>
  );
}

export function WorkoutLogList({ exercises, workoutLogs }: WorkoutLogListProps) {
  if (workoutLogs.length === 0) {
    return <EmptyState>条件に一致するトレーニング記録がありません。</EmptyState>;
  }

  return (
    <List>
      {workoutLogs.map((workoutLog) => (
        <WorkoutLogRow key={workoutLog.id} exercises={exercises} workoutLog={workoutLog} />
      ))}
    </List>
  );
}
