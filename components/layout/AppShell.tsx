"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styled from "styled-components";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

type AppShellProps = {
  children: ReactNode;
};

const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundElevated};

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 17.5rem minmax(0, 1fr);
  }
`;

const Main = styled.main`
  min-width: 0;
`;

const MainInner = styled.div`
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3rem) 0;
`;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <Shell>
      <DesktopSidebar pathname={pathname} />

      <div>
        <MobileNavigation pathname={pathname} />

        <Main>
          <MainInner>{children}</MainInner>
        </Main>
      </div>
    </Shell>
  );
}
