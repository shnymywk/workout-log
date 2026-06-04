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
import styled from "styled-components";

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
  gap: ${({ theme }) => theme.space[6]};
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

const ChartCard = styled(Card)`
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.05) 0 16px 40px;
`;

const ChartCardHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.space[2]};
`;

const ChartCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1rem;
  font-weight: 700;
`;

const ChartCardDescription = styled(CardDescription)`
  color: #66726f;
`;

const TooltipBox = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.control};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.12) 0 16px 40px;
  padding: ${({ theme }) => theme.space[3]};
`;

const TooltipLabel = styled.p`
  margin: 0;
  color: #101816;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
`;

const TooltipValue = styled.p`
  margin: 0;
  color: #55615e;
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

const gridColor = "rgba(20, 32, 29, 0.1)";
const tickColor = "#66726f";
const teal = "#187c70";
const blue = "#265e9b";

function FrequencyChart({ data }: { data: DailyCountPoint[] }) {
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" stroke={tickColor} tickLine={false} />
          <YAxis allowDecimals={false} stroke={tickColor} tickLine={false} />
          <Tooltip content={<DashboardTooltip />} />
          <Bar dataKey="count" fill={teal} name="記録数" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function VolumeChart({ data }: { data: DailyVolumePoint[] }) {
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" stroke={tickColor} tickLine={false} />
          <YAxis stroke={tickColor} tickLine={false} />
          <Tooltip content={<DashboardTooltip />} />
          <Line
            dataKey="volume"
            dot={false}
            name="ボリューム"
            stroke={blue}
            strokeWidth={3}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function WeightChart({ data }: { data: ExerciseWeightPoint[] }) {
  return (
    <ChartFrame>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" stroke={tickColor} tickLine={false} />
          <YAxis stroke={tickColor} tickLine={false} />
          <Tooltip content={<DashboardTooltip />} />
          <Line
            dataKey="weight"
            dot={{ fill: "#ffffff", r: 3, stroke: teal, strokeWidth: 2 }}
            name="重量"
            stroke={teal}
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
        <ChartCard>
          <ChartCardHeader>
            <ChartCardTitle>週間頻度</ChartCardTitle>
            <ChartCardDescription>直近7日間の日別記録数</ChartCardDescription>
          </ChartCardHeader>
          <CardBody>
            {hasFrequencyData(charts.weeklyFrequencySeries) ? (
              <FrequencyChart data={charts.weeklyFrequencySeries} />
            ) : (
              <ChartEmptyState />
            )}
          </CardBody>
        </ChartCard>

        <ChartCard>
          <ChartCardHeader>
            <ChartCardTitle>月間頻度</ChartCardTitle>
            <ChartCardDescription>直近30日間の日別記録数</ChartCardDescription>
          </ChartCardHeader>
          <CardBody>
            {hasFrequencyData(charts.monthlyFrequencySeries) ? (
              <FrequencyChart data={charts.monthlyFrequencySeries} />
            ) : (
              <ChartEmptyState />
            )}
          </CardBody>
        </ChartCard>
      </ChartGrid>

      <ChartCard>
        <ChartCardHeader>
          <ChartCardTitle>総ボリューム推移</ChartCardTitle>
          <ChartCardDescription>直近30日間の日別合計ボリューム</ChartCardDescription>
        </ChartCardHeader>
        <CardBody>
          {hasVolumeData(charts.volumeSeries) ? (
            <VolumeChart data={charts.volumeSeries} />
          ) : (
            <ChartEmptyState />
          )}
        </CardBody>
      </ChartCard>

      <WeightGrid>
        {hasExerciseWeightSeries ? (
          charts.exerciseWeightSeries.map((series) => (
            <ChartCard key={series.exerciseId}>
              <ChartCardHeader>
                <ChartCardTitle>{series.exerciseName}</ChartCardTitle>
                <ChartCardDescription>最新重量 {series.latestWeight}kg</ChartCardDescription>
              </ChartCardHeader>
              <CardBody>
                <WeightChart data={series.points} />
              </CardBody>
            </ChartCard>
          ))
        ) : (
          <ChartEmptyState />
        )}
      </WeightGrid>
    </ChartStack>
  );
}
