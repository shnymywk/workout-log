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
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #f7faf9;
  padding: ${({ theme }) => theme.space[4]};

  input,
  select {
    border-color: rgba(20, 32, 29, 0.14);
    background: #ffffff;
  }

  input:focus-visible,
  select:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const FilterButton = styled(Button)`
  border-color: rgba(24, 124, 112, 0.32);
  color: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #edf6f4;
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

      <FilterButton type="submit" variant="secondary">
        絞り込む
      </FilterButton>
    </Form>
  );
}
