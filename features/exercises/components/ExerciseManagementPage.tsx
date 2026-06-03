"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import { BodyPartManager } from "@/features/exercises/components/BodyPartManager";
import { ExerciseManager } from "@/features/exercises/components/ExerciseManager";
import type { BodyPart } from "@/features/exercises/types/body-part";
import type { Exercise } from "@/features/exercises/types/exercise";

type ExerciseManagementPageProps = {
  bodyParts: BodyPart[];
  bodyPartsError: string | null;
  exercises: Exercise[];
  exercisesError: string | null;
  selectedBodyPartId: string | null;
};

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[8]};
`;

const Section = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const SectionHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SectionDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function ExerciseManagementPage({
  bodyParts,
  bodyPartsError,
  exercises,
  exercisesError,
  selectedBodyPartId
}: ExerciseManagementPageProps) {
  return (
    <>
      <PageHeader
        title="種目"
        description="トレーニング種目と部位を管理し、記録入力を迷わず行える状態にします。"
      />

      <Stack>
        <Section>
          <SectionHeader>
            <SectionTitle>種目管理</SectionTitle>
            <SectionDescription>種目名を部位と紐づけて管理します。</SectionDescription>
          </SectionHeader>
          <ExerciseManager
            bodyParts={bodyParts}
            exercises={exercises}
            fetchError={exercisesError}
            selectedBodyPartId={selectedBodyPartId}
          />
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>部位管理</SectionTitle>
            <SectionDescription>種目分類に使う部位を追加・編集します。</SectionDescription>
          </SectionHeader>
          <BodyPartManager bodyParts={bodyParts} fetchError={bodyPartsError} />
        </Section>
      </Stack>
    </>
  );
}
