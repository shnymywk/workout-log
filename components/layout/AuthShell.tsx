"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

type AuthShellProps = {
  children: ReactNode;
};

const Shell = styled.main`
  display: grid;
  min-height: 100vh;
  align-items: center;
  background: #f3f6f5;
  color: #1b2321;
  padding: ${({ theme }) => theme.space[8]} 0;
`;

const Content = styled.div`
  width: min(100% - 2rem, 28rem);
  margin: 0 auto;
`;

export function AuthShell({ children }: AuthShellProps) {
  return (
    <Shell>
      <Content>{children}</Content>
    </Shell>
  );
}
