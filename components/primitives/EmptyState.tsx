"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

type EmptyStateProps = {
  action?: ReactNode;
  children: ReactNode;
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space[3]};
  border: 1px dashed rgba(24, 124, 112, 0.3);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #f7faf9;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.space[6]};
  text-align: center;
`;

const Copy = styled.p`
  margin: 0;
  max-width: 32rem;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: ${({ theme }) => theme.lineHeights.body};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function EmptyState({ action, children }: EmptyStateProps) {
  return (
    <Wrapper>
      <Copy>{children}</Copy>
      {action}
    </Wrapper>
  );
}
