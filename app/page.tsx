"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import styled from "styled-components";

const metrics = [
  { label: "週間頻度", value: "4回", tone: "teal" },
  { label: "総ボリューム", value: "24,860kg", tone: "blue" },
  { label: "達成率", value: "86%", tone: "amber" }
] as const;

const chartBars = [
  { day: "月", height: "46%" },
  { day: "火", height: "68%" },
  { day: "水", height: "34%" },
  { day: "木", height: "82%" },
  { day: "金", height: "56%" },
  { day: "土", height: "74%" },
  { day: "日", height: "42%" }
] as const;

const Page = styled.main`
  min-height: 100vh;
  background: #f3f6f5;
  color: #1b2321;
`;

const Content = styled.div`
  display: grid;
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  min-height: 100vh;
  align-items: center;
  gap: ${({ theme }) => theme.space[10]};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[10]} 0;

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 0.9fr) minmax(24rem, 1.1fr);
    padding: ${({ theme }) => theme.space[16]} 0;
  }
`;

const Hero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  max-width: 42rem;
`;

const BrandHeading = styled.div`
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  align-items: center;
  column-gap: ${({ theme }) => theme.space[3]};

  @media (min-width: 834px) {
    grid-template-columns: 3.5rem minmax(0, 1fr);
    column-gap: ${({ theme }) => theme.space[4]};
  }
`;

const BrandMark = styled.span`
  display: inline-flex;
  width: 3.25rem;
  height: 3.25rem;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.card};
  background: #187c70;
  color: #ffffff;

  @media (min-width: 834px) {
    width: 3.5rem;
    height: 3.5rem;
  }
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
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Title = styled.h1`
  margin: 0;
  color: #101816;
  font-family: var(--font-brand), ${({ theme }) => theme.fonts.display};
  font-size: 2.75rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;

  @media (min-width: 834px) {
    font-size: ${({ theme }) => theme.fontSizes.pageTitle};
  }
`;

const Lead = styled.p`
  max-width: 38rem;
  margin: 0;
  color: #55615e;
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const AuthActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
`;

const AuthLink = styled(Link)<{ $variant?: "primary" | "secondary" }>`
  display: inline-flex;
  min-height: 3rem;
  min-width: 9rem;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ $variant }) => ($variant === "secondary" ? "rgba(24, 124, 112, 0.32)" : "transparent")};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $variant }) => ($variant === "secondary" ? "#ffffff" : "#187c70")};
  color: ${({ $variant }) => ($variant === "secondary" ? "#187c70" : "#ffffff")};
  padding: 0.625rem 1.375rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ $variant }) =>
      $variant === "secondary" ? "rgba(16, 75, 68, 0.36)" : "transparent"};
    background: ${({ $variant }) => ($variant === "secondary" ? "#edf6f4" : "#104b44")};
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  max-width: 38rem;

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const Metric = styled.div<{ $tone: "teal" | "blue" | "amber" }>`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid
    ${({ $tone }) =>
      $tone === "teal"
        ? "rgba(24, 124, 112, 0.22)"
        : $tone === "blue"
          ? "rgba(38, 94, 155, 0.22)"
          : "rgba(181, 119, 34, 0.22)"};
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  padding: ${({ theme }) => theme.space[4]};
`;

const MetricValue = styled.span<{ $tone: "teal" | "blue" | "amber" }>`
  color: ${({ $tone }) =>
    $tone === "teal" ? "#187c70" : $tone === "blue" ? "#265e9b" : "#9a6418"};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.625rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const MetricLabel = styled.span`
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Preview = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.08) 0 24px 70px;
  padding: ${({ theme }) => theme.space[5]};
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
`;

const PreviewTitleGroup = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

const PreviewTitle = styled.h2`
  margin: 0;
  color: #111a18;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const PreviewMeta = styled.p`
  margin: 0;
  color: #6a7673;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const StatusBadge = styled.span`
  flex: 0 0 auto;
  border: 1px solid rgba(24, 124, 112, 0.2);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #eaf6f3;
  color: #187c70;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const PreviewBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};

  @media (min-width: 834px) {
    grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.65fr);
  }
