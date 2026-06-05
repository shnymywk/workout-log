"use client";

import styled from "styled-components";

import { EmptyState } from "@/components/primitives";
import type { GoalProgress } from "@/features/goals/types/goal";

type GoalProgressListProps = {
  goalProgressItems: GoalProgress[];
};

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Item = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[4]};
  align-items: center;
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.04) 0 12px 32px;
  padding: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h3`
  margin: 0;
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Meta = styled.p`
  margin: ${({ theme }) => theme.space[1]} 0 0;
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Rate = styled.p`
  margin: 0;
  border: 1px solid rgba(24, 124, 112, 0.18);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #edf6f4;
  color: #187c70;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  padding: 0.375rem 0.75rem;
  text-align: center;
`;

function formatWeight(weight: number | null) {
  if (weight === null) {
    return "未記録";
  }

  return `${weight}kg`;
}

function formatRate(rate: number | null) {
  if (rate === null) {
    return "-";
  }

  return `${rate}%`;
}

export function GoalProgressList({ goalProgressItems }: GoalProgressListProps) {
  if (goalProgressItems.length === 0) {
    return <EmptyState>まだ目標が登録されていません。</EmptyState>;
  }

  return (
    <List>
      {goalProgressItems.map(({ goal, currentMaxWeight, achievementRate }) => (
        <Item key={goal.id}>
          <div>
            <Title>{goal.exercise_name}</Title>
            <Meta>
              目標 {goal.target_weight}kg / 現在最大 {formatWeight(currentMaxWeight)}
            </Meta>
          </div>
          <Rate>{formatRate(achievementRate)}</Rate>
        </Item>
      ))}
    </List>
  );
}
