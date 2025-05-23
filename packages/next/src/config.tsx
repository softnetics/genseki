import type { ReactNode } from 'react'

import { createRouter } from 'radix3'

import type {
  ApiRouter,
  AuthHandlers,
  Collection,
  MinimalContext,
  ServerConfig,
} from '@kivotos/core'

import { createApiResourceRouter } from './resource'
import type { ServerFunction } from './server-function'
import { AuthLayout } from './views/auth/layout'
import { LoginView } from './views/auth/login'
import { SignUpView } from './views/auth/sign-up'
import { CreateView } from './views/collections/create'
import { CollectionLayout } from './views/collections/layout'
import { ListView } from './views/collections/list'
import { OneView } from './views/collections/one'
import { UpdateView } from './views/collections/update'

export type RouterData =
  | {
      view: (args: {
        user: any // TODO
        params: any
        serverConfig: ServerConfig
        serverFunction: ServerFunction
        searchParams: { [key: string]: string | string[] }
      }) => ReactNode
      requiredAuthentication: true
    }
  | {
      view: (args: {
        params: any
        serverConfig: ServerConfig
        serverFunction: ServerFunction
        searchParams: { [key: string]: string | string[] }
      }) => ReactNode
      requiredAuthentication: false
    }

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
  TApiRouter extends ApiRouter<TContext> = AuthHandlers & ApiRouter<any>,
> extends ServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<RouterData>>
  resourceRouter: ReturnType<typeof createApiResourceRouter>
}

export function defineNextJsServerConfig<
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
  const radixRouter = createRouter<RouterData>()

  // Collection
  radixRouter.insert(`/collections/:slug`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <ListView {...args} {...args.params} />,
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/:identifier`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <OneView {...args} {...args.params} />
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/create`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <CreateView {...args} {...args.params} />
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug/update/:identifier`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <UpdateView {...args} {...args.params} />
      </CollectionLayout>
    ),
  })

  // Auth
  radixRouter.insert(`/auth/login`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      serverFunction: ServerFunction
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <LoginView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/sign-up`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <SignUpView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/forgot-password`, {
    requiredAuthentication: false,
    view: (args: {
      params: { slug: string; identifier: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => <AuthLayout serverConfig={args.serverConfig}>TODO</AuthLayout>,
  })
  radixRouter.insert(`/auth/reset-password`, {
    requiredAuthentication: false,
    view: (args: {
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => <AuthLayout serverConfig={args.serverConfig}>TODO</AuthLayout>,
  })

  return {
    ...serverConfig,
    radixRouter,
    resourceRouter: createApiResourceRouter(serverConfig),
  }
}
