"use client";

import Link from "next/link";
import styled from "styled-components";

import { appNavigationItems } from "@/components/layout/navigation";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

type MobileNavigationProps = {
  pathname: string;
};

const MobileHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: saturate(180%) blur(20px);

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileHeaderInner = styled.div`
  display: flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const Brand = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  &:hover {
    text-decoration: none;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  overflow-x: auto;
  padding: 0 ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[3]};
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MobileLink = styled(Link)<{ $active: boolean }>`
  flex: 0 0 auto;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.textPrimary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $active }) => ($active ? theme.colors.textPrimary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.textOnDark : theme.colors.textPrimary)};
  padding: 0.5rem 0.875rem;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  &:hover {
    text-decoration: none;
  }
`;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ pathname }: MobileNavigationProps) {
  return (
    <MobileHeader>
      <MobileHeaderInner>
        <Brand href="/dashboard">Workout Log</Brand>
        <LogoutButton variant="ghost" />
      </MobileHeaderInner>
      <MobileNav aria-label="アプリナビゲーション">
        {appNavigationItems.map((item) => (
          <MobileLink key={item.href} href={item.href} $active={isActivePath(pathname, item.href)}>
            {item.label}
          </MobileLink>
        ))}
      </MobileNav>
    </MobileHeader>
  );
}
