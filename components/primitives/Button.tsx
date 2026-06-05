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
  min-width: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  padding: 0.625rem 1.375rem;
  font-size: 1rem;
  font-weight: 700;
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

  &[aria-busy="true"] {
    cursor: progress;
  }

  ${({ $variant }) => {
    if ($variant === "secondary") {
      return css`
        background: #ffffff;
        border-color: rgba(24, 124, 112, 0.32);
        color: #187c70;

        &:hover:not(:disabled) {
          background: #edf6f4;
          border-color: rgba(24, 124, 112, 0.44);
        }
      `;
    }

    if ($variant === "ghost") {
      return css`
        background: transparent;
        color: #187c70;

        &:hover:not(:disabled) {
          background: #edf6f4;
        }
      `;
    }

    return css`
      background: #187c70;
      color: #fff;

      &:hover:not(:disabled) {
        background: #104b44;
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
