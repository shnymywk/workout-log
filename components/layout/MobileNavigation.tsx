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
  min-height: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  padding: 0 max(${({ theme }) => theme.space[4]}, env(safe-area-inset-right)) 0
    max(${({ theme }) => theme.space[4]}, env(safe-area-inset-left));
`;

const Brand = styled(Link)`
  min-width: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: none;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  padding: 0 max(${({ theme }) => theme.space[4]}, env(safe-area-inset-right))
    ${({ theme }) => theme.space[3]}
    max(${({ theme }) => theme.space[4]}, env(safe-area-inset-left));
  scroll-padding-inline: ${({ theme }) => theme.space[4]};
  scroll-snap-type: x proximity;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MobileLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  flex: 0 0 auto;
  min-height: 2.75rem;
  align-items: center;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.textPrimary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $active }) => ($active ? theme.colors.textPrimary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.textOnDark : theme.colors.textPrimary)};
  padding: 0.5rem 1rem;
  scroll-snap-align: start;
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
        {appNavigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <MobileLink
              key={item.href}
              href={item.href}
              $active={active}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </MobileLink>
          );
        })}
      </MobileNav>
    </MobileHeader>
  );
}
