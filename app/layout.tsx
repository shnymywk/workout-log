import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import type { ReactNode } from "react";

import { AppStyleProvider } from "@/lib/styles/AppStyleProvider";
import { StyledComponentsRegistry } from "@/lib/styles/StyledComponentsRegistry";

const brandFont = Outfit({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-brand"
});

export const metadata: Metadata = {
  title: "Workout Log",
  description: "A simple training record app for tracking workout progress."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className={brandFont.variable}>
        <StyledComponentsRegistry>
          <AppStyleProvider>{children}</AppStyleProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
