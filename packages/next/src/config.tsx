import type { ReactNode } from 'react'

import { createRouter } from 'radix3'

import type { ApiRouter, Collection, MinimalContext, ServerConfig } from '@kivotos/core'

import { createApiResourceRouter } from './resource'
import { AuthLayout } from './views/auth/layout'
import { SignInView } from './views/auth/sign-in'
import { CreateView } from './views/collections/create'
import { CollectionLayout } from './views/collections/layout'
import { ListView } from './views/collections/list'
import { OneView } from './views/collections/one'
import { UpdateView } from './views/collections/update'

export interface NextJsServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext<TFullSchema> = MinimalContext<TFullSchema>,
  TCollections extends Collection<any, any, any, any, any, any>[] = Collection<
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TApiRouter extends ApiRouter<TContext> = ApiRouter<any>,
> extends ServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<{ view: (args: any) => ReactNode }>>
  resourceRouter: ReturnType<typeof createApiResourceRouter>
}

export function wrapNextJs<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends MinimalContext<TFullSchema> = MinimalContext<TFullSchema>,
  TCollections extends Collection<any, any, any, any, any, any>[] = Collection<
    any,
    any,
    any,
    any,
    any,
    any
  >[],
  TApiRouter extends ApiRouter<TContext> = ApiRouter<any>,
>(
  serverConfig: ServerConfig<TFullSchema, TContext, TCollections, TApiRouter>
): NextJsServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  const radixRouter = createRouter<{ view: (args: any) => ReactNode }>()

  // Collection
  radixRouter.insert(`/collections/:slug`, {
    view: (args: {
      slug: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <ListView {...args} />,
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/:identifier`, {
    view: (args: {
      slug: string
      identifier: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <OneView {...args} />
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/create`, {
    view: (args: {
      slug: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <CreateView {...args} />
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/update/:identifier`, {
    view: (args: {
      slug: string
      identifier: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <UpdateView {...args} />
      </CollectionLayout>
    ),
  })

  // Auth
  radixRouter.insert(`/auth/sign-in`, {
    view: (args: {
      slug: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <SignInView {...args} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/sign-up`, {
    view: (args: {
      slug: string
      identifier: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <OneView {...args} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/forgot-password`, {
    view: (args: {
      slug: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <CreateView {...args} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/reset-password`, {
    view: (args: {
      slug: string
      identifier: string
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <UpdateView {...args} />
      </AuthLayout>
    ),
  })

  return {
    ...serverConfig,
    radixRouter,
    resourceRouter: createApiResourceRouter(serverConfig),
  }
}
