"use client";

import styled from "styled-components";

import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  Input,
  Label,
  Select,
  Textarea
} from "@/components/primitives";

const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundElevated};
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: saturate(180%) blur(20px);
`;

const HeaderInner = styled.div`
  display: flex;
  min-height: 3.5rem;
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin: 0 auto;
`;

const Brand = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Content = styled.div`
  display: grid;
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  gap: ${({ theme }) => theme.space[8]};
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) 0;
`;

const Hero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  max-width: 46rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 7vw, ${({ theme }) => theme.fontSizes.pageTitle});
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
`;

const Lead = styled.p`
  max-width: 38rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(20rem, 0.85fr);
  gap: ${({ theme }) => theme.space[6]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const StatValue = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 2rem;
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const StatLabel = styled.p`
  margin: ${({ theme }) => theme.space[1]} 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.space[2]};
`;

const stats = [
  { label: "今週の回数", value: "3回" },
  { label: "総ボリューム", value: "12,480kg" },
  { label: "目標達成率", value: "82%" }
];

export default function HomePage() {
  return (
    <Page>
      <Header>
        <HeaderInner>
          <Brand>Workout Log</Brand>
          <Button variant="ghost">ログイン</Button>
        </HeaderInner>
      </Header>

      <Content>
        <Hero>
          <Eyebrow>Training Dashboard</Eyebrow>
          <Title>Workout Log</Title>
          <Lead>前回の重量、今週の頻度、目標までの距離をひとつの画面で確認できます。</Lead>
        </Hero>

        <Grid>
          <Card>
            <CardHeader>
              <CardTitle>今日の記録</CardTitle>
              <CardDescription>2026年6月3日</CardDescription>
            </CardHeader>
            <CardBody>
              <Form>
                <Field>
                  <Label htmlFor="exercise">種目</Label>
                  <Select id="exercise" defaultValue="bench-press">
                    <option value="bench-press">ベンチプレス</option>
                    <option value="squat">スクワット</option>
                    <option value="deadlift">デッドリフト</option>
                  </Select>
                </Field>

                <FormRow>
                  <Field>
                    <Label htmlFor="weight">重量</Label>
                    <Input id="weight" inputMode="decimal" defaultValue="70" />
                  </Field>
                  <Field>
                    <Label htmlFor="sets">セット</Label>
                    <Input id="sets" inputMode="numeric" defaultValue="3" />
                  </Field>
                  <Field>
                    <Label htmlFor="reps">回数</Label>
                    <Input id="reps" inputMode="numeric" defaultValue="8" />
                  </Field>
                </FormRow>

                <Field>
                  <Label htmlFor="memo">メモ</Label>
                  <Textarea id="memo" defaultValue="フォームは安定。次回は72.5kgを試す。" />
                </Field>

                <Actions>
                  <Button>記録する</Button>
                </Actions>
              </Form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>サマリー</CardTitle>
              <CardDescription>直近7日間</CardDescription>
            </CardHeader>
            <CardBody>
              <StatGrid>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </div>
                ))}
              </StatGrid>
            </CardBody>
          </Card>
        </Grid>
      </Content>
    </Page>
  );
}
