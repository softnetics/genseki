'use client'

import { createContext, useContext } from 'react'

export interface NavigationContextValue {
  navigate: (path: string, type?: 'push' | 'replace') => void
  getPathname: () => string
  refresh: () => void
}

export const NavigationContext = createContext<NavigationContextValue>(null!)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}
