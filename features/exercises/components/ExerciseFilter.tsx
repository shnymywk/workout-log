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
  border: 1px solid rgba(20, 32, 29, 0.1);
  border-radius: ${({ theme }) => theme.radii.card};
  background: #f7faf9;
  padding: ${({ theme }) => theme.space[4]};
`;

const FilterLink = styled(Link)<{ $active: boolean }>`
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(24, 124, 112, 0.28)" : "rgba(20, 32, 29, 0.1)")};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $active }) => ($active ? "#187c70" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#101816")};
  padding: 0.5rem 0.875rem;
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
