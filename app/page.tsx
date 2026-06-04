"use client";

import Link from "next/link";
import styled from "styled-components";

const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.backgroundElevated};
`;

const Content = styled.div`
  display: grid;
  width: min(100% - 2rem, ${({ theme }) => theme.layout.contentMaxWidth});
  min-height: 100vh;
  align-content: center;
  gap: ${({ theme }) => theme.space[6]};
  margin: 0 auto;
  padding: clamp(3rem, 8vw, 6rem) 0;
`;

const Hero = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  max-width: 46rem;
`;

const Eyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(2.5rem, 7vw, ${({ theme }) => theme.fontSizes.pageTitle});
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.heading};
  letter-spacing: ${({ theme }) => theme.letterSpacing.tight};
`;

const Lead = styled.p`
  max-width: 38rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.subtitle};
  line-height: ${({ theme }) => theme.lineHeights.compact};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const AuthActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
`;

const AuthLink = styled(Link)<{ $variant?: "primary" | "secondary" }>`
  display: inline-flex;
  min-height: 2.75rem;
  min-width: 8rem;
  align-items: center;
  justify-content: center;
  border: 1px solid
    ${({ theme, $variant }) => ($variant === "secondary" ? theme.colors.appleBlue : "transparent")};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $variant }) =>
    $variant === "secondary" ? "transparent" : theme.colors.appleBlue};
  color: ${({ theme, $variant }) => ($variant === "secondary" ? theme.colors.appleBlue : "#fff")};
  padding: 0.625rem 1.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    transform 160ms ease;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === "secondary" ? "rgba(0, 113, 227, 0.08)" : theme.colors.linkBlue};
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

export default function HomePage() {
  return (
    <Page>
      <Content>
        <Hero>
          <Eyebrow>Training Dashboard</Eyebrow>
          <Title>Workout Log</Title>
          <Lead>前回の重量、今週の頻度、目標までの距離をひとつの画面で確認できます。</Lead>
        </Hero>

        <AuthActions aria-label="認証メニュー">
          <AuthLink href="/login">ログイン</AuthLink>
          <AuthLink href="/login?mode=signUp" $variant="secondary">
            新規登録
          </AuthLink>
        </AuthActions>
      </Content>
    </Page>
  );
}
