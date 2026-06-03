"use client";

import styled from "styled-components";

import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/primitives";
import { BodyPartCreateForm } from "@/features/exercises/components/BodyPartCreateForm";
import { BodyPartList } from "@/features/exercises/components/BodyPartList";
import type { BodyPart } from "@/features/exercises/types/body-part";

type BodyPartManagerProps = {
  bodyParts: BodyPart[];
  fetchError: string | null;
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

export function BodyPartManager({ bodyParts, fetchError }: BodyPartManagerProps) {
  return (
    <Stack>
      <Card>
        <CardHeader>
          <CardTitle>部位を追加</CardTitle>
          <CardDescription>胸、背中、脚など、記録時に使う部位を登録します。</CardDescription>
        </CardHeader>
        <CardBody>
          <BodyPartCreateForm />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>部位一覧</CardTitle>
          <CardDescription>登録済みの部位名を編集・削除できます。</CardDescription>
        </CardHeader>
        <CardBody>
          {fetchError ? (
            <ErrorText role="alert">{fetchError}</ErrorText>
          ) : (
            <BodyPartList bodyParts={bodyParts} />
          )}
        </CardBody>
      </Card>
    </Stack>
  );
}
