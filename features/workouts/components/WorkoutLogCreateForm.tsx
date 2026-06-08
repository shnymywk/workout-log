"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { Button, EmptyState, Field, Input, Label, Select, Textarea } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { createWorkoutLog } from "@/features/workouts/actions/workout-logs";
import { calculateWorkoutSetDetailsVolume } from "@/features/workouts/lib/volume";
import {
  initialWorkoutLogActionState,
  type WorkoutLogActionState
} from "@/features/workouts/types/workout-log";

type WorkoutLogCreateFormProps = {
  exercises: Exercise[];
};

type DraftSet = {
  id: string;
  weight: string;
  reps: string;
};

type DraftWorkoutLog = {
  id: string;
  exerciseId: string;
  memo: string;
  sets: DraftSet[];
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
`;

const Message = styled.p<{ $tone: "success" | "error" }>`
  margin: 0;
  color: ${({ theme, $tone }) => ($tone === "success" ? "#187c70" : theme.colors.danger)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const VolumePreview = styled.div`
  border: 1px solid rgba(24, 124, 112, 0.18);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #edf6f4;
  padding: ${({ theme }) => theme.space[4]};
`;

const VolumeLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[1]};
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const VolumeValue = styled.p`
  margin: 0;
  color: #187c70;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.75rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const WorkoutLogStack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const WorkoutLogCard = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  padding: ${({ theme }) => theme.space[4]};
`;

const WorkoutLogHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[3]};
  align-items: end;

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

const AddButton = styled(Button)`
  border-color: rgba(24, 124, 112, 0.32);
  color: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #edf6f4;
  }
`;

const IconButton = styled(Button)`
  padding: 0.625rem;
`;

const RemoveButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.danger};

  &:hover:not(:disabled) {
    background: #fff7f5;
  }
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

function getTodayDateValue() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

function createDraftId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function createDraftSet(): DraftSet {
  return {
    id: createDraftId(),
    weight: "",
    reps: ""
  };
}

function createDraftWorkoutLog(exerciseId: string): DraftWorkoutLog {
  return {
    id: createDraftId(),
    exerciseId,
    memo: "",
    sets: [createDraftSet()]
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <PrimarySubmitButton type="submit" disabled={pending}>
      {pending ? "保存中" : "記録する"}
    </PrimarySubmitButton>
  );
}

function createInitialWorkoutLogs(exerciseId: string) {
  return [createDraftWorkoutLog(exerciseId)];
}

