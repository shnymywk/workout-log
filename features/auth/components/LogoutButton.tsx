"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/primitives";
import { logout } from "@/features/auth/actions";

type LogoutButtonProps = {
  variant?: "secondary" | "ghost";
};

function SubmitButton({ variant = "secondary" }: LogoutButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? "ログアウト中" : "ログアウト"}
    </Button>
  );
}

export function LogoutButton({ variant = "secondary" }: LogoutButtonProps) {
  return (
    <form action={logout}>
      <SubmitButton variant={variant} />
    </form>
  );
}
