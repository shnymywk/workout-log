"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { Button, EmptyState, Field, Input, Label, Select, Textarea } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import {
  createWorkoutLog,
  initialWorkoutLogActionState
} from "@/features/workouts/actions/workout-logs";
import { calculateWorkoutVolume } from "@/features/workouts/lib/volume";

type WorkoutLogCreateFormProps = {
  exercises: Exercise[];
};

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

const VolumePreview = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.backgroundElevated};
  padding: ${({ theme }) => theme.space[4]};
`;

const VolumeLabel = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[1]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const VolumeValue = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const EmptyLink = styled(Link)`
  color: ${({ theme }) => theme.colors.linkBlue};
  font-weight: 600;
`;

function getTodayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中" : "記録する"}
    </Button>
  );
}

export function WorkoutLogCreateForm({ exercises }: WorkoutLogCreateFormProps) {
  const [state, formAction] = useActionState(createWorkoutLog, initialWorkoutLogActionState);
  const [weight, setWeight] = useState("0");
  const [sets, setSets] = useState("0");
  const [reps, setReps] = useState("0");
  const totalVolume = useMemo(
    () => calculateWorkoutVolume(Number(weight), Number(sets), Number(reps)),
    [weight, sets, reps]
  );

  if (exercises.length === 0) {
    return (
      <EmptyState action={<EmptyLink href="/exercises">種目を登録する</EmptyLink>}>
        種目がまだ登録されていません。
      </EmptyState>
    );
  }

  return (
    <Form action={formAction}>
      <Field>
        <Label htmlFor="trained-at">日付</Label>
        <Input id="trained-at" name="trainedAt" type="date" defaultValue={getTodayDateValue()} />
      </Field>

      <Field>
        <Label htmlFor="exercise-id">種目</Label>
        <Select id="exercise-id" name="exerciseId" defaultValue={exercises[0]?.id} required>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </Select>
      </Field>

      <FormGrid>
        <Field>
          <Label htmlFor="weight">重量</Label>
          <Input
            id="weight"
            name="weight"
            inputMode="decimal"
            placeholder="70"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="sets">セット</Label>
          <Input
            id="sets"
            name="sets"
            inputMode="numeric"
            placeholder="3"
            value={sets}
            onChange={(event) => setSets(event.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="reps">回数</Label>
          <Input
            id="reps"
            name="reps"
            inputMode="numeric"
            placeholder="8"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
          />
        </Field>
      </FormGrid>

      <VolumePreview aria-live="polite">
        <VolumeLabel>総ボリューム</VolumeLabel>
        <VolumeValue>{totalVolume.toLocaleString()}kg</VolumeValue>
      </VolumePreview>

      <Field>
        <Label htmlFor="memo">メモ</Label>
        <Textarea id="memo" name="memo" placeholder="フォーム、疲労感、次回の目安など" />
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
