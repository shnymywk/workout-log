import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return <AppShell ownerEmail={data.user?.email ?? null}>{children}</AppShell>;
}
