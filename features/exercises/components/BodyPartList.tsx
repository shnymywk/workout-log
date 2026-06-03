"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import {
  deleteBodyPart,
  initialBodyPartActionState,
  updateBodyPart
} from "@/features/exercises/actions/body-parts";
import type { BodyPart } from "@/features/exercises/types/body-part";
import { Button, Input } from "@/components/primitives";

type BodyPartListProps = {
  bodyParts: BodyPart[];
};

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[3]};
  align-items: start;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const EditForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const EditControls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${({ theme }) => theme.space[2]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const DeleteForm = styled.form`
  display: flex;
  justify-content: flex-end;
`;

const Message = styled.p<{ $tone: "success" | "error" }>`
  margin: 0;
  color: ${({ theme, $tone }) =>
    $tone === "success" ? theme.colors.linkBlue : theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const EmptyState = styled.div`
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.card};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.space[6]};
  text-align: center;
`;

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "保存中" : "保存"}
    </Button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="ghost" disabled={pending}>
      {pending ? "削除中" : "削除"}
    </Button>
  );
}

function BodyPartRow({ bodyPart }: { bodyPart: BodyPart }) {
  const [state, formAction] = useActionState(updateBodyPart, initialBodyPartActionState);

  return (
    <Row>
      <EditForm action={formAction}>
        <input type="hidden" name="id" value={bodyPart.id} />
        <EditControls>
          <Input name="name" defaultValue={bodyPart.name} aria-label={`${bodyPart.name}の部位名`} />
          <UpdateButton />
        </EditControls>
        {state.error ? (
          <Message $tone="error" role="alert">
            {state.error}
          </Message>
        ) : null}
        {state.success ? <Message $tone="success">{state.success}</Message> : null}
      </EditForm>

      <DeleteForm action={deleteBodyPart}>
        <input type="hidden" name="id" value={bodyPart.id} />
        <DeleteButton />
      </DeleteForm>
    </Row>
  );
}

export function BodyPartList({ bodyParts }: BodyPartListProps) {
  if (bodyParts.length === 0) {
    return <EmptyState>まだ部位が登録されていません。</EmptyState>;
  }

  return (
    <List>
      {bodyParts.map((bodyPart) => (
        <BodyPartRow key={bodyPart.id} bodyPart={bodyPart} />
      ))}
    </List>
  );
}
