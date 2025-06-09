'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey="bias-lens-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
} 