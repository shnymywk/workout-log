"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
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
  border-bottom: 1px solid rgba(20, 32, 29, 0.1);
  background: rgba(255, 255, 255, 0.92);
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
  display: inline-flex;
  min-width: 0;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    text-decoration: none;
  }
`;

const BrandMark = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.card};
  background: #187c70;
  color: #ffffff;
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
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(24, 124, 112, 0.28)" : "rgba(20, 32, 29, 0.1)")};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active }) => ($active ? "#187c70" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#101816")};
  padding: 0.5rem 1rem;
  scroll-snap-align: start;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    border-color 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#104b44" : "#edf6f4")};
    text-decoration: none;
  }
`;

const MobileLinkIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
`;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavigation({ pathname }: MobileNavigationProps) {
  return (
    <MobileHeader>
      <MobileHeaderInner>
        <Brand href="/dashboard">
          <BrandMark aria-hidden="true">
            <Activity size={18} strokeWidth={2.4} />
          </BrandMark>
          Workout Log
        </Brand>
        <LogoutButton variant="ghost" />
      </MobileHeaderInner>
      <MobileNav aria-label="アプリナビゲーション">
        {appNavigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <MobileLink
              key={item.href}
              href={item.href}
              $active={active}
              aria-current={active ? "page" : undefined}
            >
              <MobileLinkIcon aria-hidden="true">
                <Icon size={16} strokeWidth={2.2} />
              </MobileLinkIcon>
              {item.label}
            </MobileLink>
          );
        })}
      </MobileNav>
    </MobileHeader>
  );
}
