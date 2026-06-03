"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.625rem 1.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    text-decoration: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  ${({ theme, $variant }) => {
    if ($variant === "secondary") {
      return css`
        background: transparent;
        border-color: ${theme.colors.appleBlue};
        color: ${theme.colors.appleBlue};

        &:hover:not(:disabled) {
          background: rgba(0, 113, 227, 0.08);
        }
      `;
    }

    if ($variant === "ghost") {
      return css`
        background: transparent;
        color: ${theme.colors.linkBlue};

        &:hover:not(:disabled) {
          background: ${theme.colors.backgroundElevated};
        }
      `;
    }

    return css`
      background: ${theme.colors.appleBlue};
      color: #fff;

      &:hover:not(:disabled) {
        background: ${theme.colors.linkBlue};
      }
    `;
  }}
`;

export function Button({ children, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <StyledButton $variant={variant} type={type} {...props}>
      {children}
    </StyledButton>
  );
}
