"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { WorkoutLogCreateForm } from "@/features/workouts/components/WorkoutLogCreateForm";
import { WorkoutLogFilter } from "@/features/workouts/components/WorkoutLogFilter";
import { WorkoutLogList } from "@/features/workouts/components/WorkoutLogList";
import type { WorkoutLog, WorkoutLogFilters } from "@/features/workouts/types/workout-log";

type WorkoutLogCreationPageProps = {
  exercises: Exercise[];
  exercisesError: string | null;
  workoutLogs: WorkoutLog[];
  workoutLogsError: string | null;
  filters: WorkoutLogFilters;
};

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function WorkoutLogCreationPage({
  exercises,
  exercisesError,
  workoutLogs,
  workoutLogsError,
  filters
}: WorkoutLogCreationPageProps) {
  return (
    <>
      <PageHeader title="記録" description="日付、種目、重量、セット数、回数、メモを記録します。" />

      <Stack>
        <Card>
          <CardHeader>
            <CardTitle>トレーニング記録を追加</CardTitle>
            <CardDescription>
              入力した重量、セット数、回数から総ボリュームを自動計算します。
            </CardDescription>
          </CardHeader>
          <CardBody>
            {exercisesError ? (
              <ErrorText role="alert">{exercisesError}</ErrorText>
            ) : (
              <WorkoutLogCreateForm exercises={exercises} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>トレーニング記録一覧</CardTitle>
            <CardDescription>日付・種目で絞り込み、記録の編集と削除を行います。</CardDescription>
          </CardHeader>
          <CardBody>
            <WorkoutLogFilter exercises={exercises} filters={filters} />
            {workoutLogsError ? (
              <ErrorText role="alert">{workoutLogsError}</ErrorText>
            ) : (
              <WorkoutLogList exercises={exercises} workoutLogs={workoutLogs} />
            )}
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}
