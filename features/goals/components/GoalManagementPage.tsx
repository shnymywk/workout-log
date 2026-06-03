"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { GoalForm } from "@/features/goals/components/GoalForm";
import { GoalProgressList } from "@/features/goals/components/GoalProgressList";
import type { GoalProgress } from "@/features/goals/types/goal";

type GoalManagementPageProps = {
  exercises: Exercise[];
  exercisesError: string | null;
  goalProgressItems: GoalProgress[];
  goalsError: string | null;
  maxWeightsError: string | null;
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

export function GoalManagementPage({
  exercises,
  exercisesError,
  goalProgressItems,
  goalsError,
  maxWeightsError
}: GoalManagementPageProps) {
  return (
    <>
      <PageHeader
        title="目標"
        description="種目ごとの目標重量を設定し、現在の最大重量との差を確認します。"
      />

      <Stack>
        <Card>
          <CardHeader>
            <CardTitle>目標を設定</CardTitle>
            <CardDescription>同じ種目の目標は新しい重量で上書きされます。</CardDescription>
          </CardHeader>
          <CardBody>
            {exercisesError ? (
              <ErrorText role="alert">{exercisesError}</ErrorText>
            ) : (
              <GoalForm exercises={exercises} />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>達成率</CardTitle>
            <CardDescription>現在の最大重量と目標重量から達成率を表示します。</CardDescription>
          </CardHeader>
          <CardBody>
            {goalsError || maxWeightsError ? (
              <ErrorText role="alert">{goalsError ?? maxWeightsError}</ErrorText>
            ) : (
              <GoalProgressList goalProgressItems={goalProgressItems} />
            )}
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}
