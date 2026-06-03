"use client";

import type { HTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

const StyledCard = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.background};
  padding: clamp(1rem, 2vw, 1.5rem);
`;

const StyledCardHeader = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

const StyledCardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const StyledCardDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  line-height: 1.5;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const StyledCardBody = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export function Card({ children, ...props }: CardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}

export function CardHeader({ children, ...props }: CardProps) {
  return <StyledCardHeader {...props}>{children}</StyledCardHeader>;
}

export function CardTitle({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <StyledCardTitle {...props}>{children}</StyledCardTitle>;
}

export function CardDescription({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <StyledCardDescription {...props}>{children}</StyledCardDescription>;
}

export function CardBody({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <StyledCardBody {...props}>{children}</StyledCardBody>;
}
