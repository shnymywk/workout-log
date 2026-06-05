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

export function BodyPartManager({ bodyParts, fetchError }: BodyPartManagerProps) {
  return (
    <Stack>
      <ManagerCard>
        <ManagerCardHeader>
          <ManagerCardTitle>部位を追加</ManagerCardTitle>
          <ManagerCardDescription>
            胸、背中、脚など、記録時に使う部位を登録します。
          </ManagerCardDescription>
        </ManagerCardHeader>
        <ManagerCardBody>
          <BodyPartCreateForm />
        </ManagerCardBody>
      </ManagerCard>

      <ManagerCard>
        <ManagerCardHeader>
          <ManagerCardTitle>部位一覧</ManagerCardTitle>
          <ManagerCardDescription>登録済みの部位名を編集・削除できます。</ManagerCardDescription>
        </ManagerCardHeader>
        <ManagerCardBody>
          {fetchError ? (
            <ErrorText role="alert">{fetchError}</ErrorText>
          ) : (
            <BodyPartList bodyParts={bodyParts} />
          )}
        </ManagerCardBody>
      </ManagerCard>
    </Stack>
  );
}
