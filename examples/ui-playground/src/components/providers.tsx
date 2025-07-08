'use client'

import type { PropsWithChildren } from 'react'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

import { Toast } from '@genseki/react'

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
      <Toast />
    </NextThemesProvider>
  )
}
