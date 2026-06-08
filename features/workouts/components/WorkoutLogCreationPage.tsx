"use client";

import styled from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import type { Exercise } from "@/features/exercises/types/exercise";
import { WorkoutLogCreateForm } from "@/features/workouts/components/WorkoutLogCreateForm";
import { WorkoutLogFilter } from "@/features/workouts/components/WorkoutLogFilter";
import { WorkoutLogList } from "@/features/workouts/components/WorkoutLogList";
import type { WorkoutLog, WorkoutLogFilters } from "@/features/workouts/types/workout-log";

type WorkoutLogCreationPageProps = {
  exercises: Exercise[];
  exercisesError: string | null;
  workoutLogs: WorkoutLog[];
  workoutLogsError: string | null;
  workoutLogDates: string[];
  workoutLogDatesError: string | null;
  filters: WorkoutLogFilters;
};

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
`;

const WorkoutsHeader = styled.header`
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

const WorkoutCard = styled(Card)`
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.05) 0 16px 40px;
`;

const WorkoutCardHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.space[2]};
`;

const WorkoutCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1.125rem;
  font-weight: 700;
`;

const WorkoutCardDescription = styled(CardDescription)`
  color: #66726f;
`;

const WorkoutCardBody = styled(CardBody)`
  gap: ${({ theme }) => theme.space[5]};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function WorkoutLogCreationPage({
  exercises,
  exercisesError,
  workoutLogs,
  workoutLogsError,
  workoutLogDates,
  workoutLogDatesError,
  filters
}: WorkoutLogCreationPageProps) {
  return (
    <>
      <WorkoutsHeader>
        <Eyebrow>Training Records</Eyebrow>
        <HeaderCopy>
          <Title>記録</Title>
          <Description>日付、種目、重量、セット数、回数、メモを記録します。</Description>
        </HeaderCopy>
      </WorkoutsHeader>

      <Stack>
        <WorkoutCard>
          <WorkoutCardHeader>
            <WorkoutCardTitle>トレーニング記録を追加</WorkoutCardTitle>
            <WorkoutCardDescription>
              入力した重量、セット数、回数から総ボリュームを自動計算します。
            </WorkoutCardDescription>
          </WorkoutCardHeader>
          <WorkoutCardBody>
            {exercisesError ? (
              <ErrorText role="alert">{exercisesError}</ErrorText>
            ) : (
              <WorkoutLogCreateForm exercises={exercises} />
            )}
          </WorkoutCardBody>
        </WorkoutCard>

        <WorkoutCard>
          <WorkoutCardHeader>
            <WorkoutCardTitle>トレーニング記録一覧</WorkoutCardTitle>
            <WorkoutCardDescription>
              日付・種目で絞り込み、記録の編集と削除を行います。
            </WorkoutCardDescription>
          </WorkoutCardHeader>
          <WorkoutCardBody>
            {workoutLogDatesError ? (
              <ErrorText role="alert">{workoutLogDatesError}</ErrorText>
            ) : null}
            <WorkoutLogFilter
              exercises={exercises}
              filters={filters}
              trainedAts={workoutLogDates}
            />
            {workoutLogsError ? (
              <ErrorText role="alert">{workoutLogsError}</ErrorText>
            ) : (
              <WorkoutLogList exercises={exercises} workoutLogs={workoutLogs} />
            )}
          </WorkoutCardBody>
        </WorkoutCard>
      </Stack>
    </>
  );
}
