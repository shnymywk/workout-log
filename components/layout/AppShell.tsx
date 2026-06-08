"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import styled from "styled-components";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

type AppShellProps = {
  children: ReactNode;
  ownerEmail: string | null;
};

const Shell = styled.div<{ $sidebarCollapsed: boolean }>`
  min-height: 100vh;
  background: #f3f6f5;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: ${({ $sidebarCollapsed }) =>
      $sidebarCollapsed ? "5.5rem minmax(0, 1fr)" : "19.5rem minmax(0, 1fr)"};
    transition: grid-template-columns 180ms ease;
  }
`;

const Main = styled.main`
  min-width: 0;
`;

const MainInner = styled.div`
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} 0 ${({ theme }) => theme.space[12]};

  @media (min-width: 1024px) {
    width: min(100% - 4rem, ${({ theme }) => theme.layout.contentMaxWidth});
    padding: ${({ theme }) => theme.space[8]} 0 ${({ theme }) => theme.space[16]};
  }
`;

export function AppShell({ children, ownerEmail }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Shell $sidebarCollapsed={sidebarCollapsed}>
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        ownerEmail={ownerEmail}
        pathname={pathname}
        onToggleCollapsed={() => setSidebarCollapsed((currentValue) => !currentValue)}
      />

      <div>
        <MobileNavigation pathname={pathname} />

        <Main>
          <MainInner>{children}</MainInner>
        </Main>
      </div>
    </Shell>
  );
}
