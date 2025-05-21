'use client'

import type { ServerConfig } from '@kivotos/core'

import { useServerFunction } from '../providers/root'

// TODO: Fix this
export function Form<TServerConfig extends ServerConfig>(props: any) {
  const serverFunction = useServerFunction<TServerConfig>()

  return (
    <form
    // action={async (formData) => {
    //   const data = Object.fromEntries(formData)
    //   await serverFunction({
    //     slug: props.slug,
    //     method: props.method,
    //     payload: {
    //       ...(props.id ? { id: props.id } : {}),
    //       data: data as any,
    //     },
    //   } as any)
    // }}
    >
      {props.children}
    </form>
  )
}
