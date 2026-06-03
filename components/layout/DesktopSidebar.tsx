"use client";

import Link from "next/link";
import styled from "styled-components";

import { Button } from "@/components/primitives";
import { appNavigationItems } from "@/components/layout/navigation";

type DesktopSidebarProps = {
  pathname: string;
};

const Sidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    border-right: 1px solid ${({ theme }) => theme.colors.border};
    background: rgba(255, 255, 255, 0.88);
    padding: ${({ theme }) => theme.space[6]};
    backdrop-filter: saturate(180%) blur(20px);
  }
`;

const SidebarHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[8]};
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

const BrandCaption = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarNav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SidebarLink = styled(Link)<{ $active: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.border : "transparent")};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.backgroundElevated : "transparent"};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundElevated};
    text-decoration: none;
  }
`;

const SidebarLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarDescription = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8125rem;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarFooter = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: auto;
`;

const UserSummary = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

const UserName = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const UserEmail = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.8125rem;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopSidebar({ pathname }: DesktopSidebarProps) {
  return (
    <Sidebar aria-label="アプリナビゲーション">
      <SidebarHeader>
        <Brand href="/dashboard">Workout Log</Brand>
        <BrandCaption>Personal training journal</BrandCaption>
      </SidebarHeader>

      <SidebarNav>
        {appNavigationItems.map((item) => (
          <SidebarLink key={item.href} href={item.href} $active={isActivePath(pathname, item.href)}>
            <SidebarLabel>{item.label}</SidebarLabel>
            <SidebarDescription>{item.description}</SidebarDescription>
          </SidebarLink>
        ))}
      </SidebarNav>

      <SidebarFooter>
        <UserSummary>
          <UserName>Shunya Miyawaki</UserName>
          <UserEmail>sample@example.com</UserEmail>
        </UserSummary>
        <Button variant="secondary">ログアウト</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