`;

const ChartPanel = styled.div`
  display: grid;
  min-height: 18rem;
  gap: ${({ theme }) => theme.space[4]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #f7faf9;
  padding: ${({ theme }) => theme.space[4]};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

const ChartTitle = styled.p`
  margin: 0;
  color: #111a18;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const ChartValue = styled.p`
  margin: ${({ theme }) => theme.space[1]} 0 0;
  color: #187c70;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const ChartDelta = styled.span`
  color: #265e9b;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Bars = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: ${({ theme }) => theme.space[2]};
`;

const BarGroup = styled.div`
  display: grid;
  min-width: 0;
  gap: ${({ theme }) => theme.space[2]};
  justify-items: center;
`;

const BarTrack = styled.div`
  display: flex;
  width: 100%;
  height: 9rem;
  align-items: end;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #e3ebe8;
  padding: 0.1875rem;
`;

const Bar = styled.span<{ $height: string }>`
  width: 100%;
  height: ${({ $height }) => $height};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: #187c70;
`;

const BarLabel = styled.span`
  color: #6a7673;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const LogList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const LogItem = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  padding: ${({ theme }) => theme.space[4]};
`;

const LogName = styled.p`
  margin: 0;
  color: #111a18;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const LogDetail = styled.p`
  margin: 0;
  color: #6a7673;
  font-size: 0.8125rem;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export default function HomePage() {
  return (
    <Page>
      <Content>
        <Hero>
          <Eyebrow>Precision Fitness SaaS</Eyebrow>
          <BrandHeading>
            <BrandMark aria-hidden="true">
              <Activity size={24} strokeWidth={2.4} />
            </BrandMark>
            <Title>Workout Log</Title>
          </BrandHeading>
          <Lead>
            トレーニング記録、総ボリューム、達成率を静かに比較できる個人向けログ管理ツールです。
          </Lead>

          <AuthActions aria-label="認証メニュー">
            <AuthLink href="/login">ログイン</AuthLink>
            <AuthLink href="/login?mode=signUp" $variant="secondary">
              新規登録
            </AuthLink>
          </AuthActions>

          <MetricGrid aria-label="主要メトリック">
            {metrics.map((metric) => (
              <Metric key={metric.label} $tone={metric.tone}>
                <MetricValue $tone={metric.tone}>{metric.value}</MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
              </Metric>
            ))}
          </MetricGrid>
        </Hero>

        <Preview aria-label="Workout Logの画面プレビュー">
          <PreviewHeader>
            <PreviewTitleGroup>
              <PreviewTitle>ダッシュボード</PreviewTitle>
              <PreviewMeta>直近7日間のトレーニング記録</PreviewMeta>
            </PreviewTitleGroup>
            <StatusBadge>継続中</StatusBadge>
          </PreviewHeader>

          <PreviewBody>
            <ChartPanel>
              <ChartHeader>
                <div>
                  <ChartTitle>総ボリューム</ChartTitle>
                  <ChartValue>24,860kg</ChartValue>
                </div>
                <ChartDelta>+12%</ChartDelta>
              </ChartHeader>

              <Bars aria-label="週間ボリューム">
                {chartBars.map((bar) => (
                  <BarGroup key={bar.day}>
                    <BarTrack>
                      <Bar $height={bar.height} />
                    </BarTrack>
                    <BarLabel>{bar.day}</BarLabel>
                  </BarGroup>
                ))}
              </Bars>
            </ChartPanel>

            <LogList aria-label="最近の記録">
              <LogItem>
                <LogName>ベンチプレス</LogName>
                <LogDetail>72.5kg / 3セット / 8回</LogDetail>
              </LogItem>
              <LogItem>
                <LogName>スクワット</LogName>
                <LogDetail>100kg / 5セット / 5回</LogDetail>
              </LogItem>
              <LogItem>
                <LogName>目標</LogName>
                <LogDetail>達成率 86%</LogDetail>
              </LogItem>
            </LogList>
          </PreviewBody>
        </Preview>
      </Content>
    </Page>
  );
}
