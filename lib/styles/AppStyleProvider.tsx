"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "@/lib/styles/GlobalStyle";
import { theme } from "@/lib/styles/theme";

type AppStyleProviderProps = {
  children: ReactNode;
};

export function AppStyleProvider({ children }: AppStyleProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
