"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import styled, { useTheme } from "styled-components";

import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState
} from "@/components/primitives";
import type {
  DailyCountPoint,
  DailyVolumePoint,
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

const ChartGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const WeightGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const ChartFrame = styled.div`
  height: 20rem;

  @media (max-width: 833px) {
    height: 16rem;
  }
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

function FrequencyChart({ data }: { data: DailyCountPoint[] }) {
  const theme = useTheme();

  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={theme.colors.border} vertical={false} />
          <XAxis dataKey="label" stroke={theme.colors.textSecondary} tickLine={false} />
          <YAxis allowDecimals={false} stroke={theme.colors.textSecondary} tickLine={false} />
          <Tooltip content={<DashboardTooltip />} />
          <Bar dataKey="count" fill={theme.colors.appleBlue} name="記録数" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function VolumeChart({ data }: { data: DailyVolumePoint[] }) {
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
            dataKey="volume"
            dot={false}
            name="ボリューム"
            stroke={theme.colors.linkBlue}
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
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

function hasFrequencyData(data: DailyCountPoint[]) {
  return data.some((point) => point.count > 0);
}

function hasVolumeData(data: DailyVolumePoint[]) {
  return data.some((point) => point.volume > 0);
}

export function DashboardCharts({ charts }: DashboardChartsProps) {
  const hasExerciseWeightSeries = charts.exerciseWeightSeries.length > 0;

  return (
    <ChartStack>
      <ChartGrid>
        <Card>
          <CardHeader>
            <CardTitle>週間頻度</CardTitle>
            <CardDescription>直近7日間の日別記録数</CardDescription>
          </CardHeader>
          <CardBody>
            {hasFrequencyData(charts.weeklyFrequencySeries) ? (
              <FrequencyChart data={charts.weeklyFrequencySeries} />
            ) : (
              <ChartEmptyState />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>月間頻度</CardTitle>
            <CardDescription>直近30日間の日別記録数</CardDescription>
          </CardHeader>
          <CardBody>
            {hasFrequencyData(charts.monthlyFrequencySeries) ? (
              <FrequencyChart data={charts.monthlyFrequencySeries} />
            ) : (
              <ChartEmptyState />
            )}
          </CardBody>
        </Card>
      </ChartGrid>

      <Card>
        <CardHeader>
          <CardTitle>総ボリューム推移</CardTitle>
          <CardDescription>直近30日間の日別合計ボリューム</CardDescription>
        </CardHeader>
        <CardBody>
          {hasVolumeData(charts.volumeSeries) ? (
            <VolumeChart data={charts.volumeSeries} />
          ) : (
            <ChartEmptyState />
          )}
        </CardBody>
      </Card>

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
