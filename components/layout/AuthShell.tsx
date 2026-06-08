"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import styled from "styled-components";

type AuthShellProps = {
  children: ReactNode;
};

const Shell = styled.main`
  display: grid;
  min-height: 100vh;
  align-content: center;
  gap: ${({ theme }) => theme.space[5]};
  background: #f3f6f5;
  color: #1b2321;
  padding: ${({ theme }) => theme.space[8]} 0;
`;

const Content = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  width: min(100% - 2rem, 28rem);
  margin: 0 auto;
`;

const HomeLink = styled(Link)`
  justify-self: end;
  color: #187c70;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function AuthShell({ children }: AuthShellProps) {
  return (
    <Shell>
      <Content>
        {children}
        <HomeLink href="/">トップへ戻る</HomeLink>
      </Content>
    </Shell>
  );
}
