"use client";

import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import styled, { css } from "styled-components";

type FieldProps = {
  children: ReactNode;
};

const FieldWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
  line-height: 1.4;
`;

const controlStyles = css`
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.control};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  line-height: 1.4;
  padding: 0.75rem 0.875rem;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.appleBlue};
  }

  &[aria-invalid="true"] {
    border-color: ${({ theme }) => theme.colors.danger};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundElevated};
    cursor: not-allowed;
    opacity: 0.72;
  }
`;

const StyledInput = styled.input`
  ${controlStyles}
`;

const StyledSelect = styled.select`
  ${controlStyles}
  appearance: none;
`;

const StyledTextarea = styled.textarea`
  ${controlStyles}
  min-height: 7.5rem;
  resize: vertical;
`;

export function Field({ children }: FieldProps) {
  return <FieldWrapper>{children}</FieldWrapper>;
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <StyledLabel {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <StyledInput {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <StyledSelect {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <StyledTextarea {...props} />;
}
