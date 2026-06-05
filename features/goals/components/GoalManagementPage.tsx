"use client";

import styled from "styled-components";

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
  gap: ${({ theme }) => theme.space[6]};
`;

const GoalsHeader = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const Eyebrow = styled.p`
  width: fit-content;
  margin: 0;
  border: 1px solid rgba(24, 124, 112, 0.22);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #ffffff;
  color: #187c70;
  padding: 0.375rem 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  max-width: 44rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  @media (max-width: 833px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  margin: 0;
  color: #55615e;
  font-size: ${({ theme }) => theme.fontSizes.body};
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const GoalCard = styled(Card)`
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.05) 0 16px 40px;
`;

const GoalCardHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.space[2]};
`;

const GoalCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1.125rem;
  font-weight: 700;
`;

const GoalCardDescription = styled(CardDescription)`
  color: #66726f;
`;

const GoalCardBody = styled(CardBody)`
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
      <GoalsHeader>
        <Eyebrow>Goal Tracking</Eyebrow>
        <HeaderCopy>
          <Title>目標</Title>
          <Description>種目ごとの目標重量を設定し、現在の最大重量との差を確認します。</Description>
        </HeaderCopy>
      </GoalsHeader>

      <Stack>
        <GoalCard>
          <GoalCardHeader>
            <GoalCardTitle>目標を設定</GoalCardTitle>
            <GoalCardDescription>同じ種目の目標は新しい重量で上書きされます。</GoalCardDescription>
          </GoalCardHeader>
          <GoalCardBody>
            {exercisesError ? (
              <ErrorText role="alert">{exercisesError}</ErrorText>
            ) : (
              <GoalForm exercises={exercises} />
            )}
          </GoalCardBody>
        </GoalCard>

        <GoalCard>
          <GoalCardHeader>
            <GoalCardTitle>達成率</GoalCardTitle>
            <GoalCardDescription>
              現在の最大重量と目標重量から達成率を表示します。
            </GoalCardDescription>
          </GoalCardHeader>
          <GoalCardBody>
            {goalsError || maxWeightsError ? (
              <ErrorText role="alert">{goalsError ?? maxWeightsError}</ErrorText>
            ) : (
              <GoalProgressList goalProgressItems={goalProgressItems} />
            )}
          </GoalCardBody>
        </GoalCard>
      </Stack>
    </>
  );
}
