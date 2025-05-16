'use client'

import React from 'react'
import { RouterProvider } from 'react-aria-components'

import { useRouter } from 'next/navigation'

import { ThemeProvider } from './theme-provider'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
  }
}

export function UiProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <RouterProvider navigate={router.push}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        {children}
      </ThemeProvider>
    </RouterProvider>
  )
}
