"use client";

import styled from "styled-components";

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
  gap: ${({ theme }) => theme.space[6]};
`;

const DashboardHeader = styled.header`
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

const ErrorList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid rgba(180, 35, 24, 0.18);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #fff7f5;
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
      <DashboardHeader>
        <Eyebrow>Training Overview</Eyebrow>
        <HeaderCopy>
          <Title>ダッシュボード</Title>
          <Description>週間・月間の頻度、総ボリューム、目標達成率を確認します。</Description>
        </HeaderCopy>
      </DashboardHeader>

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
