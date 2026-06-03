"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

type PageHeaderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[10]};

  @media (max-width: 833px) {
    display: grid;
    align-items: start;
    margin-bottom: ${({ theme }) => theme.space[6]};
  }
`;

const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  max-width: 42rem;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  @media (max-width: 833px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.body};
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[3]};
`;

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <Header>
      <Copy>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Copy>
      {children ? <Actions>{children}</Actions> : null}
    </Header>
  );
}