export function WorkoutLogCreateForm({ exercises }: WorkoutLogCreateFormProps) {
  const initialExerciseId = exercises[0]?.id ?? "";
  const [trainedAt, setTrainedAt] = useState(getTodayDateValue);
  const [workoutLogs, setWorkoutLogs] = useState<DraftWorkoutLog[]>(() =>
    createInitialWorkoutLogs(initialExerciseId)
  );
  const [state, formAction] = useActionState(
    async (previousState: WorkoutLogActionState, formData: FormData) => {
      const nextState = await createWorkoutLog(previousState, formData);

      if (nextState.success) {
        setTrainedAt(getTodayDateValue());
        setWorkoutLogs(createInitialWorkoutLogs(initialExerciseId));
      }

      return nextState;
    },
    initialWorkoutLogActionState
  );
  const serializedWorkoutLogs = useMemo(
    () =>
      JSON.stringify(
        workoutLogs.map((workoutLog) => ({
          exerciseId: workoutLog.exerciseId,
          memo: workoutLog.memo,
          sets: workoutLog.sets.map((set) => ({
            weight: set.weight,
            reps: set.reps
          }))
        }))
      ),
    [workoutLogs]
  );
  const totalVolume = useMemo(
    () =>
      workoutLogs.reduce(
        (total, workoutLog) =>
          total +
          calculateWorkoutSetDetailsVolume(
            workoutLog.sets.map((set) => ({
              weight: Number(set.weight),
              reps: Number(set.reps)
            }))
          ),
        0
      ),
    [workoutLogs]
  );

  function updateWorkoutLog(workoutLogId: string, nextValues: Partial<DraftWorkoutLog>) {
    setWorkoutLogs((currentWorkoutLogs) =>
      currentWorkoutLogs.map((workoutLog) =>
        workoutLog.id === workoutLogId ? { ...workoutLog, ...nextValues } : workoutLog
      )
    );
  }

  function addWorkoutLog() {
    setWorkoutLogs((currentWorkoutLogs) => [
      ...currentWorkoutLogs,
      createDraftWorkoutLog(initialExerciseId)
    ]);
  }

  function removeWorkoutLog(workoutLogId: string) {
    setWorkoutLogs((currentWorkoutLogs) =>
      currentWorkoutLogs.filter((workoutLog) => workoutLog.id !== workoutLogId)
    );
  }

  function updateSet(workoutLogId: string, setId: string, nextValues: Partial<DraftSet>) {
    setWorkoutLogs((currentWorkoutLogs) =>
      currentWorkoutLogs.map((workoutLog) => {
        if (workoutLog.id !== workoutLogId) {
          return workoutLog;
        }

        return {
          ...workoutLog,
          sets: workoutLog.sets.map((set) => (set.id === setId ? { ...set, ...nextValues } : set))
        };
      })
    );
  }

  function addSet(workoutLogId: string) {
    setWorkoutLogs((currentWorkoutLogs) =>
      currentWorkoutLogs.map((workoutLog) =>
        workoutLog.id === workoutLogId
          ? { ...workoutLog, sets: [...workoutLog.sets, createDraftSet()] }
          : workoutLog
      )
    );
  }

  function removeSet(workoutLogId: string, setId: string) {
    setWorkoutLogs((currentWorkoutLogs) =>
      currentWorkoutLogs.map((workoutLog) =>
        workoutLog.id === workoutLogId
          ? { ...workoutLog, sets: workoutLog.sets.filter((set) => set.id !== setId) }
          : workoutLog
      )
    );
  }

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
          <Label htmlFor="trained-at">日付</Label>
          <Input
            id="trained-at"
            name="trainedAt"
            type="date"
            value={trainedAt}
            onChange={(event) => setTrainedAt(event.target.value)}
          />
        </Field>

        <VolumePreview aria-live="polite">
          <VolumeLabel>総ボリューム</VolumeLabel>
          <VolumeValue>{totalVolume.toLocaleString()}kg</VolumeValue>
        </VolumePreview>
      </FormGrid>

      <input type="hidden" name="logs" value={serializedWorkoutLogs} />

      <WorkoutLogStack>
        {workoutLogs.map((workoutLog, workoutLogIndex) => (
          <WorkoutLogCard key={workoutLog.id}>
            <WorkoutLogHeader>
              <Field>
                <Label htmlFor={`${workoutLog.id}-exercise-id`}>種目 {workoutLogIndex + 1}</Label>
                <Select
                  id={`${workoutLog.id}-exercise-id`}
                  value={workoutLog.exerciseId}
                  onChange={(event) =>
                    updateWorkoutLog(workoutLog.id, { exerciseId: event.target.value })
                  }
                  required
                >
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </Select>
              </Field>
              {workoutLogs.length > 1 ? (
                <RemoveButton
                  type="button"
                  variant="ghost"
                  aria-label={`種目${workoutLogIndex + 1}を削除`}
                  title={`種目${workoutLogIndex + 1}を削除`}
                  onClick={() => removeWorkoutLog(workoutLog.id)}
                >
                  <Trash2 aria-hidden="true" size={18} />
                </RemoveButton>
              ) : null}
            </WorkoutLogHeader>

            <SetRows>
              {workoutLog.sets.map((set, setIndex) => (
                <SetRow key={set.id} data-testid="set-row">
                  <SetNumber>{setIndex + 1}</SetNumber>
                  <Field>
                    {setIndex === 0 ? <Label htmlFor={`${set.id}-weight`}>重量</Label> : null}
                    <Input
                      id={`${set.id}-weight`}
                      aria-label={setIndex === 0 ? undefined : "重量"}
                      inputMode="decimal"
                      placeholder="70"
                      value={set.weight}
                      onChange={(event) =>
                        updateSet(workoutLog.id, set.id, { weight: event.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    {setIndex === 0 ? <Label htmlFor={`${set.id}-reps`}>回数</Label> : null}
                    <Input
                      id={`${set.id}-reps`}
                      aria-label={setIndex === 0 ? undefined : "回数"}
                      inputMode="numeric"
                      placeholder="8"
                      value={set.reps}
                      onChange={(event) =>
                        updateSet(workoutLog.id, set.id, { reps: event.target.value })
                      }
                    />
                  </Field>
                  <RemoveButton
                    type="button"
                    variant="ghost"
                    aria-label={`種目${workoutLogIndex + 1}のセット${setIndex + 1}を削除`}
                    title={`種目${workoutLogIndex + 1}のセット${setIndex + 1}を削除`}
                    disabled={workoutLog.sets.length === 1}
                    onClick={() => removeSet(workoutLog.id, set.id)}
                  >
                    <Trash2 aria-hidden="true" size={18} />
                  </RemoveButton>
                </SetRow>
              ))}
            </SetRows>

            <Actions>
              <AddButton type="button" variant="secondary" onClick={() => addSet(workoutLog.id)}>
                <Plus aria-hidden="true" size={18} />
                セット追加
              </AddButton>
            </Actions>

            <Field>
              <Label htmlFor={`${workoutLog.id}-memo`}>メモ</Label>
              <Textarea
                id={`${workoutLog.id}-memo`}
                placeholder="フォーム、疲労感、次回の目安など"
                value={workoutLog.memo}
                onChange={(event) => updateWorkoutLog(workoutLog.id, { memo: event.target.value })}
              />
            </Field>
          </WorkoutLogCard>
        ))}
      </WorkoutLogStack>

      {state.error ? (
        <Message $tone="error" role="alert">
          {state.error}
        </Message>
      ) : null}
      {state.success ? <Message $tone="success">{state.success}</Message> : null}

      <Actions>
        <AddButton type="button" variant="secondary" onClick={addWorkoutLog}>
          <Plus aria-hidden="true" size={18} />
          種目追加
        </AddButton>
        <SubmitButton />
      </Actions>
    </Form>
  );
}
