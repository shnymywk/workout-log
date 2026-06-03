"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { DashboardSummaryCards } from "@/features/dashboard/components/DashboardSummaryCards";
import type { DashboardCharts as DashboardChartsData } from "@/features/dashboard/lib/charts";
import type { DashboardSummary } from "@/features/dashboard/lib/summary";

type DashboardSummaryPageProps = {
  charts: DashboardChartsData;
  summary: DashboardSummary;
  errors: string[];
};

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

const ErrorList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space[4]};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function DashboardSummaryPage({ charts, summary, errors }: DashboardSummaryPageProps) {
  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description="週間・月間の頻度、総ボリューム、目標達成率を確認します。"
      />

      <Stack>
        {errors.length > 0 ? (
          <ErrorList role="alert">
            {errors.map((error) => (
              <ErrorText key={error}>{error}</ErrorText>
            ))}
          </ErrorList>
        ) : null}
        <DashboardSummaryCards summary={summary} />
        <DashboardCharts charts={charts} />
      </Stack>
    </>
  );
}
