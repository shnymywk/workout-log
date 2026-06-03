"use client";

import Link from "next/link";
import styled from "styled-components";

import type { BodyPart } from "@/features/exercises/types/body-part";

type ExerciseFilterProps = {
  bodyParts: BodyPart[];
  selectedBodyPartId: string | null;
};

const Filter = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const FilterLink = styled(Link)<{ $active: boolean }>`
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

export function ExerciseFilter({ bodyParts, selectedBodyPartId }: ExerciseFilterProps) {
  return (
    <Filter aria-label="部位フィルター">
      <FilterLink href="/exercises" $active={!selectedBodyPartId}>
        すべて
      </FilterLink>
      {bodyParts.map((bodyPart) => (
        <FilterLink
          key={bodyPart.id}
          href={`/exercises?bodyPartId=${bodyPart.id}`}
          $active={selectedBodyPartId === bodyPart.id}
        >
          {bodyPart.name}
        </FilterLink>
      ))}
    </Filter>
  );
}
