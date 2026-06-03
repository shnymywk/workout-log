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
      <Card>
        <CardHeader>
          <CardTitle>種目を追加</CardTitle>
          <CardDescription>記録で使う種目を部位に紐づけて登録します。</CardDescription>
        </CardHeader>
        <CardBody>
          <ExerciseCreateForm bodyParts={bodyParts} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>種目一覧</CardTitle>
          <CardDescription>部位で絞り込みながら、種目名と分類を編集できます。</CardDescription>
        </CardHeader>
        <CardBody>
          <ExerciseFilter bodyParts={bodyParts} selectedBodyPartId={selectedBodyPartId} />
          {fetchError ? (
            <ErrorText role="alert">{fetchError}</ErrorText>
          ) : (
            <ExerciseList bodyParts={bodyParts} exercises={exercises} />
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}
