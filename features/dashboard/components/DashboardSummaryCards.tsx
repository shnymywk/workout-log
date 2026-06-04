"use client";

import styled from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { DashboardSummary } from "@/features/dashboard/lib/summary";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled(Card)<{ $tone: "teal" | "blue" | "amber" | "graphite" }>`
  position: relative;
  overflow: hidden;
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.05) 0 16px 40px;

  &::before {
    position: absolute;
    inset: 0 auto 0 0;
    width: 0.25rem;
    background: ${({ $tone }) =>
      $tone === "teal"
        ? "#187c70"
        : $tone === "blue"
          ? "#265e9b"
          : $tone === "amber"
            ? "#b57722"
            : "#1b2321"};
    content: "";
  }
`;

const SummaryCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1rem;
  font-weight: 700;
`;

const SummaryCardDescription = styled(CardDescription)`
  color: #66726f;
`;

const Value = styled.p`
  margin: 0;
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2.125rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  overflow-wrap: anywhere;

  @media (max-width: 833px) {
    font-size: 1.75rem;
  }
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
      tone: "teal",
      value: `${summary.weeklyTrainingDays}日`
    },
    {
      title: "月間頻度",
      description: "直近30日間のトレーニング日数",
      tone: "blue",
      value: `${summary.monthlyTrainingDays}日`
    },
    {
      title: "総ボリューム",
      description: "登録済み記録の合計",
      tone: "graphite",
      value: `${summary.totalVolume.toLocaleString()}kg`
    },
    {
      title: "目標達成率",
      description: "登録済み目標の平均",
      tone: "amber",
      value: formatAchievementRate(summary.averageAchievementRate)
    }
  ] as const;

  return (
    <Grid>
      {cards.map((card) => (
        <SummaryCard key={card.title} $tone={card.tone}>
          <CardHeader>
            <SummaryCardTitle>{card.title}</SummaryCardTitle>
            <SummaryCardDescription>{card.description}</SummaryCardDescription>
          </CardHeader>
          <CardBody>
            <Value>{card.value}</Value>
          </CardBody>
        </SummaryCard>
      ))}
    </Grid>
  );
}
