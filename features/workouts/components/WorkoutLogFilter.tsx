"use client";

import styled from "styled-components";

import { Button, Field, Input, Label, Select } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import type { WorkoutLogFilters } from "@/features/workouts/types/workout-log";

type WorkoutLogFilterProps = {
  exercises: Exercise[];
  filters: WorkoutLogFilters;
};

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[3]};
  align-items: end;

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

export function WorkoutLogFilter({ exercises, filters }: WorkoutLogFilterProps) {
  return (
    <Form action="/workouts">
      <Field>
        <Label htmlFor="filter-trained-at">日付</Label>
        <Input
          id="filter-trained-at"
          name="trainedAt"
          type="date"
          defaultValue={filters.trainedAt ?? ""}
        />
      </Field>

      <Field>
        <Label htmlFor="filter-exercise-id">種目</Label>
        <Select id="filter-exercise-id" name="exerciseId" defaultValue={filters.exerciseId ?? ""}>
          <option value="">すべて</option>
          {exercises.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </Select>
      </Field>

      <Button type="submit" variant="secondary">
        絞り込む
      </Button>
    </Form>
  );
}
