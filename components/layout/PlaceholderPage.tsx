"use client";

import styled from "styled-components";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/primitives";

type PlaceholderPageProps = {
  title: string;
  description: string;
  actionLabel?: string;
  cards: {
    title: string;
    description: string;
  }[];
};

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]};

  @media (max-width: 833px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.caption};
  letter-spacing: ${({ theme }) => theme.letterSpacing.normal};
`;

export function PlaceholderPage({ title, description, actionLabel, cards }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description}>
        {actionLabel ? <Button>{actionLabel}</Button> : null}
      </PageHeader>

      <Grid>
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardBody>
              <EmptyText>この機能は次以降のフェーズで実装します。</EmptyText>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </>
  );
}
