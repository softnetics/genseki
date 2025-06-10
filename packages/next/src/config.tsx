import type { ReactNode } from 'react'

import { createRouter } from 'radix3'

import {
  type ApiRouter,
  type AuthHandlers,
  AuthLayout,
  type Collection,
  CollectionLayout,
  type Context,
  CreateView,
  HomeView,
  ListView,
  LoginView,
  OneView,
  type ServerConfig,
  type ServerFunction,
  SignUpView,
  UpdateView,
} from '@genseki/react'

import { createApiResourceRouter } from './resource'
import { ForgotPasswordView } from './views/auth/forgot-password/forgot-password'
import { ResetPasswordView } from './views/auth/reset-password/reset-password'

export type RouterData =
  | {
      view: (args: {
        user: any // TODO
        params: any
        headers: Headers
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
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
  TCollections extends Record<string, Collection<any, any, any, any, any, any>> = Record<
    string,
    Collection<any, any, any, any, any, any>
  >,
  TApiRouter extends ApiRouter<TContext> = AuthHandlers & ApiRouter<any>,
> extends ServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  radixRouter: ReturnType<typeof createRouter<RouterData>>
  resourceRouter: ReturnType<typeof createApiResourceRouter>
}

export function defineNextJsServerConfig<
  TFullSchema extends Record<string, unknown> = Record<string, unknown>,
  TContext extends Context<TFullSchema> = Context<TFullSchema>,
  TCollections extends Record<string, Collection<any, any, any, any, any, any>> = Record<
    string,
    Collection<any, any, any, any, any, any>
  >,
  TApiRouter extends ApiRouter<TContext> = ApiRouter<any>,
>(
  serverConfig: ServerConfig<TFullSchema, TContext, TCollections, TApiRouter>
): NextJsServerConfig<TFullSchema, TContext, TCollections, TApiRouter> {
  const radixRouter = createRouter<RouterData>()

  // Collection
  radixRouter.insert(`/collections`, {
    requiredAuthentication: true,
    view: (args: {
      params: { slug: string }
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <CollectionLayout serverConfig={args.serverConfig}>
        <HomeView serverConfig={args.serverConfig} />
      </CollectionLayout>
    ),
  })
  radixRouter.insert(`/collections/:slug`, {
    requiredAuthentication: true,
    view: (args: {
      headers: Headers
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
      headers: Headers
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
      headers: Headers
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
      headers: Headers
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
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <ForgotPasswordView {...args} {...args.params} />
      </AuthLayout>
    ),
  })
  radixRouter.insert(`/auth/reset-password`, {
    requiredAuthentication: false,
    view: (args: {
      serverConfig: ServerConfig
      searchParams: { [key: string]: string | string[] }
    }) => (
      <AuthLayout serverConfig={args.serverConfig}>
        <ResetPasswordView {...args} />
      </AuthLayout>
    ),
  })

  return {
    ...serverConfig,
    radixRouter,
    resourceRouter: createApiResourceRouter(serverConfig),
  }
}
