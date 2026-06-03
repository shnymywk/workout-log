"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { WorkoutLogCreateForm } from "@/features/workouts/components/WorkoutLogCreateForm";

type WorkoutLogCreationPageProps = {
  exercises: Exercise[];
  exercisesError: string | null;
};

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function WorkoutLogCreationPage({ exercises, exercisesError }: WorkoutLogCreationPageProps) {
  return (
    <>
      <PageHeader title="記録" description="日付、種目、重量、セット数、回数、メモを記録します。" />

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
    </>
  );
}
