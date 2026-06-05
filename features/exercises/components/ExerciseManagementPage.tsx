"use client";

import styled from "styled-components";

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
  gap: ${({ theme }) => theme.space[5]};
`;

const ExercisesHeader = styled.header`
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

const SectionHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 700;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SectionDescription = styled.p`
  margin: 0;
  color: #66726f;
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
      <ExercisesHeader>
        <Eyebrow>Exercise Library</Eyebrow>
        <HeaderCopy>
          <Title>種目</Title>
          <Description>
            トレーニング種目と部位を管理し、記録入力を迷わず行える状態にします。
          </Description>
        </HeaderCopy>
      </ExercisesHeader>

      <Stack>
        <Section>
          <SectionHeader>
            <SectionTitle>部位管理</SectionTitle>
            <SectionDescription>種目分類に使う部位を追加・編集します。</SectionDescription>
          </SectionHeader>
          <BodyPartManager bodyParts={bodyParts} fetchError={bodyPartsError} />
        </Section>

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
      </Stack>
    </>
  );
}
