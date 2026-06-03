"use client";

import styled from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { DashboardSummary } from "@/features/dashboard/lib/summary";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const Value = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

function formatAchievementRate(rate: number | null) {
  if (rate === null) {
    return "-";
  }

  return `${rate}%`;
}

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const cards = [
    {
      title: "週間頻度",
      description: "直近7日間のトレーニング日数",
      value: `${summary.weeklyTrainingDays}日`
    },
    {
      title: "月間頻度",
      description: "直近30日間のトレーニング日数",
      value: `${summary.monthlyTrainingDays}日`
    },
    {
      title: "総ボリューム",
      description: "登録済み記録の合計",
      value: `${summary.totalVolume.toLocaleString()}kg`
    },
    {
      title: "目標達成率",
      description: "登録済み目標の平均",
      value: formatAchievementRate(summary.averageAchievementRate)
    }
  ];

  return (
    <Grid>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <CardBody>
            <Value>{card.value}</Value>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
}
