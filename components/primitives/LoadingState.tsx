"use client";

import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%,
  100% {
    opacity: 0.42;
  }

  50% {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

const Header = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  max-width: 36rem;
`;

const Skeleton = styled.div<{ $height: string; $width?: string }>`
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme }) => theme.colors.border};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: ${({ theme }) => theme.space[4]};
`;

export function LoadingState() {
  return (
    <Wrapper aria-label="読み込み中" aria-busy="true" role="status">
      <Header>
        <Skeleton $height="2.5rem" $width="60%" />
        <Skeleton $height="1rem" $width="90%" />
      </Header>
      <Grid>
        <Skeleton $height="9rem" />
        <Skeleton $height="9rem" />
        <Skeleton $height="9rem" />
      </Grid>
    </Wrapper>
  );
}
