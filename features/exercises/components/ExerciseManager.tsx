"use client";

import styled from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import { ExerciseCreateForm } from "@/features/exercises/components/ExerciseCreateForm";
import { ExerciseFilter } from "@/features/exercises/components/ExerciseFilter";
import { ExerciseList } from "@/features/exercises/components/ExerciseList";
import type { BodyPart } from "@/features/exercises/types/body-part";
import type { Exercise } from "@/features/exercises/types/exercise";

type ExerciseManagerProps = {
  bodyParts: BodyPart[];
  exercises: Exercise[];
  fetchError: string | null;
  selectedBodyPartId: string | null;
};

const Stack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

const ManagerCard = styled(Card)`
  border-color: rgba(20, 32, 29, 0.1);
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.05) 0 16px 40px;
`;

const ManagerCardHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.space[2]};
`;

const ManagerCardTitle = styled(CardTitle)`
  color: #101816;
  font-size: 1.125rem;
  font-weight: 700;
`;

const ManagerCardDescription = styled(CardDescription)`
  color: #66726f;
`;

const ManagerCardBody = styled(CardBody)`
  gap: ${({ theme }) => theme.space[5]};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function ExerciseManager({
  bodyParts,
  exercises,
  fetchError,
  selectedBodyPartId
}: ExerciseManagerProps) {
  return (
    <Stack>
      <ManagerCard>
        <ManagerCardHeader>
          <ManagerCardTitle>種目を追加</ManagerCardTitle>
          <ManagerCardDescription>
            記録で使う種目を部位に紐づけて登録します。
          </ManagerCardDescription>
        </ManagerCardHeader>
        <ManagerCardBody>
          <ExerciseCreateForm bodyParts={bodyParts} />
        </ManagerCardBody>
      </ManagerCard>

      <ManagerCard>
        <ManagerCardHeader>
          <ManagerCardTitle>種目一覧</ManagerCardTitle>
          <ManagerCardDescription>
            部位で絞り込みながら、種目名と分類を編集できます。
          </ManagerCardDescription>
        </ManagerCardHeader>
        <ManagerCardBody>
          <ExerciseFilter bodyParts={bodyParts} selectedBodyPartId={selectedBodyPartId} />
          {fetchError ? (
            <ErrorText role="alert">{fetchError}</ErrorText>
          ) : (
            <ExerciseList bodyParts={bodyParts} exercises={exercises} />
          )}
        </ManagerCardBody>
      </ManagerCard>
    </Stack>
  );
}
