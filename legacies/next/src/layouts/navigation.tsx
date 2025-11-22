'use client'

import type { ReactNode } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { NavigationContext } from '@genseki/react'

export function NextNavigationProvider(props: { children: ReactNode }) {
  const router = useRouter()

  return (
    <NavigationContext.Provider
      value={{
        navigate: (path, _type) => {
          const type = _type || 'push'
          switch (type) {
            case 'push':
              return router.push(path, { scroll: true })
            case 'replace':
              return router.replace(path, { scroll: true })
          }
        },
        getPathname: () => {
          return usePathname()
        },
        refresh: () => {
          router.refresh()
        },
      }}
    >
      {props.children}
    </NavigationContext.Provider>
  )
}
