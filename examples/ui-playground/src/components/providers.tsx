'use client'

import type { PropsWithChildren } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { Toaster } from '@genseki/react/v2'

export function Providers(props: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {props.children}
      <Toaster />
    </NextThemesProvider>
  )
}
