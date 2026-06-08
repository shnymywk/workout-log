"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import styled from "styled-components";

import { appNavigationItems } from "@/components/layout/navigation";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

type DesktopSidebarProps = {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  ownerEmail: string | null;
  pathname: string;
};

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  display: none;

  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    border-right: 1px solid rgba(20, 32, 29, 0.1);
    background: rgba(255, 255, 255, 0.92);
    padding: ${({ theme, $collapsed }) =>
      $collapsed ? `${theme.space[5]} ${theme.space[3]}` : theme.space[6]};
    backdrop-filter: saturate(180%) blur(20px);
    transition: padding 180ms ease;
  }
`;

const SidebarHeader = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const HeaderTop = styled.div<{ $collapsed: boolean }>`
  display: grid;
  grid-template-columns: ${({ $collapsed }) => ($collapsed ? "1fr" : "2.75rem minmax(0, 1fr)")};
  grid-column: 1 / -1;
  align-items: center;
  justify-items: ${({ $collapsed }) => ($collapsed ? "center" : "stretch")};
  column-gap: ${({ theme }) => theme.space[3]};
`;

const Brand = styled(Link)`
  display: grid;
  gap: 0.125rem;
  line-height: 1.1;
  min-width: 0;
  color: #101816;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  &:hover {
    text-decoration: none;
  }
`;

const BrandText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-brand), ${({ theme }) => theme.fonts.display};
  font-size: 1.32rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.18;
  padding-bottom: 0.03em;
  white-space: nowrap;
`;

const BrandToggleButton = styled.button`
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  grid-column: 1;
  grid-row: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.card};
  background: #187c70;
  color: #ffffff;
  cursor: pointer;
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: rgba(16, 75, 68, 0.16);
    background: #104b44;
    transform: translateY(-1px);
  }
`;

const BrandCaption = styled.span`
  margin: 0;
  color: #66726f;
  font-family: var(--font-brand), ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  line-height: 1.2;
`;

const SidebarNav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SidebarLink = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  display: grid;
  grid-template-columns: ${({ $collapsed }) =>
    $collapsed ? "minmax(0, 1fr)" : "2.25rem minmax(0, 1fr)"};
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  justify-items: ${({ $collapsed }) => ($collapsed ? "center" : "stretch")};
  border: 1px solid ${({ $active }) => ($active ? "rgba(24, 124, 112, 0.22)" : "transparent")};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ $active }) => ($active ? "#edf6f4" : "transparent")};
  color: #101816;
  padding: ${({ theme, $collapsed }) =>
    $collapsed ? theme.space[2] : `${theme.space[3]} ${theme.space[4]}`};
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    padding 180ms ease,
    transform 160ms ease;

  &:hover {
    border-color: rgba(24, 124, 112, 0.16);
    background: #f3f6f5;
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

const SidebarIcon = styled.span<{ $active: boolean }>`
  display: inline-flex;
  width: 2.25rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ $active }) => ($active ? "#187c70" : "#f7faf9")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#187c70")};
`;

const SidebarText = styled.span`
  display: grid;
  min-width: 0;
  gap: ${({ theme }) => theme.space[1]};
`;

const SidebarLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarDescription = styled.span`
  color: #66726f;
  font-size: 0.8125rem;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarFooter = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: auto;
`;

const UserSummary = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? "none" : "grid")};
  gap: ${({ theme }) => theme.space[1]};
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #f7faf9;
  padding: ${({ theme }) => theme.space[4]};
`;

const UserName = styled.p`
  margin: 0;
  color: #101816;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const UserEmail = styled.p`
  margin: 0;
  color: #66726f;
  font-size: 0.8125rem;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  overflow-wrap: anywhere;
`;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopSidebar({
  collapsed = false,
  ownerEmail,
  pathname,
  onToggleCollapsed
}: DesktopSidebarProps) {
  return (
    <Sidebar $collapsed={collapsed} aria-label="アプリナビゲーション">
      <SidebarHeader>
        <HeaderTop $collapsed={collapsed}>
          <BrandToggleButton
            type="button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
            title={collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
            onClick={onToggleCollapsed}
          >
            <Activity size={18} strokeWidth={2.4} aria-hidden="true" />
          </BrandToggleButton>
          {collapsed ? null : (
            <Brand href="/dashboard" aria-label="Workout Log ダッシュボード">
              <BrandText>Workout Log</BrandText>
              <BrandCaption>Personal training journal</BrandCaption>
            </Brand>
          )}
        </HeaderTop>
      </SidebarHeader>

      <SidebarNav>
        {appNavigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              aria-label={collapsed ? item.label : undefined}
              $active={active}
              $collapsed={collapsed}
            >
              <SidebarIcon $active={active} aria-hidden="true">
                <Icon size={18} strokeWidth={2.2} />
              </SidebarIcon>
              {collapsed ? null : (
                <SidebarText>
                  <SidebarLabel>{item.label}</SidebarLabel>
                  <SidebarDescription>{item.description}</SidebarDescription>
                </SidebarText>
              )}
            </SidebarLink>
          );
        })}
      </SidebarNav>

      <SidebarFooter>
        {collapsed ? null : (
          <UserSummary $collapsed={collapsed}>
            <UserName>Shunya Miyawaki</UserName>
            <UserEmail>{ownerEmail ?? "メールアドレス未取得"}</UserEmail>
          </UserSummary>
        )}
        <LogoutButton compact={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}
