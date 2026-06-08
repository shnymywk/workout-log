"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
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

type EditableSet = {
  id: string;
  weight: string;
  reps: string;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const SetRows = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: 2rem repeat(2, minmax(0, 1fr)) auto;
  gap: ${({ theme }) => theme.space[2]};
  align-items: end;

  @media (max-width: 833px) {
    grid-template-columns: 2rem minmax(5.5rem, 1fr) minmax(5.5rem, 1fr) 2.75rem;
  }
`;

const SetNumber = styled.span`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  color: #66726f;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
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

const AddActionButton = styled(Button)`
  border-color: rgba(24, 124, 112, 0.32);
  color: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #edf6f4;
  }
`;

const DeleteIconActionButton = styled(DeleteActionButton)`
  padding: 0.625rem;
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

function formatWeight(weight: number) {
  return Number.isInteger(weight) ? weight.toString() : weight.toFixed(2).replace(/0+$/, "");
}

function buildEditableSets(workoutLog: WorkoutLog): EditableSet[] {
  if (workoutLog.workout_log_sets && workoutLog.workout_log_sets.length > 0) {
    return [...workoutLog.workout_log_sets]
      .sort((firstSet, secondSet) => firstSet.set_number - secondSet.set_number)
      .map((set) => ({
        id: set.id,
        weight: set.weight.toString(),
        reps: set.reps.toString()
      }));
  }

  return Array.from({ length: workoutLog.sets }, (_, index) => ({
    id: `${workoutLog.id}-set-${index + 1}`,
    weight: workoutLog.weight.toString(),
    reps: workoutLog.reps.toString()
  }));
}

function formatSetSummary(setDetails: EditableSet[]) {
  return setDetails
    .map(
      (setDetail, index) =>
        `${index + 1}set ${formatWeight(Number(setDetail.weight))}kg x ${setDetail.reps}rep`
    )
    .join(" / ");
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
  const [setDetails, setSetDetails] = useState<EditableSet[]>(() => buildEditableSets(workoutLog));
  const editFormId = `${workoutLog.id}-edit-form`;
  const serializedSetDetails = useMemo(
    () =>
      JSON.stringify(
        setDetails.map((setDetail) => ({
          weight: setDetail.weight,
          reps: setDetail.reps
        }))
      ),
    [setDetails]
  );
  const volume = calculateWorkoutLogVolume({
    ...workoutLog,
    workout_log_sets: setDetails.map((setDetail, index) => ({
      id: setDetail.id,
      set_number: index + 1,
      weight: Number(setDetail.weight),
      reps: Number(setDetail.reps)
    }))
  });

  function updateSet(setId: string, nextValues: Partial<EditableSet>) {
    setSetDetails((currentSetDetails) =>
      currentSetDetails.map((setDetail) =>
        setDetail.id === setId ? { ...setDetail, ...nextValues } : setDetail
      )
    );
  }

  function addSet() {
    setSetDetails((currentSetDetails) => [
      ...currentSetDetails,
      {
        id: `${workoutLog.id}-set-${Date.now()}-${currentSetDetails.length + 1}`,
        weight: "0",
        reps: "0"
      }
    ]);
  }

  function removeSet(setId: string) {
    setSetDetails((currentSetDetails) =>
      currentSetDetails.filter((setDetail) => setDetail.id !== setId)
    );
  }

  return (
    <Row>
      <Summary>
        <div>
          <SummaryTitle>{workoutLog.exercise_name}</SummaryTitle>
          <SummaryMeta>
            {workoutLog.trained_at} / {formatSetSummary(setDetails)}
          </SummaryMeta>
        </div>
        <Volume>{volume.toLocaleString()}kg</Volume>
      </Summary>

      <EditForm id={editFormId} action={formAction}>
        <input type="hidden" name="id" value={workoutLog.id} />
        <input type="hidden" name="setDetails" value={serializedSetDetails} />
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
        </EditGrid>
        <SetRows>
          {setDetails.map((setDetail, index) => (
            <SetRow key={setDetail.id} data-testid="edit-set-row">
              <SetNumber>{index + 1}</SetNumber>
              <Field>
                {index === 0 ? <Label htmlFor={`${setDetail.id}-weight`}>重量</Label> : null}
                <Input
                  id={`${setDetail.id}-weight`}
                  aria-label={index === 0 ? undefined : "重量"}
                  inputMode="decimal"
                  value={setDetail.weight}
                  onChange={(event) => updateSet(setDetail.id, { weight: event.target.value })}
                />
              </Field>
              <Field>
                {index === 0 ? <Label htmlFor={`${setDetail.id}-reps`}>回数</Label> : null}
                <Input
                  id={`${setDetail.id}-reps`}
                  aria-label={index === 0 ? undefined : "回数"}
                  inputMode="numeric"
                  value={setDetail.reps}
                  onChange={(event) => updateSet(setDetail.id, { reps: event.target.value })}
                />
              </Field>
              <DeleteIconActionButton
                type="button"
                variant="ghost"
                aria-label={`${workoutLog.exercise_name}のセット${index + 1}を削除`}
                title={`${workoutLog.exercise_name}のセット${index + 1}を削除`}
                disabled={setDetails.length === 1}
                onClick={() => removeSet(setDetail.id)}
              >
                <Trash2 aria-hidden="true" size={18} />
              </DeleteIconActionButton>
            </SetRow>
          ))}
        </SetRows>
        <RowActions>
          <AddActionButton type="button" variant="secondary" onClick={addSet}>
            <Plus aria-hidden="true" size={18} />
            セット追加
          </AddActionButton>
        </RowActions>
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
