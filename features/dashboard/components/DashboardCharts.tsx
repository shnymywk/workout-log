"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import styled, { useTheme } from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type {
  DashboardCharts as DashboardChartsData,
  ExerciseWeightPoint
} from "@/features/dashboard/lib/charts";

type DashboardChartsProps = {
  charts: DashboardChartsData;
};

type TooltipPayload = {
  value?: number | string;
  name?: string;
};

type TooltipContentProps = {
  active?: boolean;
  label?: string;
  payload?: TooltipPayload[];
};

const ChartStack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

const WeightGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 1023px) {
    grid-template-columns: 1fr;
  }
`;

const ChartFrame = styled.div`
  height: 18rem;
`;

const EmptyState = styled.p`
  margin: 0;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.card};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: ${({ theme }) => theme.lineHeights.body};
  padding: ${({ theme }) => theme.space[5]};
`;

const TooltipBox = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.space[3]};
`;

const TooltipLabel = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
`;

const TooltipValue = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
`;

function DashboardTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((item) => (
        <TooltipValue key={`${item.name}-${item.value}`}>
          {item.name}: {item.value}
        </TooltipValue>
      ))}
    </TooltipBox>
  );
}

function ChartEmptyState() {
  return <EmptyState>表示できるトレーニング記録がありません。</EmptyState>;
}

function WeightChart({ data }: { data: ExerciseWeightPoint[] }) {
  const theme = useTheme();

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={theme.colors.border} vertical={false} />
          <XAxis dataKey="label" stroke={theme.colors.textSecondary} tickLine={false} />
          <YAxis stroke={theme.colors.textSecondary} tickLine={false} />
          <Tooltip content={<DashboardTooltip />} />
          <Line
            dataKey="weight"
            dot={{ r: 3 }}
            name="重量"
            stroke={theme.colors.appleBlue}
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const hasExerciseWeightSeries = charts.exerciseWeightSeries.length > 0;

  return (
    <ChartStack>
      <WeightGrid>
        {hasExerciseWeightSeries ? (
          charts.exerciseWeightSeries.map((series) => (
            <Card key={series.exerciseId}>
              <CardHeader>
                <CardTitle>{series.exerciseName}</CardTitle>
                <CardDescription>最新重量 {series.latestWeight}kg</CardDescription>
              </CardHeader>
              <CardBody>
                <WeightChart data={series.points} />
              </CardBody>
            </Card>
          ))
        ) : (
          <ChartEmptyState />
        )}
      </WeightGrid>
    </ChartStack>
  );
}
