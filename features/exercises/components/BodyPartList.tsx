"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { deleteBodyPart, updateBodyPart } from "@/features/exercises/actions/body-parts";
import { initialBodyPartActionState, type BodyPart } from "@/features/exercises/types/body-part";
import { Button, EmptyState, Input } from "@/components/primitives";

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
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #ffffff;
  box-shadow: rgba(12, 28, 24, 0.04) 0 12px 32px;
  padding: ${({ theme }) => theme.space[3]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const EditForm = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};

  input {
    border-color: rgba(20, 32, 29, 0.14);
    background: #f7faf9;
  }

  input:focus-visible {
    border-color: #187c70;
    box-shadow: 0 0 0 3px rgba(24, 124, 112, 0.16);
  }
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
  color: ${({ theme, $tone }) => ($tone === "success" ? "#187c70" : theme.colors.danger)};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SaveActionButton = styled(Button)`
  border-color: rgba(24, 124, 112, 0.32);
  color: #187c70;
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #edf6f4;
  }
`;

const DeleteActionButton = styled(Button)`
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;

  &:hover:not(:disabled) {
    background: #fff7f5;
  }
`;

function UpdateButton() {
  const { pending } = useFormStatus();

  return (
    <SaveActionButton type="submit" variant="secondary" disabled={pending}>
      {pending ? "保存中" : "保存"}
    </SaveActionButton>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <DeleteActionButton type="submit" variant="ghost" disabled={pending}>
      {pending ? "削除中" : "削除"}
    </DeleteActionButton>
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
