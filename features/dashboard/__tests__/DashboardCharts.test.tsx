import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import type { DashboardCharts as DashboardChartsData } from "@/features/dashboard/lib/charts";
import { theme } from "@/lib/styles/theme";

jest.mock("recharts", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  type RechartsMockProps = {
    children?: React.ReactNode;
  };

  const Chart = ({ children }: RechartsMockProps) =>
    React.createElement("div", { "data-testid": "chart" }, children);
  const ChartElement = () => null;

  return {
    Bar: ChartElement,
    BarChart: Chart,
    CartesianGrid: ChartElement,
    Line: ChartElement,
    LineChart: Chart,
    ResponsiveContainer: Chart,
    Tooltip: ChartElement,
    XAxis: ChartElement,
    YAxis: ChartElement
  };
});

const charts: DashboardChartsData = {
  exerciseWeightSeries: [
    {
      exerciseId: "exercise-1",
      exerciseName: "ベンチプレス",
      latestWeight: 80,
      points: [
        {
          trainedAt: "2026-06-01",
          label: "6/1",
          weight: 70
        },
        {
          trainedAt: "2026-06-03",
          label: "6/3",
          weight: 80
        }
      ]
    }
  ],
  weeklyFrequencySeries: [
    { date: "2026-05-28", label: "5/28", count: 0 },
    { date: "2026-05-29", label: "5/29", count: 0 },
    { date: "2026-05-30", label: "5/30", count: 0 },
    { date: "2026-05-31", label: "5/31", count: 0 },
    { date: "2026-06-01", label: "6/1", count: 1 },
    { date: "2026-06-02", label: "6/2", count: 0 },
    { date: "2026-06-03", label: "6/3", count: 1 }
  ],
  monthlyFrequencySeries: [
    { date: "2026-06-01", label: "6/1", count: 1 },
    { date: "2026-06-02", label: "6/2", count: 0 },
    { date: "2026-06-03", label: "6/3", count: 1 }
  ],
  volumeSeries: [
    { date: "2026-06-01", label: "6/1", volume: 700 },
    { date: "2026-06-02", label: "6/2", volume: 0 },
    { date: "2026-06-03", label: "6/3", volume: 1920 }
  ]
};

const emptyCharts: DashboardChartsData = {
  exerciseWeightSeries: [],
  weeklyFrequencySeries: [],
  monthlyFrequencySeries: [],
  volumeSeries: []
};

function renderDashboardCharts(chartData: DashboardChartsData) {
  return render(
    <ThemeProvider theme={theme}>
      <DashboardCharts charts={chartData} />
    </ThemeProvider>
  );
}

describe("DashboardCharts", () => {
  it("renders chart sections", () => {
    renderDashboardCharts(charts);

    expect(screen.getByRole("heading", { name: "週間頻度" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "月間頻度" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "総ボリューム推移" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ベンチプレス" })).toBeInTheDocument();
    expect(screen.getByText("最新重量 80kg")).toBeInTheDocument();
    expect(screen.getAllByTestId("chart")).toHaveLength(8);
  });

  it("renders empty states when chart data is empty", () => {
    renderDashboardCharts(emptyCharts);

    expect(screen.getAllByText("表示できるトレーニング記録がありません。")).toHaveLength(4);
  });
});
