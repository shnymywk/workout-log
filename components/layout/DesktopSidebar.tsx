"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import styled from "styled-components";

import { appNavigationItems } from "@/components/layout/navigation";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

type DesktopSidebarProps = {
  ownerEmail: string | null;
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
    border-right: 1px solid rgba(20, 32, 29, 0.1);
    background: rgba(255, 255, 255, 0.92);
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
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: #101816;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};

  &:hover {
    text-decoration: none;
  }
`;

const BrandMark = styled.span`
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.card};
  background: #187c70;
  color: #ffffff;
`;

const BrandCaption = styled.p`
  margin: 0;
  color: #66726f;
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

const SidebarNav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const SidebarLink = styled(Link)<{ $active: boolean }>`
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
  border: 1px solid ${({ $active }) => ($active ? "rgba(24, 124, 112, 0.22)" : "transparent")};
  border-radius: ${({ theme }) => theme.radii.card};
  background: ${({ $active }) => ($active ? "#edf6f4" : "transparent")};
  color: #101816;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
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

const UserSummary = styled.div`
  display: grid;
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

export function DesktopSidebar({ ownerEmail, pathname }: DesktopSidebarProps) {
  return (
    <Sidebar aria-label="アプリナビゲーション">
      <SidebarHeader>
        <Brand href="/dashboard">
          <BrandMark aria-hidden="true">
            <Activity size={18} strokeWidth={2.4} />
          </BrandMark>
          Workout Log
        </Brand>
        <BrandCaption>Personal training journal</BrandCaption>
      </SidebarHeader>

      <SidebarNav>
        {appNavigationItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <SidebarLink key={item.href} href={item.href} $active={active}>
              <SidebarIcon $active={active} aria-hidden="true">
                <Icon size={18} strokeWidth={2.2} />
              </SidebarIcon>
              <SidebarText>
                <SidebarLabel>{item.label}</SidebarLabel>
                <SidebarDescription>{item.description}</SidebarDescription>
              </SidebarText>
            </SidebarLink>
          );
        })}
      </SidebarNav>

      <SidebarFooter>
        <UserSummary>
          <UserName>Shunya Miyawaki</UserName>
          <UserEmail>{ownerEmail ?? "メールアドレス未取得"}</UserEmail>
        </UserSummary>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
