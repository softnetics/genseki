'use client'

import { PropsWithChildren } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

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
    </NextThemesProvider>
  )
}
