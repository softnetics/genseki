'use client'

import type { ServerConfig } from '@repo/drizzlify'

import { useServerFunction } from '~/providers/root'

import { GetServerMethod } from '../server-function'

export function Form<
  TServerConfig extends ServerConfig,
  TMethod extends GetServerMethod<TServerConfig> = GetServerMethod<TServerConfig>,
>(props: Omit<TMethod, 'payload'> & { id?: string; children: React.ReactNode }) {
  const serverFunction = useServerFunction<TServerConfig>()

  return (
    <form
      action={async (formData) => {
        const data = Object.fromEntries(formData)
        await serverFunction({
          slug: props.slug,
          method: props.method,
          payload: {
            ...(props.id && { id: props.id }),
            data: data as any,
          },
        } as any)
      }}
    >
      {props.children}
    </form>
  )
}
