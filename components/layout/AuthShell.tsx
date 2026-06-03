"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import styled from "styled-components";

type AuthShellProps = {
  children: ReactNode;
};

const Shell = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundElevated};
`;

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(20px);
`;

const HeaderInner = styled.div`
  display: flex;
  min-height: 3.5rem;
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin: 0 auto;
`;

const Brand = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  &:hover {
    text-decoration: none;
  }
`;

const HeaderLink = styled(Link)`
  color: ${({ theme }) => theme.colors.linkBlue};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Content = styled.div`
  display: grid;
  width: min(100% - 2rem, 28rem);
  min-height: calc(100vh - 3.5rem);
  align-items: center;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} 0;
`;

export function AuthShell({ children }: AuthShellProps) {
  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand href="/">Workout Log</Brand>
          <HeaderLink href="/dashboard">ダッシュボード</HeaderLink>
        </HeaderInner>
      </Header>
      <Content>{children}</Content>
    </Shell>
  );
}
