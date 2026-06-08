"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import styled from "styled-components";

import { Button } from "@/components/primitives";
import { logout } from "@/features/auth/actions";

type LogoutButtonProps = {
  compact?: boolean;
  variant?: "secondary" | "ghost";
};

const LogoutActionButton = styled(Button)<{ $compact: boolean }>`
  ${({ $compact }) =>
    $compact
      ? `
        width: 2.75rem;
        padding: 0;
      `
      : ""}
`;

function SubmitButton({ compact = false, variant = "secondary" }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <LogoutActionButton
      type="submit"
      variant={variant}
      disabled={pending}
      title="ログアウト"
      aria-label={compact ? "ログアウト" : undefined}
      $compact={compact}
    >
      {compact ? <LogOut size={18} strokeWidth={2.2} aria-hidden="true" /> : null}
      {compact ? null : pending ? "ログアウト中" : "ログアウト"}
    </LogoutActionButton>
  );
}

export function LogoutButton({ compact = false, variant = "secondary" }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <SubmitButton compact={compact} variant={variant} />
    </form>
  );
}
